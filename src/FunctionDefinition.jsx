import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import FunctionInputs from "./FunctionInputs";
import FunctionOutputs from "./FunctionOutputs";

const FunctionDefinition = ({ f, index, contract }) => {
  const [returnValues, setReturnValues] = useState();
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
    }

    setSubmitting(false);
  };

  return (
    <FunctionContainer>
      <FunctionHeader index={index} f={f} />
      <Formik
        initialValues={initialValues}
        validateOnChange={false}
        onSubmit={handleSubmit}
        render={props => (
          <FunctionForm
            index={index}
            f={f}
            returnValues={returnValues}
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
  values,
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
  isSubmitting,
  f,
  returnValues
}) => (
  <Form className="needs-validation" noValidate>
    <FunctionInputs
      inputs={f.inputs}
      disabled={isSubmitting}
      setFieldValue={setFieldValue}
      setFieldTouched={setFieldTouched}
      errors={errors}
      touched={touched}
    />
    {f.payable && "Payable: "}
    <button type="submit" disabled={isSubmitting}>
      {f.constant ? "Call" : "Send"}
    </button>
    <hr />
    <FunctionOutputs
      processing={isSubmitting}
      outputs={f.outputs}
      returnValues={returnValues}
    />
  </Form>
);

export default FunctionDefinition;