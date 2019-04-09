import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Web3 from "web3";
import { Web3Context, AccountContext, useDefaultAccount } from "./Web3Context";
import ContractPage from "./ContractPage";

// Initialize web3
const web3Options = {
  transactionConfirmationBlocks: 1
};
Web3.givenProvider.enable();
const web3 = new Web3(Web3.givenProvider, null, web3Options);

const App = () => {
  const [abi, setAbi] = useState([]);
  const defaultAccount = useDefaultAccount();

  const [selectedAccount, setSelectedAccount] = useState(defaultAccount);
  useEffect(() => setSelectedAccount(defaultAccount), [defaultAccount]);

  return (
    <Router>
      <Web3Context.Provider value={web3}>
        <AccountContext.Provider
          value={{ selectedAccount, setSelectedAccount }}
        >
          <SnackbarProvider maxSnack={3} autoHideDuration={6000}>
            <Switch>
              <Route
                path="/:contractAddress"
                render={props => (
                  <ContractPage abi={abi} abiSetter={setAbi} {...props} />
                )}
              />
              <Route
                path="/"
                render={props => (
                  <ContractPage abi={abi} abiSetter={setAbi} {...props} />
                )}
                exact
              />
            </Switch>
          </SnackbarProvider>
        </AccountContext.Provider>
      </Web3Context.Provider>
    </Router>
  );
};

export default App;
