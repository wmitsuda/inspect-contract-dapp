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

const GlobalAppBar = ({ contractAddress }) => {
  const [, networkName] = useNetwork();
  const { selectedAccount } = useSelectedAccount();
  const { openDrawer } = useDrawer();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Grid spacing={16} alignItems="center" container>
          <Grid item>
            <IconButton color="inherit" onClick={openDrawer}>
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid item noWrap>
            <Grid alignItems="center" container>
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
          <Grid item>
            <Grid alignItems="center" container>
              <Grid item>
                <Account />
              </Grid>
              <Grid item>
                <Typography variant="h6" color="inherit" noWrap>
                  {selectedAccount}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default GlobalAppBar;
