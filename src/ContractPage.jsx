import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import GlobalAppBar from "./GlobalAppBar";
import ContractDefinition from "./ContractDefinition";

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

export default ContractPage;
