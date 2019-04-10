import React, { useContext } from "react";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
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
  const { inputs, payable, constant } = f;

  return (
    <>
      <CardContent>
        <Divider />
        {payable && (
          <Field
            name="payableValue"
            render={({ field, form: { isSubmitting } }) => (
              <TextField
                label="Pay ETH"
                helperText={
                  errors["payableValue"] && touched["payableValue"]
                    ? errors["payableValue"]
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
        {inputs.length > 0 &&
          inputs.map((input, key) => <FunctionInput key={key} input={input} />)}
      </CardContent>
      <FunctionActions
        call={constant}
        transactionHash={transactionHash}
        disabled={isSubmitting}
      />
    </>
  );
};

const FunctionActions = React.memo(({ call, transactionHash, disabled }) => {
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
        {disabled ? <CircularProgress size={24} /> : call ? "Call" : "Send..."}
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
});

const SpinningButton = styled(Button)`
  max-width: 5rem;
`;

export default FunctionInputs;
