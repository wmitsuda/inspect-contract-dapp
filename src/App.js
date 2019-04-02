import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Web3 from "web3";
import { Web3Context } from "./Web3Context";
import ContractDefinition from "./ContractDefinition";
import styled from "styled-components";

// Initialize web3
const web3Options = {
  transactionConfirmationBlocks: 1
};
Web3.givenProvider.enable();
const web3 = new Web3(Web3.givenProvider, null, web3Options);

const MainTitle = styled(Typography)`
  margin: 0 auto;
  padding: 4rem 0 3rem;
`;

const App = ({ contractData }) => {
  const { address, abi } = contractData;
  return (
    <Web3Context.Provider value={web3}>
      <main>
        <CssBaseline />
        <header>
          <AppBar position="static">
            <Typography variant="h6" color="inherit" noWrap>
              Teste
            </Typography>
          </AppBar>
          <MainTitle
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Contract Inspector
          </MainTitle>
        </header>
        <ContractDefinition address={address} abi={abi} />
      </main>
    </Web3Context.Provider>
  );
};

export default App;
