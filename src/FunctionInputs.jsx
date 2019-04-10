import React, { useContext } from "react";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import styled from "styled-components";
import { FunctionContext } from "./FunctionContext";
import FunctionInput from "./FunctionInput";
import { useEtherscan } from "./Web3Context";

const FunctionInputs = ({ transactionHash, isSubmitting }) => {
  const f = useContext(FunctionContext);
  const { inputs, payable, constant } = f;

  return (
    <>
      <CardContent>
        <Divider />
        {payable && (
          <FunctionInput
            input={{ name: "payableValue", type: "eth" }}
            hideType={true}
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
          color="textSecondary"
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
