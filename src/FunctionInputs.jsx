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
  isSubmitting,
  setFieldValue,
  setFieldTouched,
  errors,
  touched
}) => {
  const { inputs } = f;

  return (
    <>
      {inputs.length > 0 && (
        <CardContent>
          {inputs.map((input, key) => (
            <FunctionInput key={key} input={input} />
          ))}
          {f.payable && (
            <Field
              name="payableValue"
              render={({ field, form: { isSubmitting } }) => (
                <TextField
                  label="Pay ETH"
                  helperText={
                    errors["payableValue"] && touched["payableValue"]
                      ? errors
                      : "Enter a value in ETH to be paid to the function call"
                  }
                  error={errors["payableValue"] && touched["payableValue"]}
                  disabled={isSubmitting}
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
      <FunctionActions f={f} disabled={isSubmitting} />
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
