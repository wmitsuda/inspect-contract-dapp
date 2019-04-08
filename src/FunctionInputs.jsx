import React, { useContext } from "react";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";
import { Field } from "formik";
import { FunctionContext } from "./FunctionContext";
import FunctionInput from "./FunctionInput";
import { useEtherscan } from "./Web3Context";

const FunctionInputs = ({
  transactionHash,
  isSubmitting,
  setFieldValue,
  setFieldTouched,
  errors,
  touched
}) => {
  const f = useContext(FunctionContext);
  const { inputs } = f;

  return (
    <>
      {inputs.length > 0 && (
        <CardContent>
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
          {inputs.map((input, key) => (
            <FunctionInput key={key} input={input} />
          ))}
        </CardContent>
      )}
      <FunctionActions
        f={f}
        transactionHash={transactionHash}
        disabled={isSubmitting}
      />
    </>
  );
};

const FunctionActions = React.memo(
  ({ f: { constant }, transactionHash, disabled }) => {
    const etherscan = useEtherscan();

    return (
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

        {transactionHash && (
          <Button
            href={etherscan.getTxURL(transactionHash)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open TX in Etherscan.io
          </Button>
        )}
      </CardActions>
    );
  }
);

const SpinningButton = styled(Button)`
  max-width: 5rem;
`;

export default FunctionInputs;
