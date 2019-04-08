import React, { useContext } from "react";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import { FunctionContext } from "./FunctionContext";
import ReturnValue from "./ReturnValue";

const FunctionOutputs = ({ processing, returnValues }) => {
  const f = useContext(FunctionContext);

  return (
    <CardContent>
      <Typography variant="h6">Outputs:</Typography>
      <Table padding="dense">
        <TableHead>
          <TableRow>
            <TableCell>Return</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {f.outputs.map((output, key) => (
            <ReturnValue
              key={key}
              attrName={output.name}
              attrs={{
                index: key,
                type: output.type,
                value: returnValues && returnValues[key]
              }}
            />
          ))}
        </TableBody>
      </Table>
    </CardContent>
  );
};

export default FunctionOutputs;
