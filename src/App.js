import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Web3 from "web3";
import { Web3Context, AccountContext, useDefaultAccount } from "./Web3Context";
import ContractPage from "./ContractPage";

// Initialize web3
const web3Options = {
  transactionConfirmationBlocks: 1
};
Web3.givenProvider.enable();
const web3 = new Web3(Web3.givenProvider, null, web3Options);

const App = ({ contractData }) => {
  const { abi } = contractData;
  const defaultAccount = useDefaultAccount();

  const [selectedAccount, setSelectedAccount] = useState(defaultAccount);
  useEffect(() => setSelectedAccount(defaultAccount), [defaultAccount]);

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

export default App;
