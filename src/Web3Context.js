import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import QrReader from "react-qr-reader";

const Web3Context = React.createContext();

const useWeb3 = () => useContext(Web3Context);

const useNetwork = () => {
  const web3 = useWeb3();
  const [networkId, setNetworkId] = useState();
  const [networkName, setNetworkName] = useState();

  useEffect(() => {
    const getNetworkId = async () => {
      const id = await web3.eth.net.getId();
      setNetworkId(id);

      let name;
      switch (id) {
        case 1:
          name = "Main";
          break;
        case 3:
          name = "Ropsten";
          break;
        case 4:
          name = "Rinkeby";
          break;
        case 42:
          name = "Kovan";
          break;
        default:
          name = `Unknown network (${id})`;
      }
      setNetworkName(name);
    };
    getNetworkId();
  }, [web3]);

  return [networkId, networkName];
};

const useAccounts = () => {
  const web3 = useWeb3();
  const [accounts, setAccounts] = useState();

  useEffect(() => {
    const getAccounts = async () => {
      const accs = await web3.eth.getAccounts();
      setAccounts(accs);
    };
    getAccounts();
  }, [web3]);

  return accounts;
};

const AccountContext = React.createContext();

const useSelectedAccount = () => useContext(AccountContext);

const useDefaultAccount = () => {
  const [defaultAccount, setDefaultAccount] = useState();

  useEffect(() => {
    const enableWeb3 = async () => {
      const accounts = await Web3.givenProvider.enable();
      setDefaultAccount(accounts[0]);
    };
    enableWeb3();
  }, []);

  return defaultAccount;
};

const networkPrefixes = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  42: "kovan."
};

const useEtherscan = () => {
  const [networkId] = useNetwork();

  let networkPrefix = networkPrefixes[networkId];
  if (!networkPrefix) {
    return undefined;
  }

  return {
    getTxURL: transactionHash =>
      `https://${networkPrefix}etherscan.io/tx/${transactionHash}`,
    getAddressURL: address =>
      `https://${networkPrefix}etherscan.io/address/${address}`,
    getTokenURL: address =>
      `https://${networkPrefix}etherscan.io/token/${address}`
  };
};

const useQRReader = setValue => {
  const [isScanning, setScanning] = useState(false);
  const web3 = useContext(Web3Context);

  const onScan = result => {
    if (web3.utils.isAddress(result)) {
      setValue(result);
      setScanning(false);
    }
  };

  const onError = err => {
    console.log("Error while scanning address: " + err);
    setScanning(false);
  };

  const toggleScanning = () => setScanning(!isScanning);

  const QRReader = () => (
    <>{isScanning && <QrReader onScan={onScan} onError={onError} />}</>
  );

  return [isScanning, toggleScanning, QRReader];
};

export {
  Web3Context,
  useWeb3,
  useNetwork,
  useAccounts,
  AccountContext,
  useSelectedAccount,
  useDefaultAccount,
  useEtherscan,
  useQRReader
};
