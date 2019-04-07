import React, { useState, useEffect, useMemo } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Identicon } from "ethereum-react-components";
import styled from "styled-components";
import { useWeb3, useSelectedAccount } from "./Web3Context";
import AnchorLink from "./AnchorLink";
import FunctionDefinition from "./FunctionDefinition";
import ContractDrawer from "./ContractDrawer";

import erc20ABI from "./abi/ERC20.json";
import demoABI from "./abi/Demo.json";

const ContractDefinition = ({ address, abi, abiSetter }) => {
  const [contract, setContract] = useState();
  const abiFunctions = useMemo(() => abi.filter(f => f.type === "function"), [
    abi
  ]);
  const abiEvents = useMemo(() => abi.filter(f => f.type === "event"), [abi]);

  const web3 = useWeb3();
  const { selectedAccount } = useSelectedAccount();

  useEffect(() => {
    const createContract = async () => {
      setContract(
        new web3.eth.Contract(abi, address, {
          from: selectedAccount,
          ...web3.options
        })
      );
    };
    createContract();
  }, [web3, selectedAccount, abi, address]);

  return (
    <ContractSection>
      <Grid direction="column" spacing={16} container>
        <Grid item>
          <OverviewCard address={address} abiSetter={abiSetter} />
        </Grid>
        {contract && abiFunctions.length > 0 ? (
          abiFunctions.map((f, key) => (
            <Grid key={key} item>
              <FunctionDefinition
                f={f}
                index={key}
                contract={contract}
                eventABI={abiEvents}
              />
            </Grid>
          ))
        ) : (
          <Grid item>
            <Typography align="center" variant="h3" color="inherit">
              Load some ABI!!!
            </Typography>
          </Grid>
        )}
      </Grid>
      <ContractDrawer address={address} abiFunctions={abiFunctions} />
    </ContractSection>
  );
};

const ContractSection = styled.section`
  background-color: #eeeeee;
  padding: 2rem;
`;

const OverviewCard = ({ address, abiSetter }) => (
  <Card>
    <AnchorLink id="_contract" />
    <CardHeader
      avatar={<Identicon address={address} size="small" />}
      title={<OverviewCardTitle address={address} />}
    />
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

const OverviewCardTitle = ({ address }) => (
  <Grid container alignItems="center" spacing={8}>
    <Grid item>
      <Typography variant="h6">{address}</Typography>
    </Grid>
    <Grid item>
      <Button variant="outlined" color="secondary">
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

export default ContractDefinition;
