import React, { useState, useRef } from "react";
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
import LinearProgress from "@material-ui/core/LinearProgress";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { useSnackbar } from "notistack";
import { useContract } from "./ContractContext";
import {
  ProcessingContext,
  useNewProcessingContext
} from "./ProcessingContext";
import UsePredefinedABI from "./UsePredefinedABI";
import { LoadFromIpfsButton, SaveToIpfsButton } from "./IpfsActions";
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
  const processingContext = useNewProcessingContext();
  const { processing, setProcessing } = processingContext;
  const { enqueueSnackbar } = useSnackbar();

  const { setAbi } = useContract();

  const fileRef = useRef();
  const handleFileChange = e => {
    setProcessing(true);

    const reader = new FileReader();
    reader.onload = e => {
      const json = JSON.parse(e.target.result);
      const { abi: newAbi } = json;
      setAbi(newAbi);
    };
    reader.readAsText(fileRef.current.files[0]);

    enqueueSnackbar("ABI loaded from file");
    setProcessing(false);
  };

  return (
    <ProcessingContext.Provider value={processingContext}>
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
                disabled={processing}
              >
                Load from JSON file...
              </Button>
            </Tooltip>
          </label>
          <UsePredefinedABI
            abi={erc20ABI}
            name="ERC20"
            tooltip="Load built-in ERC20 ABI"
          />
          <UsePredefinedABI
            abi={erc165ABI}
            name="ERC165"
            tooltip="Load built-in ERC165 ABI"
          />
          <UsePredefinedABI
            abi={erc721ABI}
            name="ERC721"
            tooltip="Load built-in ERC721 ABI"
          />

          {process.env.NODE_ENV === "development" && (
            <UsePredefinedABI
              abi={demoABI}
              name="Demo"
              tooltip="Load built-in demo ABI"
            />
          )}

          <LoadFromIpfsButton />
          <SaveToIpfsButton />
        </CardActions>
        {processing && <LinearProgress />}
      </>
    </ProcessingContext.Provider>
  );
});

export default AbiCard;
