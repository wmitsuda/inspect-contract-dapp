import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { useContract } from "./ContractContext";
import { useProcessing } from "./ProcessingContext";
import { useDialog } from "./AskCidDialog";
import { useSnackbar } from "notistack";
import useIpfs from "./useIpfs";

const LoadFromIpfsButton = () => {
  const { processing, setProcessing } = useProcessing();
  const { enqueueSnackbar } = useSnackbar();
  const { setAbi } = useContract();
  const { ipfs } = useIpfs();

  const loadFromIpfs = async cid => {
    setProcessing(true);
    enqueueSnackbar(`Loading CID ${cid} from IPFS...`);

    const result = await ipfs.cat(cid);
    const newAbi = JSON.parse(result);
    setAbi(newAbi);

    enqueueSnackbar("ABI loaded from IPFS!");
    setProcessing(false);
  };

  const { AskCidDialog, open } = useDialog(loadFromIpfs);

  return (
    <>
      <Button size="small" onClick={open} disabled={processing}>
        Load from IPFS
      </Button>
      <AskCidDialog />
    </>
  );
};

const SaveToIpfsButton = () => {
  const { processing, setProcessing } = useProcessing();
  const { abi } = useContract();
  const { enqueueSnackbar } = useSnackbar();
  const { ipfs } = useIpfs();

  const saveToIpfs = async () => {
    setProcessing(true);

    const abiString = JSON.stringify(abi);
    const content = Buffer.from(abiString);

    const result = await ipfs.add(content);
    const { hash } = result[0];

    enqueueSnackbar(`ABI stored on IPFS`, {
      action: (
        <Button
          size="small"
          color="secondary"
          href={`https://ipfs.infura.io/ipfs/${hash}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          See on IPFS
        </Button>
      )
    });
    setProcessing(false);
  };

  return (
    <Tooltip title="Save ABI JSON to IPFS">
      <div>
        <Button
          size="small"
          onClick={saveToIpfs}
          disabled={processing || !abi || abi.length === 0}
        >
          Save to IPFS
        </Button>
      </div>
    </Tooltip>
  );
};

export { LoadFromIpfsButton, SaveToIpfsButton };
