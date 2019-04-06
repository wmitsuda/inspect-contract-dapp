import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { DrawerContext } from "./DrawerContext";
import GlobalAppBar from "./GlobalAppBar";
import ContractDefinition from "./ContractDefinition";

const ContractPage = ({ match, abi }) => {
  const { contractAddress } = match.params;
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <main>
      <CssBaseline />
      <DrawerContext.Provider value={{ isDrawerOpen, setDrawerOpen }}>
        <GlobalAppBar contractAddress={contractAddress} />
        <ContractDefinition address={contractAddress} abi={abi} />
      </DrawerContext.Provider>
    </main>
  );
};

export default ContractPage;
