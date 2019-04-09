import React, { useState, useMemo, useRef, useContext } from "react";
import { withRouter } from "react-router";
import { HashLink as Link } from "react-router-hash-link";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Web3Context } from "./Web3Context";
import AnchorLink from "./AnchorLink";
import { FunctionContext } from "./FunctionContext";
import FunctionInputs from "./FunctionInputs";
import FunctionOutputs from "./FunctionOutputs";
import FunctionEvents from "./FunctionEvents";

const FunctionDefinition = ({ f, contract, eventABI }) => {
  const [transactionHash, setTransactionHash] = useState();
  const [returnValues, setReturnValues] = useState();
  const [returnedEvents, setReturnedEvents] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const resultRef = useRef(null);

  const initialValues = useMemo(
    () =>
      f.inputs.reduce((o, input) => Object.assign(o, { [input.name]: "" }), {}),
    [f]
  );

  const web3 = useContext(Web3Context);
  const ValidationSchema = useMemo(() => {
    const bytesSchema = size => {
      return Yup.string()
        .required("Value is required")
        .test("isHex", "Enter a valid hex string", value =>
          web3.utils.isHexStrict(value)
        )
        .test(
          "isHexSize",
          `Byte array must be of size ${size}`,
          value => value && value.length === size * 2 + 2
        );
    };

    const typesSchema = {
      string: Yup.string().required("Value is required"),
      bool: Yup.boolean().required("Must select a value"),
      uint: Yup.string()
        .required("Value is required")
        .matches(/^\s*[\d]+\s*$/, "Not an unsigned numeric value"),
      int: Yup.string()
        .required("Value is required")
        .matches(/^\s*[-+]?[\d]+\s*$/, "Not a signed numeric value"),
      address: Yup.string()
        .required("Value is required")
        .test("isEthAddress", "Enter a valid ETH address", value =>
          web3.utils.isAddress(value)
        )
    };

    const normalizeType = input => {
      const { name, type } = input;
      let typeSchema;

      if (type === "string" || type === "bool" || type === "address") {
        typeSchema = typesSchema[type];
      } else if (type.startsWith("uint")) {
        typeSchema = typesSchema["uint"];
      } else if (type.startsWith("int")) {
        typeSchema = typesSchema["int"];
      } else if (type.startsWith("bytes")) {
        const size = parseInt(input.type.substr(5));
        typeSchema = bytesSchema(size);
      }

      return {
        name,
        typeSchema
      };
    };

    const shape = f.inputs
      .map(normalizeType)
      .reduce(
        (o, input) => Object.assign(o, { [input.name]: input.typeSchema }),
        {}
      );
    return Yup.object().shape(shape);
  }, [f, web3]);

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
        const outputs = await method.send().on("transactionHash", value => {
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
        <Divider />
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

const functionReturns = f => {
  if (f.outputs.length === 0) {
    return "";
  }

  return (
    f.outputs.reduce(
      (str, o, idx) =>
        str + (idx === 0 ? "" : ", ") + o.type + (o.name ? " " + o.name : ""),
      " returns ("
    ) + ")"
  );
};

const FunctionTitle = withRouter(({ location: { pathname } }) => {
  const f = useContext(FunctionContext);
  return <FunctionHeader f={f} pathname={pathname} />;
});

const FunctionHeader = React.memo(({ f, pathname }) => (
  <CardHeader
    title={<FunctionHeaderTitle f={f} pathname={pathname} />}
    subheader={`interfaceId (${f.signature})`}
  />
));

const FunctionHeaderTitle = ({ f, pathname }) => (
  <Grid alignItems="baseline" spacing={8} container>
    <AnchorLink id={f.name} />
    <Grid item>
      <Typography variant="h6" color="textSecondary">
        <small>function</small>
      </Typography>
    </Grid>
    <Grid item>
      <Typography variant="h6" color="textPrimary">
        <strong>{` ${f.name}(${f.inputs.length > 0 ? "..." : ""})`}</strong>
      </Typography>
    </Grid>
    <Grid item>
      <Typography variant="h6" color="textSecondary">
        <small>
          {" "}
          public {f.constant ? " view" : ""}
          {f.payable ? " payable" : ""}
          {functionReturns(f)}
        </small>
        &nbsp;
        <Link to={{ pathname: pathname, hash: f.name }}>#</Link>
      </Typography>
    </Grid>
  </Grid>
);

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
      <Form className="needs-validation" noValidate>
        <FunctionInputs transactionHash={transactionHash} {...rest} />
      </Form>
      <Divider />
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

export default FunctionDefinition;
