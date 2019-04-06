import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Web3 from "web3";
import { Web3Context, AccountContext } from "./Web3Context";
import GlobalAppBar from "./GlobalAppBar";
import ContractDefinition from "./ContractDefinition";

// Initialize web3
const web3Options = {
  transactionConfirmationBlocks: 1
};
Web3.givenProvider.enable();
const web3 = new Web3(Web3.givenProvider, null, web3Options);

const App = ({ contractData }) => {
  const { abi } = contractData;
  const [selectedAccount, setSelectedAccount] = useState("babababa");

  return (
    <Router>
      <Web3Context.Provider value={web3}>
        <AccountContext.Provider
          value={{ selectedAccount, setSelectedAccount }}
        >
          <Switch>
            <Route
              path="/:contractAddress"
              render={props => <ContractPage abi={abi} {...props} />}
            />
            <Route
              path="/"
              render={() => (
                <Redirect to="0xD7758b318edd7aD12A2A0142C56c335be1607A79" />
              )}
              exact
            />
          </Switch>
        </AccountContext.Provider>
      </Web3Context.Provider>
    </Router>
  );
};

const ContractPage = ({ match, abi }) => {
  const { contractAddress } = match.params;
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <main>
      <CssBaseline />
      <GlobalAppBar
        setDrawerOpen={setDrawerOpen}
        contractAddress={contractAddress}
      />
      <header />
      <ContractDefinition
        address={contractAddress}
        abi={abi}
        isDrawerOpen={isDrawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </main>
  );
};

export default App;
