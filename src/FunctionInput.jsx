import React, { useContext } from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import QrcodeScan from "mdi-material-ui/QrcodeScan";
import WindowClose from "mdi-material-ui/WindowClose";
import AccountArrowLeftOutline from "mdi-material-ui/AccountArrowLeftOutline";
import { Field } from "formik";
import { Web3Context, useQRReader } from "./Web3Context";

const FunctionInput = ({ input, hideType }) => {
  if (input.type === "bool") {
    return (
      <Field
        name={input.name}
        render={props => <RegularRadioGroup input={input} {...props} />}
      />
    );
  }

  return (
    <Field
      name={input.name}
      render={props => (
        <RegularTextField input={input} hideType={hideType} {...props} />
      )}
    />
  );
};

const RegularRadioGroup = ({
  input: { name, type },
  field,
  form: { isSubmitting, errors, touched }
}) => {
  const myErrors = errors[name];
  const myTouched = touched[name];

  return (
    <FormControl component="fieldset" error={myErrors && myTouched} required>
      <FormLabel component="legend">
        {type} {name}
      </FormLabel>
      <RadioGroup row {...field}>
        <FormControlLabel
          value="true"
          control={<Radio />}
          label="true"
          disabled={isSubmitting}
        />
        <FormControlLabel
          value="false"
          control={<Radio />}
          label="false"
          disabled={isSubmitting}
        />
      </RadioGroup>
      <FormHelperText>{errorOrHelp(myErrors, myTouched, type)}</FormHelperText>
    </FormControl>
  );
};

const RegularTextField = ({
  input: { name, type },
  hideType,
  field,
  form: { isSubmitting, errors, touched, setFieldValue, setFieldTouched }
}) => {
  const setValue = value => {
    setFieldValue(name, value, false);
    setFieldTouched(name);
  };

  const [isScanning, toggleScanning, QRReader] = useQRReader(setValue);

  const web3 = useContext(Web3Context);
  const setMyAddress = async () => {
    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];
    setValue(defaultAccount);
  };

  const myErrors = errors[name];
  const myTouched = touched[name];

  return (
    <>
      <TextField
        {...field}
        label={`${hideType ? "" : type} ${name}`}
        helperText={errorOrHelp(myErrors, myTouched, type)}
        error={myErrors && myTouched}
        disabled={isSubmitting}
        margin="normal"
        required
        fullWidth
        InputProps={
          type === "address"
            ? {
                endAdornment: (
                  <AddressInputAdornment
                    isScanning={isScanning}
                    toggleScanning={toggleScanning}
                    onSetMyAddress={setMyAddress}
                    disabled={isSubmitting}
                  />
                )
              }
            : {}
        }
      />
      <QRReader />
    </>
  );
};

const errorOrHelp = (errors, touched, type) => {
  return errors && touched ? errors : `(${type})`;
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
