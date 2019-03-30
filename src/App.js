import React, { useState, useEffect, useContext, useMemo } from "react";
import "./App.css";
import rawContract from "./StandardERC20Token.json";
import styled from "styled-components";
import Web3 from "web3";
import { Formik, Form, Field } from "formik";

const abi = rawContract.abi;

// Initialize web3
const contractAddress = "0xD7758b318edd7aD12A2A0142C56c335be1607A79";
const web3Options = {
  transactionConfirmationBlocks: 1
};
const web3 = new Web3(Web3.givenProvider, null, web3Options);
const Web3Context = React.createContext();

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

const FunctionInputs = ({
  inputs,
  disabled,
  setFieldValue,
  errors,
  touched
}) => {
  const web3 = useContext(Web3Context);

  const setMyAddress = fieldName => async () => {
    const accounts = await web3.eth.getAccounts();
    const defAccount = accounts[0];
    setFieldValue(fieldName, defAccount);
  };

  return inputs.map((input, key) => (
    <FunctionInput
      key={key}
      index={key}
      input={input}
      disabled={disabled}
      setMyAddress={setMyAddress}
      errors={errors[input.name]}
      touched={touched[input.name]}
    />
  ));
};

const requireValidation = value => {
  let errorMessage;
  if (!value || value.trim() === "") {
    errorMessage = "Value is required";
  }
  return errorMessage;
};

const FunctionInput = ({
  index,
  input,
  disabled,
  setMyAddress,
  errors,
  touched
}) => (
  <div className={`form-group ${errors && touched ? "text-danger" : null}`}>
    <label htmlFor={input.name}>Input #{index}: </label>
    <div className="input-group">
      <Field
        type="text"
        className={`form-control ${errors && touched ? "is-invalid" : null}`}
        name={input.name}
        placeholder={input.name}
        disabled={disabled}
        validate={requireValidation}
      />
      {input.type === "address" && (
        <button
          type="button"
          className="input-group-prepend"
          onClick={setMyAddress(input.name)}
          disabled={disabled}
        >
          My address
        </button>
      )}
      {errors && touched && <div className="invalid-feedback">{errors}</div>}
    </div>
    <small className="form-text text-muted">({input.type})</small>
  </div>
);

const FunctionOutputs = ({ processing, outputs, returnValues }) => {
  return outputs.map((output, key) => (
    <FunctionOutput
      key={key}
      processing={processing}
      index={key}
      output={output}
      returnValue={returnValues && returnValues[key]}
    />
  ));
};

const FunctionOutput = ({ processing, index, output, returnValue }) => {
  const [formatValue, setFormatValue] = useState(true);

  const isNumeric =
    output.type.startsWith("int") || output.type.startsWith("uint");

  let value = "<undefined>";
  if (processing) {
    value = "<processing...>";
  } else if (returnValue) {
    if (isNumeric) {
      const numericValue = parseInt(returnValue);
      value = formatValue
        ? numericValue.toLocaleString()
        : numericValue.toString();
    } else {
      value = returnValue || "<undefined>";
    }
  }

  return (
    <div>
      Output #{index}: {output.name}
      {value} ({output.type})
      {returnValue && isNumeric && (
        <span>
          &nbsp;
          <input
            type="checkbox"
            onChange={() => setFormatValue(!formatValue)}
            checked={formatValue}
          />
          &nbsp;Format value
        </span>
      )}
    </div>
  );
};

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
