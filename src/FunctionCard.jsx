import React, { useState, useMemo, useRef } from "react";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";
import { useWeb3 } from "./Web3Context";
import { createValidationSchema } from "./ValidationSchema";
import { FunctionContext } from "./FunctionContext";
import FunctionTitle from "./FunctionTitle";
import FunctionInputs from "./FunctionInputs";
import FunctionOutputs from "./FunctionOutputs";
import FunctionEvents from "./FunctionEvents";

const FunctionCard = ({ f, contract, eventABI }) => {
  const [transactionHash, setTransactionHash] = useState();
  const [returnValues, setReturnValues] = useState();
  const [returnedEvents, setReturnedEvents] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const resultRef = useRef(null);

  const initialValues = useMemo(
    () =>
      f.inputs.reduce((o, input) => Object.assign(o, { [input.name]: "" }), {}),
    [f.inputs]
  );
  if (f.payable) {
    initialValues["payableValue"] = "";
  }

  const web3 = useWeb3();
  const ValidationSchema = useMemo(
    () => createValidationSchema(f.inputs, f.payable, web3),
    [f.inputs, f.payable, web3]
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    // Calculate parameters
    const args = [];
    for (const input of f.inputs) {
      args.push(values[input.name]);
    }

    const method = contract.methods[f.name](...args);
    if (f.constant) {
      // Call
      try {
        const outputs = await method.call();
        if (f.outputs.length === 1) {
          setReturnValues([outputs]);
        } else if (f.outputs.length > 1) {
          setReturnValues(outputs);
        }
      } catch (err) {
        console.log("Something went wrong with the call operation");
        console.log(err);
        enqueueSnackbar("Something went wrong with the call operation");
      }
    } else {
      // Send
      try {
        let options;
        if (f.payable) {
          options = {
            value: web3.utils.toWei(values["payableValue"])
          };
        }

        const outputs = await method
          .send(options)
          .on("transactionHash", value => {
            setTransactionHash(value);
          });
        if (f.outputs.length === 1) {
          setReturnValues([outputs]);
        } else if (f.outputs.length > 1) {
          setReturnValues(outputs);
        }

        // Extract and parse received events
        const processEvent = e => {
          const { event: eventName, returnValues } = e;
          const abi = eventABI.filter(e => e.name === eventName);
          if (abi.length !== 1) {
            console.log("Could not find event ABI");
            return;
          }

          const event = abi[0];
          const attrs = {};
          for (const i of event.inputs) {
            Object.assign(attrs, {
              [i.name]: {
                type: i.type,
                value: returnValues[i.name]
              }
            });
          }
          return { event: e.event, logIndex: e.logIndex, attrs };
        };

        const { events } = outputs;
        const evs = Object.keys(events).flatMap(k => {
          const ev = events[k];
          if (Array.isArray(ev)) {
            return ev.map(e => processEvent(e));
          }
          return processEvent(ev);
        });
        evs.sort((a, b) => a.logIndex - b.logIndex);
        setReturnedEvents(evs);
        enqueueSnackbar("Send operation has been completed", {
          action: (
            <Button
              size="small"
              color="secondary"
              onClick={() =>
                window.scrollTo(0, resultRef.current.offsetTop - 76)
              }
            >
              Go to result
            </Button>
          )
        });
      } catch (err) {
        console.log("User possibly has cancelled the send operation");
        console.log(err);
        enqueueSnackbar("Something went wrong with the send operation");
      }
    }

    setSubmitting(false);
  };

  return (
    <FunctionContext.Provider value={f}>
      <Card>
        <FunctionTitle />
        <Formik
          initialValues={initialValues}
          validateOnChange={false}
          validationSchema={ValidationSchema}
          onSubmit={handleSubmit}
          render={props => (
            <FunctionForm
              resultRef={resultRef}
              transactionHash={transactionHash}
              returnValues={returnValues}
              returnedEvents={returnedEvents}
              {...props}
            />
          )}
        />
      </Card>
    </FunctionContext.Provider>
  );
};

const FunctionForm = ({
  transactionHash,
  returnValues,
  returnedEvents,
  resultRef,
  ...rest
}) => {
  const { isSubmitting } = rest;

  return (
    <>
      <Form noValidate>
        <FunctionInputs transactionHash={transactionHash} {...rest} />
      </Form>
      {!isSubmitting && (returnValues || returnedEvents) && <Divider />}
      <div ref={resultRef} />
      {!isSubmitting && returnValues && (
        <FunctionOutputs
          processing={isSubmitting}
          returnValues={returnValues}
        />
      )}
      {!isSubmitting && returnedEvents && (
        <FunctionEvents events={returnedEvents} />
      )}
    </>
  );
};

export default FunctionCard;
