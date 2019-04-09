import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import erc20ABI from "./abi/ERC20.json";
import erc165ABI from "./abi/ERC165.json";
import erc721ABI from "./abi/ERC721.json";
import demoABI from "./abi/Demo.json";

const AbiCard = ({ abiSetter, noAbi }) => (
  <Card>
    {!noAbi ? (
      <CardHeader title="ABI options" />
    ) : (
      <CardContent>
        <Typography
          align="center"
          variant="h5"
          color="textPrimary"
          gutterBottom
        >
          <span role="img" aria-label="hint">
            💡
          </span>{" "}
          Load some ABI
        </Typography>
        <Divider />
      </CardContent>
    )}
    <AbiCardActions abiSetter={abiSetter} />
  </Card>
);

const AbiCardActions = React.memo(({ abiSetter }) => (
  <CardActions>
    <Button size="small" color="primary" variant="outlined">
      Load ABI from JSON file...
    </Button>
    <UsePredefinedABI abiSetter={abiSetter} abi={erc20ABI}>
      ERC20
    </UsePredefinedABI>
    <UsePredefinedABI abiSetter={abiSetter} abi={erc165ABI}>
      ERC165
    </UsePredefinedABI>
    <UsePredefinedABI abiSetter={abiSetter} abi={erc721ABI}>
      ERC721
    </UsePredefinedABI>

    {process.env.NODE_ENV === "development" && (
      <UsePredefinedABI abiSetter={abiSetter} abi={demoABI}>
        Demo ABI
      </UsePredefinedABI>
    )}
  </CardActions>
));

const UsePredefinedABI = ({ abiSetter, abi, children }) => (
  <Button size="small" color="secondary" onClick={() => abiSetter(abi)}>
    {children}
  </Button>
);

export default AbiCard;
