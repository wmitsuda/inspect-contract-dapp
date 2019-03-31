import React from "react";
import "./App.css";
// import rawContract from "./StandardERC20Token.json";
import rawContract from "./DemoContract.json";
import Web3 from "web3";
import { Web3Context } from "./Web3Context";
import ContractDefinition from "./ContractDefinition";

const abi = rawContract.abi;

// Initialize web3
const contractAddress = "0xD7758b318edd7aD12A2A0142C56c335be1607A79";
const web3Options = {
  transactionConfirmationBlocks: 1
};
const web3 = new Web3(Web3.givenProvider, null, web3Options);

const App = () => {
  return (
    <Web3Context.Provider value={web3}>
      <div className="App">
        <header>
          <h1>Contract Inspector</h1>
        </header>
        <div className="App-header">
          <ContractDefinition address={contractAddress} abi={abi} />
        </div>
      </div>
    </Web3Context.Provider>
  );
};

export default App;
