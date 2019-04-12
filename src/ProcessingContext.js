import React, { useContext } from "react";

const ProcessingContext = React.createContext();

const useProcessing = () => useContext(ProcessingContext);

export { ProcessingContext, useProcessing };
