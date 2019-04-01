import React from "react";
import "./App.css";
import Web3 from "web3";
import { Web3Context } from "./Web3Context";
import ContractDefinition from "./ContractDefinition";

// Initialize web3
const web3Options = {
  transactionConfirmationBlocks: 1
};
const web3 = new Web3(Web3.givenProvider, null, web3Options);

const App = ({ contractData }) => {
  const { address, abi } = contractData;
  return (
    <Web3Context.Provider value={web3}>
      <div className="App">
        <header>
          <h1>Contract Inspector</h1>
        </header>
        <div className="App-header">
          <ContractDefinition address={address} abi={abi} />
        </div>
      </div>
    </Web3Context.Provider>
  );
};

export default App;
