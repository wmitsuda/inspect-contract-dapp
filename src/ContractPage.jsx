import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { DrawerContext } from "./DrawerContext";
import GlobalAppBar from "./GlobalAppBar";
import ContractDefinition from "./ContractDefinition";

const ContractPage = ({ match, abi, abiSetter }) => {
  const { contractAddress } = match.params;
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.title = `Smart Contract Inspector | ${contractAddress}`;
  }, [contractAddress]);

  return (
    <main>
      <CssBaseline />
      <DrawerContext.Provider value={{ isDrawerOpen, setDrawerOpen }}>
        <GlobalAppBar />
        <ContractDefinition
          address={contractAddress}
          abi={abi}
          abiSetter={abiSetter}
        />
      </DrawerContext.Provider>
    </main>
  );
};

export default ContractPage;
