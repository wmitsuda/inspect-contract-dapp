import React, { useState, useContext } from "react";
import { Field } from "formik";
import { Web3Context } from "./Web3Context";
import QrReader from "react-qr-reader";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faWindowClose } from "@fortawesome/free-solid-svg-icons";

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

const handleStringValidation = value => {
  let errorMessage;
  if (!value) {
    errorMessage = "Value is required";
  }
  return errorMessage;
};

const handleAddressValidation = (web3, value) => {
  const defValidation = handleDefaultValidation(value);
  if (defValidation) {
    return defValidation;
  }

  let errorMessage;
  if (!web3.utils.isAddress(value)) {
    errorMessage = "Enter a valid ETH address";
  }
  return errorMessage;
};

const handleBytesValidation = (size, web3, value) => {
  const defValidation = handleDefaultValidation(value);
  if (defValidation) {
    return defValidation;
  }

  let errorMessage;
  if (!web3.utils.isHexStrict(value)) {
    errorMessage = "Enter a valid hex string";
  } else if (value.length !== size * 2 + 2) {
    errorMessage = `Byte array must be of size ${size}`;
  }
  return errorMessage;
};

const handleDefaultValidation = value => {
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

  const handleValidation = value => {
    if (input.type === "string") {
      return handleStringValidation(value);
    } else if (input.type === "address") {
      return handleAddressValidation(web3, value);
    } else if (input.type.startsWith("bytes")) {
      return handleBytesValidation(parseInt(input.type.substr(5)), web3, value);
    }
    return handleDefaultValidation(value);
  };

  return (
    <div className={`form-group ${errors && touched ? "text-danger" : null}`}>
      <label htmlFor={input.name}>
        Input #{index}: {input.name}
      </label>
      <div className="input-group">
        {input.type === "bool" ? (
          <>
            <span>
              <Field type="radio" name={input.name} id={`${input.name}_true`} />
              <label htmlFor={`${input.name}_true`}>true</label>
            </span>{" "}
            <span>
              <Field
                type="radio"
                name={input.name}
                id={`${input.name}_false`}
              />
              <label htmlFor={`${input.name}_false`}>false</label>
            </span>
          </>
        ) : (
          <>
            <Field
              type="text"
              className={`form-control ${
                errors && touched ? "is-invalid" : null
              }`}
              name={input.name}
              placeholder={input.name}
              disabled={disabled}
              validate={handleValidation}
            />
          </>
        )}
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
