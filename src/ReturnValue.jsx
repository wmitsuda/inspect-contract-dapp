import React, { useState, useMemo } from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import OpenInNew from "mdi-material-ui/OpenInNew";
import ContentCopy from "mdi-material-ui/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "notistack";
import { useEtherscan } from "./Web3Context";
import ExternalLink from "./ExternalLink";

const ReturnValue = ({ attrName, attrs: { index, type, value } }) => {
  const [formatValue, setFormatValue] = useState(true);
  const etherscan = useEtherscan();

  const { enqueueSnackbar } = useSnackbar();

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
    <TableRow>
      <TableCell>
        {attrName ? attrName : `unnamed #${index}`} ({type})
      </TableCell>
      <TableCell>{value && displayValue}</TableCell>
      <TableCell>
        {value && isNumeric && (
          <span className="form-check form-check-inline">
            &nbsp;
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                onChange={() => setFormatValue(!formatValue)}
                checked={formatValue}
              />
              &nbsp;Format number
            </label>
          </span>
        )}
        {value && isAddress && etherscan && (
          <span>
            &nbsp;
            <Tooltip title="Copy to clipboard">
              <CopyToClipboard
                text={value}
                onCopy={() => enqueueSnackbar("Address copied to clipboard")}
              >
                <IconButton aria-label="Copy address">
                  <ContentCopy />
                </IconButton>
              </CopyToClipboard>
            </Tooltip>
            &nbsp;
            <ExternalLink href={etherscan.getAddressURL(value)}>
              <Tooltip title="Open in etherscan.io">
                <IconButton aria-label="Open in etherscan.io">
                  <OpenInNew />
                </IconButton>
              </Tooltip>
            </ExternalLink>
          </span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ReturnValue;
