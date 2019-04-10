import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Home from "@material-ui/icons/Home";
import { Identicon, EthAddress } from "ethereum-react-components";
import AlphaCcircleOutline from "mdi-material-ui/AlphaCcircleOutline";
import AlphaScircleOutline from "mdi-material-ui/AlphaScircleOutline";
import { useDrawer } from "./DrawerContext";

const ContractDrawer = ({ address, abiFunctions }) => {
  const { isDrawerOpen, closeDrawer } = useDrawer();

  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={closeDrawer}>
      <OverviewSection address={address} closeDrawer={closeDrawer} />
      {abiFunctions.length > 0 ? (
        <List subheader={<ListSubheader>Functions</ListSubheader>}>
          {abiFunctions.map((f, key) => (
            <GoToFunctionItem key={key} f={f} closeDrawer={closeDrawer} />
          ))}
        </List>
      ) : (
        <List subheader={<ListSubheader>No ABI loaded</ListSubheader>} />
      )}
    </Drawer>
  );
};

const OverviewSection = ({ address, closeDrawer }) => (
  <List subheader={<ListSubheader>Overview</ListSubheader>}>
    <ListItem component="a" href="/" onClick={closeDrawer} button>
      <ListItemIcon>
        <Home />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    {address && (
      <ListItem component="a" href="#_contract" onClick={closeDrawer} button>
        <ListItemIcon>
          <Identicon address={address} size="tiny" />
        </ListItemIcon>
        <ListItemText primary={<EthAddress address={address} short />} />
      </ListItem>
    )}
    <Divider />
  </List>
);

const GoToFunctionItem = ({ f, closeDrawer }) => (
  <ListItem component="a" href={`#${f.name}`} onClick={closeDrawer} button>
    <ListItemIcon>
      {f.constant ? <AlphaCcircleOutline /> : <AlphaScircleOutline />}
    </ListItemIcon>
    <ListItemText primary={f.name} />
  </ListItem>
);

export default ContractDrawer;
