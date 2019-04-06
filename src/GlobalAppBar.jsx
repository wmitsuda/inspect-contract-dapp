import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Ethereum from "mdi-material-ui/Ethereum";
import Account from "mdi-material-ui/Account";
import { useNetwork, useSelectedAccount } from "./Web3Context";
import { useDrawer } from "./DrawerContext";

const GlobalAppBar = () => {
  const { openDrawer } = useDrawer();
  const [, networkName] = useNetwork();
  const { selectedAccount } = useSelectedAccount();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Grid spacing={16} alignItems="center" container>
          <DrawerMenu action={openDrawer} />
          <EthereumNetwork networkName={networkName} />
          <SelectedAccount address={selectedAccount} />
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

const DrawerMenu = ({ action }) => (
  <Grid item>
    <IconButton color="inherit" onClick={action}>
      <MenuIcon />
    </IconButton>
  </Grid>
);

const EthereumNetwork = ({ networkName }) => (
  <Grid item>
    <Grid alignItems="center" wrap="nowrap" container>
      <Grid item>
        <Ethereum />
      </Grid>
      <Grid item>
        <Typography variant="h6" color="inherit" noWrap>
          {networkName}
        </Typography>
      </Grid>
    </Grid>
  </Grid>
);

const SelectedAccount = ({ address }) => (
  <Grid item>
    <Grid alignItems="center" wrap="nowrap" container>
      <Grid item>
        <Account />
      </Grid>
      <Grid item>
        <Typography variant="h6" color="inherit" noWrap>
          {address}
        </Typography>
      </Grid>
    </Grid>
  </Grid>
);

export default GlobalAppBar;
