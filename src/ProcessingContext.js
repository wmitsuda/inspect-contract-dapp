import React, { useState, useContext } from "react";

const ProcessingContext = React.createContext();

const useProcessing = () => useContext(ProcessingContext);

const useNewProcessingContext = () => {
  const [processing, setProcessing] = useState(false);
  return { processing, setProcessing };
};

export { ProcessingContext, useProcessing, useNewProcessingContext };
