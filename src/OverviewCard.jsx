import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Identicon } from "ethereum-react-components";
import AnchorLink from "./AnchorLink";
import erc20ABI from "./abi/ERC20.json";
import demoABI from "./abi/Demo.json";

const OverviewCard = ({ address, abiSetter }) => {
  const [isEditing, setEditing] = useState(false);

  return (
    <Card>
      <AnchorLink id="_contract" />
      <CardHeader
        avatar={<Identicon address={address} size="small" />}
        title={
          <OverviewCardTitle
            address={address}
            isEditing={isEditing}
            setEditing={setEditing}
          />
        }
      />
      {isEditing && (
        <>
          <Divider />
          <CardContent>
            <div />
          </CardContent>
        </>
      )}
      <Divider />
      <CardActions>
        <Button size="small" color="primary">
          Load ABI from JSON file...
        </Button>
        <UsePredefinedABI abiSetter={abiSetter} abi={erc20ABI}>
          Use ERC20
        </UsePredefinedABI>
        <UsePredefinedABI abiSetter={abiSetter} abi={demoABI}>
          Use Demo ABI
        </UsePredefinedABI>
      </CardActions>
    </Card>
  );
};

const OverviewCardTitle = ({ address, isEditing, setEditing }) => (
  <Grid container alignItems="center" spacing={8}>
    <Grid item>
      <Typography
        variant="h6"
        color={isEditing ? "textSecondary" : "textPrimary"}
      >
        {address}
      </Typography>
    </Grid>
    <Grid item>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setEditing(true)}
      >
        Change...
      </Button>
    </Grid>
  </Grid>
);

const UsePredefinedABI = ({ abiSetter, abi, children }) => (
  <Button size="small" color="secondary" onClick={() => abiSetter(abi)}>
    {children}
  </Button>
);

export default OverviewCard;
