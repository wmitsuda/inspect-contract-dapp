import React, { useContext } from "react";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
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
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={disabled}
      >
        {call ? "Call" : "Send..."}
      </Button>

      {!call && (
        <Button
          href={transactionHash && etherscan.getTxURL(transactionHash)}
          target="_blank"
          rel="noopener noreferrer"
          disabled={!transactionHash}
        >
          Open in Etherscan.io...
        </Button>
      )}
    </CardActions>
  );
});

export default FunctionInputs;
