import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useWeb3 } from "./Web3Context";
import FunctionDefinition from "./FunctionDefinition";

const ContractDefinition = ({ address, abi }) => {
  const [contract, setContract] = useState();
  const abiFunctions = useMemo(() => abi.filter(f => f.type === "function"), [
    abi
  ]);
  const abiEvents = useMemo(() => abi.filter(f => f.type === "event"), [abi]);
  const web3 = useWeb3();

  useEffect(() => {
    const createContract = async () => {
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      setContract(
        new web3.eth.Contract(abi, address, { from, ...web3.options })
      );
    };
    createContract();
  }, [web3, abi, address]);

  return (
    <section>
      <ClippedHeader>
        <h4>Address:&nbsp;{address}</h4>
      </ClippedHeader>
      {contract &&
        abiFunctions.map((f, key) => (
          <FunctionDefinition
            key={key}
            f={f}
            index={key}
            contract={contract}
            eventABI={abiEvents}
          />
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

export default ContractDefinition;
