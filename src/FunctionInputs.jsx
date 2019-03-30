import React, { useContext } from "react";
import { Field } from "formik";
import { Web3Context } from "./Web3Context";

const FunctionInputs = ({
  inputs,
  disabled,
  setFieldValue,
  errors,
  touched
}) => {
  const web3 = useContext(Web3Context);

  const setMyAddress = fieldName => async () => {
    const accounts = await web3.eth.getAccounts();
    const defAccount = accounts[0];
    setFieldValue(fieldName, defAccount);
  };

  return inputs.map((input, key) => (
    <FunctionInput
      key={key}
      index={key}
      input={input}
      disabled={disabled}
      setMyAddress={setMyAddress}
      errors={errors[input.name]}
      touched={touched[input.name]}
    />
  ));
};

const requireValidation = value => {
  let errorMessage;
  if (!value || value.trim() === "") {
    errorMessage = "Value is required";
  }
  return errorMessage;
};

const FunctionInput = ({
  index,
  input,
  disabled,
  setMyAddress,
  errors,
  touched
}) => (
  <div className={`form-group ${errors && touched ? "text-danger" : null}`}>
    <label htmlFor={input.name}>
      Input #{index}: {input.name}
    </label>
    <div className="input-group">
      <Field
        type="text"
        className={`form-control ${errors && touched ? "is-invalid" : null}`}
        name={input.name}
        placeholder={input.name}
        disabled={disabled}
        validate={requireValidation}
      />
      {input.type === "address" && (
        <button
          type="button"
          className="input-group-prepend"
          onClick={setMyAddress(input.name)}
          disabled={disabled}
        >
          My address
        </button>
      )}
      {errors && touched && <div className="invalid-feedback">{errors}</div>}
    </div>
    <small className="form-text text-muted">({input.type})</small>
  </div>
);

export default FunctionInputs;
