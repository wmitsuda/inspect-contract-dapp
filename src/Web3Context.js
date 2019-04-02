import React, { useState, useEffect, useContext } from "react";
import QrReader from "react-qr-reader";

const Web3Context = React.createContext();

const useWeb3 = () => useContext(Web3Context);

const networkPrefixes = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  42: "kovan."
};

const getEtherscanURL = networkId => {
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

const useEtherscan = () => {
  const web3 = useWeb3();
  const [networkId, setNetworkId] = useState();

  useEffect(() => {
    const getNetworkId = async () => {
      setNetworkId(await web3.eth.net.getId());
    };
    getNetworkId();
  }, [web3]);

  return getEtherscanURL(networkId);
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

export { Web3Context, useWeb3, useEtherscan, useQRReader };
