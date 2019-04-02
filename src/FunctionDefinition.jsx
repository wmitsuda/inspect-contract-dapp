import React, { useState, useMemo } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import styled from "styled-components";
import { Formik, Form } from "formik";
import FunctionInputs from "./FunctionInputs";
import FunctionOutputs from "./FunctionOutputs";
import FunctionEvents from "./FunctionEvents";

const FunctionDefinition = ({ f, index, contract, eventABI }) => {
  const [returnValues, setReturnValues] = useState();
  const [returnedEvents, setReturnedEvents] = useState();
  const initialValues = useMemo(
    () =>
      f.inputs.reduce((o, input) => Object.assign(o, { [input.name]: "" }), {}),
    [f]
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
      const outputs = await method.call();
      setReturnValues([outputs]);
    } else {
      // Send
      const outputs = await method.send();
      setReturnValues([outputs.status]);

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
    }

    setSubmitting(false);
  };

  return (
    <FunctionCard>
      <FunctionHeader index={index} f={f} />
      <Divider />
      <Formik
        initialValues={initialValues}
        validateOnChange={false}
        onSubmit={handleSubmit}
        render={props => (
          <FunctionForm
            f={f}
            returnValues={returnValues}
            returnedEvents={returnedEvents}
            {...props}
          />
        )}
      />
    </FunctionCard>
  );
};

const FunctionCard = styled(Card)`
  margin-bottom: 1rem;
`;

const FunctionHeader = React.memo(({ index, f }) => (
  <CardHeader
    title={`Function #${index}: ${f.name}(${f.inputs.length > 0 ? "..." : ""})`}
  />
));

const FunctionForm = ({
  f,
  returnValues,
  returnedEvents,
  isSubmitting,
  ...rest
}) => (
  <>
    <Form className="needs-validation" noValidate>
      <FunctionInputs
        f={f}
        inputs={f.inputs}
        disabled={isSubmitting}
        {...rest}
      />
      {f.payable && "Payable: "}
    </Form>
    <Divider />
    <FunctionOutputs
      outputs={f.outputs}
      processing={isSubmitting}
      returnValues={returnValues}
    />
    {returnedEvents && <FunctionEvents events={returnedEvents} />}
  </>
);

export default FunctionDefinition;
