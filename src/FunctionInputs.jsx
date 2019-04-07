import React from "react";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";
import { Field } from "formik";
import FunctionInput from "./FunctionInput";

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
          {f.payable && (
            <Field
              name="payableValue"
              disabled={disabled}
              render={({ field, form }) => (
                <TextField
                  label="Pay ETH"
                  helperText={
                    errors["payableValue"] && touched["payableValue"]
                      ? errors
                      : "Enter a value in ETH to be paid to the function call"
                  }
                  error={errors["payableValue"] && touched["payableValue"]}
                  disabled={disabled}
                  margin="normal"
                  required
                  fullWidth
                  {...field}
                />
              )}
            />
          )}
        </CardContent>
      )}
      <FunctionActions f={f} disabled={disabled} />
    </>
  );
};

const FunctionActions = React.memo(({ f: { constant }, disabled }) => (
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
      ) : constant ? (
        "Call"
      ) : (
        "Send..."
      )}
    </SpinningButton>
  </CardActions>
));

const SpinningButton = styled(Button)`
  max-width: 5rem;
`;

export default FunctionInputs;
