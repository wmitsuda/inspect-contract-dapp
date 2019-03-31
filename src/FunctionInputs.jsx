import React, { useState, useContext } from "react";
import { Field } from "formik";
import { Web3Context } from "./Web3Context";
import QrReader from "react-qr-reader";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

library.add(faQrcode);
library.add(faWindowClose);

const FunctionInputs = ({
  inputs,
  disabled,
  setFieldValue,
  setFieldTouched,
  errors,
  touched
}) => {
  const setValue = field => value => {
    setFieldValue(field, value, false);
    setFieldTouched(field);
  };

  return inputs.map((input, key) => (
    <FunctionInput
      key={key}
      index={key}
      input={input}
      disabled={disabled}
      setValue={setValue(input.name)}
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
  setValue,
  errors,
  touched
}) => {
  const [isScanning, setScanning] = useState(false);
  const web3 = useContext(Web3Context);

  const setMyAddress = async () => {
    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];
    setValue(defaultAccount);
  };

  const onScan = result => {
    if (web3.utils.isAddress(result)) {
      setValue(result);
      setScanning(false);
    }
  };

  const onError = err => {
    console.log("Error while scanning address: " + err);
    setScanning(false);
  };

  return (
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
          <>
            <button
              type="button"
              className="input-group-prepend"
              onClick={() => setScanning(!isScanning)}
              title={
                isScanning
                  ? "Click to close camera"
                  : "Click to open the camera and scan a QR code"
              }
              disabled={disabled}
            >
              <FontAwesomeIcon icon={isScanning ? "window-close" : "qrcode"} />
            </button>
            <button
              type="button"
              className="input-group-prepend"
              onClick={setMyAddress}
              disabled={disabled}
            >
              My address
            </button>
          </>
        )}
        {errors && touched && <div className="invalid-feedback">{errors}</div>}
      </div>
      {isScanning && <QrReader onScan={onScan} onError={onError} />}
      <small className="form-text text-muted">({input.type})</small>
    </div>
  );
};

export default FunctionInputs;
