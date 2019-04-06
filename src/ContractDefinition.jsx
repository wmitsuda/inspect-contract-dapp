import React, { useState, useEffect, useMemo } from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AlphaCcircleOutline from "mdi-material-ui/AlphaCcircleOutline";
import AlphaScircleOutline from "mdi-material-ui/AlphaScircleOutline";
import { Identicon } from "ethereum-react-components";
import styled from "styled-components";
import { useWeb3 } from "./Web3Context";
import { useDrawer } from "./DrawerContext";
import AnchorLink from "./AnchorLink";
import FunctionDefinition from "./FunctionDefinition";

const ContractDefinition = ({ address, abi }) => {
  const [contract, setContract] = useState();
  const abiFunctions = useMemo(() => abi.filter(f => f.type === "function"), [
    abi
  ]);
  const abiEvents = useMemo(() => abi.filter(f => f.type === "event"), [abi]);
  const web3 = useWeb3();
  const { isDrawerOpen, closeDrawer } = useDrawer();

  useEffect(() => {
    const createContract = async () => {
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      setContract(
        new web3.eth.Contract(abi, address, { from, ...web3.options })
      );
    };
    createContract();
  }, [web3, abi, address]);

  return (
    <ContractSection>
      <AnchorLink id="_contract" />
      <Grid direction="column" spacing={16} container>
        <Grid item>
          <Card>
            <CardHeader
              avatar={<Identicon address={address} size="small" />}
              title={
                <Grid container alignItems="center" spacing={8}>
                  <Grid item>
                    <Typography variant="h6" inline={true}>
                      {address}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="secondary">
                      Change...
                    </Button>
                  </Grid>
                </Grid>
              }
            />
          </Card>
        </Grid>
        {contract &&
          abiFunctions.map((f, key) => (
            <Grid key={key} item>
              <FunctionDefinition
                f={f}
                index={key}
                contract={contract}
                eventABI={abiEvents}
              />
            </Grid>
          ))}
      </Grid>
      <Drawer anchor="left" open={isDrawerOpen} onClose={closeDrawer}>
        <List subheader={<ListSubheader>Overview</ListSubheader>}>
          <ListItem
            component="a"
            href="#_contract"
            onClick={closeDrawer}
            button
          >
            <ListItemIcon>
              <Identicon address={address} size="small" />
            </ListItemIcon>
            <ListItemText primary={address} />
          </ListItem>
          <Divider />
        </List>
        <List subheader={<ListSubheader>Functions</ListSubheader>}>
          {contract &&
            abiFunctions.map((f, key) => (
              <ListItem
                key={key}
                component="a"
                href={`#${f.name}`}
                onClick={closeDrawer}
                button
              >
                <ListItemIcon>
                  {f.constant ? (
                    <AlphaCcircleOutline />
                  ) : (
                    <AlphaScircleOutline />
                  )}
                </ListItemIcon>
                <ListItemText primary={f.name} />
              </ListItem>
            ))}
        </List>
      </Drawer>
    </ContractSection>
  );
};

const ContractSection = styled.section`
  background-color: #eeeeee;
  padding: 2rem;
`;

export default ContractDefinition;
