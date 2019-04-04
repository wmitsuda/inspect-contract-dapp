import React, { useContext } from "react";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import QrcodeScan from "mdi-material-ui/QrcodeScan";
import WindowClose from "mdi-material-ui/WindowClose";
import AccountArrowLeftOutline from "mdi-material-ui/AccountArrowLeftOutline";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";
import { Field } from "formik";
import { Web3Context, useQRReader } from "./Web3Context";

const FunctionInputs = ({
  f,
  inputs,
  handleChange,
  handleBlur,
  disabled,
  setFieldValue,
  setFieldTouched,
  values,
  errors,
  touched
}) => {
  const setValue = field => value => {
    setFieldValue(field, value, false);
    setFieldTouched(field);
  };

  return (
    <>
      {inputs.length > 0 && (
        <CardContent>
          {inputs.map((input, key) => (
            <FunctionInput
              key={key}
              index={key}
              input={input}
              handleChange={handleChange}
              handleBlur={handleBlur}
              disabled={disabled}
              setValue={setValue(input.name)}
              value={values[input.name]}
              errors={errors[input.name]}
              touched={touched[input.name]}
            />
          ))}
        </CardContent>
      )}
      <CardActions>
        <SpinningButton
          variant="contained"
          color="primary"
          type="submit"
          disabled={disabled}
          fullWidth
        >
          {disabled ? (
            <CircularProgress size={24} />
          ) : f.constant ? (
            "Call"
          ) : (
            "Send..."
          )}
        </SpinningButton>
      </CardActions>
    </>
  );
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
  const web3 = useContext(Web3Context);
  const [isScanning, toggleScanning, QRReader] = useQRReader(setValue);

  const setMyAddress = async () => {
    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];
    setValue(defaultAccount);
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
          <Field
            name={input.name}
            placeholder={input.name}
            disabled={disabled}
            validate={handleValidation}
            render={({ field, form }) => (
              <TextField
                label={input.name}
                helperText={errors && touched ? errors : `(${input.type})`}
                error={errors && touched}
                disabled={disabled}
                margin="normal"
                required
                fullWidth
                {...field}
                InputProps={
                  input.type !== "address"
                    ? {}
                    : {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip
                              title={
                                isScanning
                                  ? "Close camera"
                                  : "Open camera and scan a QR code"
                              }
                            >
                              <IconButton
                                onClick={toggleScanning}
                                disabled={disabled}
                              >
                                {isScanning ? <WindowClose /> : <QrcodeScan />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Fill my address">
                              <IconButton
                                onClick={setMyAddress}
                                disabled={disabled}
                              >
                                <AccountArrowLeftOutline />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        )
                      }
                }
              />
            )}
          />
        )}
      </div>
      <QRReader />
    </div>
  );
};

const SpinningButton = styled(Button)`
  max-width: 5rem;
`;

export default FunctionInputs;
