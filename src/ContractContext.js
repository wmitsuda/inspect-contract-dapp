import React, { useContext } from "react";

const ContractContext = React.createContext();

const useContract = () => useContext(ContractContext);

export { ContractContext, useContract };
