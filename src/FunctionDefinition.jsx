import React, { useState, useMemo } from "react";
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
    <FunctionContainer>
      <FunctionHeader f={f} />
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
    </FunctionContainer>
  );
};

const FunctionContainer = styled.article`
  border: 1px solid black;
  margin: 5px 20px;
  padding: 10px;
  text-align: left;
`;

const FunctionHeader = React.memo(({ index, f }) => (
  <header>
    <h4>
      Function #{index}: {f.name}({f.inputs.length > 0 && "..."})
    </h4>
    <hr />
  </header>
));

const FunctionForm = ({
  f,
  returnValues,
  returnedEvents,
  isSubmitting,
  ...rest
}) => (
  <Form className="needs-validation" noValidate>
    <FunctionInputs inputs={f.inputs} disabled={isSubmitting} {...rest} />
    {f.payable && "Payable: "}
    <button type="submit" disabled={isSubmitting}>
      {f.constant ? "Call" : "Send..."}
    </button>
    <hr />
    <FunctionOutputs
      outputs={f.outputs}
      processing={isSubmitting}
      returnValues={returnValues}
    />
    {returnedEvents && <FunctionEvents events={returnedEvents} />}
  </Form>
);

export default FunctionDefinition;
