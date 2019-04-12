import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { useProcessing } from "./ProcessingContext";
import { useContract } from "./ContractContext";
import { useSnackbar } from "notistack";

const UsePredefinedABI = ({ tooltip, abi, name }) => {
  const { processing, setProcessing } = useProcessing();
  const { setAbi } = useContract();
  const { enqueueSnackbar } = useSnackbar();

  const abiSetter = () => {
    setProcessing(true);
    setAbi(abi);
    enqueueSnackbar(`${name} ABI loaded`);
    setProcessing(false);
  };

  return (
    <Tooltip title={tooltip}>
      <Button
        size="small"
        color="secondary"
        onClick={abiSetter}
        disabled={processing}
      >
        {name}
      </Button>
    </Tooltip>
  );
};

export default UsePredefinedABI;
