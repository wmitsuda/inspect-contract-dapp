import React, { useState, useEffect, useMemo } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Identicon } from "ethereum-react-components";
import styled from "styled-components";
import { useWeb3 } from "./Web3Context";
import AnchorLink from "./AnchorLink";
import FunctionDefinition from "./FunctionDefinition";
import ContractDrawer from "./ContractDrawer";

const ContractDefinition = ({ address, abi }) => {
  const [contract, setContract] = useState();
  const abiFunctions = useMemo(() => abi.filter(f => f.type === "function"), [
    abi
  ]);
  const abiEvents = useMemo(() => abi.filter(f => f.type === "event"), [abi]);
  const web3 = useWeb3();

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
      <Grid direction="column" spacing={16} container>
        <Grid item>
          <OverviewCard address={address} />
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
      <ContractDrawer address={address} abiFunctions={abiFunctions} />
    </ContractSection>
  );
};

const ContractSection = styled.section`
  background-color: #eeeeee;
  padding: 2rem;
`;

const OverviewCard = ({ address }) => (
  <Card>
    <AnchorLink id="_contract" />
    <CardHeader
      avatar={<Identicon address={address} size="small" />}
      title={<OverviewCardTitle address={address} />}
    />
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

export default ContractDefinition;
