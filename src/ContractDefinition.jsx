import React, { useState, useEffect, useMemo } from "react";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import { useWeb3, useSelectedAccount } from "./Web3Context";
import OverviewCard from "./OverviewCard";
import AbiCard from "./AbiCard";
import FunctionDefinition from "./FunctionDefinition";
import ContractDrawer from "./ContractDrawer";

const ContractDefinition = ({ address, abi, abiSetter }) => {
  const [contract, setContract] = useState();
  const abiFunctions = useMemo(() => abi.filter(f => f.type === "function"), [
    abi
  ]);
  const abiEvents = useMemo(() => abi.filter(f => f.type === "event"), [abi]);

  const web3 = useWeb3();
  const { selectedAccount } = useSelectedAccount();

  useEffect(() => {
    const createContract = async () => {
      setContract(
        new web3.eth.Contract(abi, address, {
          from: selectedAccount,
          ...web3.options
        })
      );
    };
    createContract();
  }, [web3, selectedAccount, abi, address]);

  return (
    <ContractSection>
      <Grid direction="column" spacing={16} container>
        <Grid item>
          <OverviewCard address={address} abiSetter={abiSetter} />
        </Grid>
        <Grid item>
          <AbiCard
            abiSetter={abiSetter}
            noAbi={!contract || abiFunctions.length === 0}
          />
        </Grid>
        {contract &&
          abiFunctions.length > 0 &&
          abiFunctions.map(
            (f, key) =>
              f.signature && (
                <Grid key={f.signature} item>
                  <FunctionDefinition
                    f={f}
                    contract={contract}
                    eventABI={abiEvents}
                  />
                </Grid>
              )
          )}
      </Grid>
      <ContractDrawer address={address} abiFunctions={abiFunctions} />
    </ContractSection>
  );
};

const ContractSection = styled.section`
  background-color: #eeeeee;
  padding: 2rem;
`;

export default ContractDefinition;
