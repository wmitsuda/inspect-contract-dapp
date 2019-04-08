import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import QrcodeScan from "mdi-material-ui/QrcodeScan";
import WindowClose from "mdi-material-ui/WindowClose";
import AccountArrowLeftOutline from "mdi-material-ui/AccountArrowLeftOutline";
import { Field } from "formik";
import { Web3Context, useQRReader } from "./Web3Context";

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

const FunctionInput = ({ input, hideType }) => {
  const web3 = useContext(Web3Context);

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
    <>
      {input.type === "bool" ? (
        <>
          <span>
            <Field type="radio" name={input.name} id={`${input.name}_true`} />
            <label htmlFor={`${input.name}_true`}>true</label>
          </span>{" "}
          <span>
            <Field type="radio" name={input.name} id={`${input.name}_false`} />
            <label htmlFor={`${input.name}_false`}>false</label>
          </span>
        </>
      ) : (
        <Field
          name={input.name}
          validate={handleValidation}
          render={props => (
            <RegularTextField input={input} hideType={hideType} {...props} />
          )}
        />
      )}
    </>
  );
};

const RegularTextField = ({
  input,
  hideType,
  field,
  form: { isSubmitting, errors, touched, setFieldValue, setFieldTouched }
}) => {
  const setValue = value => {
    setFieldValue(input.name, value, false);
    setFieldTouched(input.name);
  };
  const [isScanning, toggleScanning, QRReader] = useQRReader(setValue);

  const web3 = useContext(Web3Context);
  const setMyAddress = async () => {
    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];
    setValue(defaultAccount);
  };

  const myErrors = errors[input.name];
  const myTouched = touched[input.name];

  return (
    <>
      <TextField
        {...field}
        label={`${hideType ? "" : input.type} ${input.name}`}
        helperText={myErrors && myTouched ? myErrors : `(${input.type})`}
        error={myErrors && myTouched}
        disabled={isSubmitting}
        margin="normal"
        required
        fullWidth
        InputProps={
          input.type !== "address"
            ? {}
            : {
                endAdornment: (
                  <AddressInputAdornment
                    isScanning={isScanning}
                    toggleScanning={toggleScanning}
                    onSetMyAddress={setMyAddress}
                    disabled={isSubmitting}
                  />
                )
              }
        }
      />
      <QRReader />
    </>
  );
};

const AddressInputAdornment = ({
  isScanning,
  toggleScanning,
  onSetMyAddress,
  disabled
}) => (
  <InputAdornment position="end">
    <Tooltip
      title={isScanning ? "Close camera" : "Open camera and scan a QR code"}
    >
      <IconButton onClick={toggleScanning} disabled={disabled}>
        {isScanning ? <WindowClose /> : <QrcodeScan />}
      </IconButton>
    </Tooltip>
    <Tooltip title="Fill my address">
      <IconButton onClick={onSetMyAddress} disabled={disabled}>
        <AccountArrowLeftOutline />
      </IconButton>
    </Tooltip>
  </InputAdornment>
);

export default FunctionInput;