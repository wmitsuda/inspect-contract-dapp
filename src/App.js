import React, { useState, useEffect, useContext, useMemo } from "react";
import "./App.css";
import rawContract from "./StandardERC20Token.json";
import styled from "styled-components";
import Web3 from "web3";
import { Formik, Form } from "formik";
import FunctionInputs from "./FunctionInputs";
import FunctionOutputs from "./FunctionOutputs";
import { Web3Context } from "./Web3Context";

const abi = rawContract.abi;

// Initialize web3
const contractAddress = "0xD7758b318edd7aD12A2A0142C56c335be1607A79";
const web3Options = {
  transactionConfirmationBlocks: 1
};
const web3 = new Web3(Web3.givenProvider, null, web3Options);

const ContractDefinition = ({ abi, address }) => {
  const [contract, setContract] = useState();
  const abiFunctions = useMemo(() => abi.filter(f => f.type === "function"), [
    abi
  ]);
  const web3 = useContext(Web3Context);

  useEffect(() => {
    const createContract = async () => {
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      setContract(
        new web3.eth.Contract(abi, address, { from, ...web3Options })
      );
    };
    createContract();
  }, [web3, abi, address]);

  return (
    <section>
      <ClippedHeader>
        <h4>Address:&nbsp;{contractAddress}</h4>
      </ClippedHeader>
      {abiFunctions.map((f, key) => (
        <FunctionDefinition key={key} f={f} index={key} contract={contract} />
      ))}
    </section>
  );
};

const ClippedHeader = styled.article`
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  border: 1px solid red;
`;

const FunctionDefinition = ({ f, index, contract }) => {
  const [returnValues, setReturnValues] = useState();
  const initialValues = useMemo(
    () =>
      f.inputs.reduce((o, input) => Object.assign(o, { [input.name]: "" }), {}),
    [f]
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    // Calculate parameters
    const args = [];
    for (const input of f.inputs) {
      args.push(values[input.name]);
    }

    const method = contract.methods[f.name](...args);
    if (f.constant) {
      // Call
      const outputs = await method.call();
      setReturnValues([outputs]);
    } else {
      // Send
      const outputs = await method.send();
      setReturnValues([outputs.status]);
    }

    setSubmitting(false);
  };

  return (
    <FunctionContainer>
      <Formik
        initialValues={initialValues}
        validateOnChange={false}
        onSubmit={handleSubmit}
        render={props => (
          <FunctionForm
            index={index}
            f={f}
            returnValues={returnValues}
            {...props}
          />
        )}
      />
    </FunctionContainer>
  );
};

const FunctionContainer = styled.article`
  border: 1px solid black;
  margin: 5px 20px;
  padding: 10px;
  text-align: left;
`;

const FunctionForm = ({
  values,
  errors,
  touched,
  setFieldValue,
  isSubmitting,
  index,
  f,
  returnValues
}) => (
  <Form className="needs-validation" noValidate>
    <header>
      <h4>
        Function #{index}: {f.name}()
      </h4>
    </header>
    <FunctionInputs
      inputs={f.inputs}
      disabled={isSubmitting}
      setFieldValue={setFieldValue}
      errors={errors}
      touched={touched}
    />
    {f.payable && "Payable: "}
    <button type="submit" disabled={isSubmitting}>
      {f.constant ? "Call" : "Send"}
    </button>
    <hr />
    <FunctionOutputs
      processing={isSubmitting}
      outputs={f.outputs}
      returnValues={returnValues}
    />
  </Form>
);

const App = () => {
  return (
    <Web3Context.Provider value={web3}>
      <div className="App">
        <header>
          <h1>Contract Inspector</h1>
        </header>
        <div className="App-header">
          <ContractDefinition abi={abi} address={contractAddress} />
        </div>
      </div>
    </Web3Context.Provider>
  );
};

export default App;
