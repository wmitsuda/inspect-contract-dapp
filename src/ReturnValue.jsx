import React, { useState, useMemo } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useEtherscan } from "./Web3Context";
import ExternalLink from "./ExternalLink";

library.add(faCopy);
library.add(faExternalLinkAlt);

const ReturnValue = ({ type, value }) => {
  const [formatValue, setFormatValue] = useState(true);
  const etherscan = useEtherscan();

  const isNumeric = useMemo(
    () => type.startsWith("int") || type.startsWith("uint"),
    [type]
  );
  const isString = useMemo(() => type === "string", [type]);
  const isBool = useMemo(() => type === "bool", [type]);
  const isAddress = useMemo(() => type === "address", [type]);

  let displayValue;
  if (isNumeric) {
    const numericValue = parseInt(value);
    displayValue = formatValue
      ? numericValue.toLocaleString()
      : numericValue.toString();
  } else if (isString) {
    displayValue = `"${value}"`;
  } else if (isBool) {
    displayValue = value ? "true" : "false";
  } else {
    displayValue = value || "<undefined>";
  }

  return (
    <>
      {value && displayValue} ({type})
      {value && isNumeric && (
        <span>
          &nbsp;
          <label>
            <input
              type="checkbox"
              onChange={() => setFormatValue(!formatValue)}
              checked={formatValue}
            />
            &nbsp;Format value
          </label>
        </span>
      )}
      {value && isAddress && etherscan && (
        <span>
          &nbsp;
          <CopyToClipboard text={value}>
            <FontAwesomeIcon icon="copy" />
          </CopyToClipboard>
          &nbsp;
          <ExternalLink href={etherscan.getAddressURL(value)}>
            <FontAwesomeIcon icon="external-link-alt" />
          </ExternalLink>
        </span>
      )}
    </>
  );
};

export default ReturnValue;
