import React, { useState, useEffect, useRef } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { useSnackbar } from "notistack";
import { useContract } from "./ContractContext";
import { ProcessingContext, useProcessing } from "./ProcessingContext";
import ipfsClient from "ipfs-http-client";
import erc20ABI from "./abi/ERC20.json";
import erc165ABI from "./abi/ERC165.json";
import erc721ABI from "./abi/ERC721.json";
import demoABI from "./abi/Demo.json";

const AbiCard = ({ noAbi }) => (
  <Card>{noAbi ? <NoAbiCard /> : <AbiLoadedCard />}</Card>
);

const NoAbiCard = () => (
  <>
    <CardContent>
      <Typography align="center" variant="h5" color="textPrimary" gutterBottom>
        <span role="img" aria-label="hint">
          💡
        </span>{" "}
        Load some ABI
      </Typography>
      <Divider />
    </CardContent>
    <AbiCardActions />
  </>
);

const AbiLoadedCard = () => {
  const [isExpanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!isExpanded);

  return (
    <>
      <CardHeader
        avatar={<FormatListNumberedIcon />}
        title="ABI options"
        titleTypographyProps={{ variant: "h6" }}
        onClick={toggleExpanded}
        action={
          <IconButton>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      />
      <Collapse in={isExpanded} timeout="auto">
        <AbiCardActions />
      </Collapse>
    </>
  );
};

const AbiCardActions = React.memo(() => {
  const { enqueueSnackbar } = useSnackbar();

  const { abi, setAbi } = useContract();
  const abiSetter = (newAbi, name) => () => {
    setWorking(true);
    setAbi(newAbi);
    enqueueSnackbar(`${name} ABI loaded`);
    setWorking(false);
  };

  const fileRef = useRef();
  const handleFileChange = e => {
    setWorking(true);

    const reader = new FileReader();
    reader.onload = e => {
      const json = JSON.parse(e.target.result);
      const { abi: newAbi } = json;
      setAbi(newAbi);
    };
    reader.readAsText(fileRef.current.files[0]);

    enqueueSnackbar("ABI loaded from file");
    setWorking(false);
  };

  const [ipfs, setIpfs] = useState();
  useEffect(() => {
    const enableIpfs = async () => {
      const client = ipfsClient("ipfs.infura.io", "5001", {
        protocol: "https"
      });
      setIpfs(client);
    };
    enableIpfs();
  }, []);

  const [loadOpen, setLoadOpen] = useState(false);
  const [cid, setCid] = useState("");
  const loadFromIpfs = async () => {
    enqueueSnackbar(`Loading CID ${cid} from IPFS...`);
    const result = await ipfs.cat(cid);

    const newAbi = JSON.parse(result);
    setAbi(newAbi);
    enqueueSnackbar("ABI loaded from IPFS!");
    setLoadOpen(false);
  };

  const [working, setWorking] = useState(false);
  const saveToIpfs = async () => {
    setWorking(true);

    const abiString = JSON.stringify(abi);
    const content = Buffer.from(abiString);

    const result = await ipfs.add(content);
    const { hash } = result[0];
    enqueueSnackbar(`ABI stored in IPFS with CID: ${hash}`);
    setWorking(false);
  };

  return (
    <ProcessingContext.Provider value={working}>
      <>
        <CardActions>
          <label>
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={handleFileChange}
              onClick={e => (e.target.value = null)}
              ref={fileRef}
            />
            <Tooltip title={"Load ABI from compiled file"}>
              <Button
                component="span"
                size="small"
                color="primary"
                variant="outlined"
                disabled={working}
              >
                Load from JSON file...
              </Button>
            </Tooltip>
          </label>
          <UsePredefinedABI
            onClick={abiSetter(erc20ABI, "ERC20")}
            tooltip="Load built-in ERC20 ABI"
          >
            ERC20
          </UsePredefinedABI>
          <UsePredefinedABI
            onClick={abiSetter(erc165ABI, "ERC165")}
            tooltip="Load built-in ERC165 ABI"
          >
            ERC165
          </UsePredefinedABI>
          <UsePredefinedABI
            onClick={abiSetter(erc721ABI, "ERC721")}
            tooltip="Load built-in ERC721 ABI"
          >
            ERC721
          </UsePredefinedABI>

          {process.env.NODE_ENV === "development" && (
            <UsePredefinedABI
              onClick={abiSetter(demoABI, "Demo")}
              tooltip="Load built-in demo ABI"
            >
              Demo ABI
            </UsePredefinedABI>
          )}

          <Button
            size="small"
            onClick={() => setLoadOpen(true)}
            disabled={working}
          >
            Load from IPFS
          </Button>
          <Dialog open={loadOpen} onClose={() => setLoadOpen(false)}>
            <DialogTitle>Load ABI</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the IPFS CID of the json ABI you want to load.
              </DialogContentText>
              <TextField
                id="cid"
                label="CID"
                margin="dense"
                value={cid}
                onChange={e => setCid(e.target.value)}
                autoFocus
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={() => setLoadOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onClick={loadFromIpfs}>
                Load
              </Button>
            </DialogActions>
          </Dialog>

          <Tooltip title="Save ABI JSON to IPFS">
            <div>
              <Button
                size="small"
                onClick={saveToIpfs}
                disabled={working || !abi || abi.length === 0}
              >
                Save to IPFS
              </Button>
            </div>
          </Tooltip>
        </CardActions>
        {working && <LinearProgress />}
      </>
    </ProcessingContext.Provider>
  );
});

const UsePredefinedABI = ({ tooltip, onClick, children }) => {
  const processing = useProcessing();

  return (
    <Tooltip title={tooltip}>
      <Button
        size="small"
        color="secondary"
        onClick={onClick}
        disabled={processing}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default AbiCard;
