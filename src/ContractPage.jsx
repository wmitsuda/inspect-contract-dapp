import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { DrawerContext, useDrawerState } from "./DrawerContext";
import GlobalAppBar from "./GlobalAppBar";
import ContractDefinition from "./ContractDefinition";

const ContractPage = ({ match }) => {
  const { contractAddress } = match.params;
  const drawerState = useDrawerState();

  useEffect(() => {
    document.title = `Smart Contract Inspector | ${
      contractAddress ? contractAddress : "Home"
    }`;
  }, [contractAddress]);

  return (
    <main>
      <CssBaseline />
      <DrawerContext.Provider value={drawerState}>
        <GlobalAppBar />
        <ContractDefinition address={contractAddress} />
      </DrawerContext.Provider>
    </main>
  );
};

export default ContractPage;
