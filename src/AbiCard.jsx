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
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import erc20ABI from "./abi/ERC20.json";
import erc165ABI from "./abi/ERC165.json";
import erc721ABI from "./abi/ERC721.json";
import demoABI from "./abi/Demo.json";

const AbiCard = ({ noAbi, ...rest }) => (
  <Card>{!noAbi ? <NoAbiCard {...rest} /> : <AbiLoadedCard {...rest} />}</Card>
);

const NoAbiCard = ({ abiSetter }) => {
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
        <AbiCardActions abiSetter={abiSetter} />
      </Collapse>
    </>
  );
};

const AbiLoadedCard = ({ abiSetter }) => (
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
    <AbiCardActions abiSetter={abiSetter} />
  </>
);

const AbiCardActions = React.memo(({ abiSetter }) => {
  const fileRef = useRef();

  const handleFileChange = e => {
    const reader = new FileReader();
    reader.onload = e => {
      const json = JSON.parse(e.target.result);
      const { abi } = json;
      abiSetter(abi);
    };
    reader.readAsText(fileRef.current.files[0]);
  };

  return (
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
          >
            Load from JSON file...
          </Button>
        </Tooltip>
      </label>
      <UsePredefinedABI
        abiSetter={abiSetter}
        abi={erc20ABI}
        tooltip="Load built-in ERC20 ABI"
      >
        ERC20
      </UsePredefinedABI>
      <UsePredefinedABI
        abiSetter={abiSetter}
        abi={erc165ABI}
        tooltip="Load built-in ERC165 ABI"
      >
        ERC165
      </UsePredefinedABI>
      <UsePredefinedABI
        abiSetter={abiSetter}
        abi={erc721ABI}
        tooltip="Load built-in ERC721 ABI"
      >
        ERC721
      </UsePredefinedABI>

      {process.env.NODE_ENV === "development" && (
        <UsePredefinedABI
          abiSetter={abiSetter}
          abi={demoABI}
          tooltip="Load built-in demo ABI"
        >
          Demo ABI
        </UsePredefinedABI>
      )}
    </CardActions>
  );
});

const UsePredefinedABI = ({ abiSetter, abi, tooltip, children }) => (
  <Tooltip title={tooltip}>
    <Button size="small" color="secondary" onClick={() => abiSetter(abi)}>
      {children}
    </Button>
  </Tooltip>
);

export default AbiCard;
