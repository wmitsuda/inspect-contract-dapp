import React from "react";
import CardContent from "@material-ui/core/CardContent";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ReturnValue from "./ReturnValue";

const FunctionEvents = ({ events }) => (
  <CardContent>
    <Typography variant="h6">Events:</Typography>
    {events.map(({ logIndex, ...rest }, key) => (
      <FunctionEvent key={logIndex} {...rest} />
    ))}
  </CardContent>
);

const FunctionEvent = ({ event, attrs }) => (
  <ExpansionPanel defaultExpanded={true}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="subtitle1">{event}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Table padding="dense">
        <TableHead>
          <TableRow>
            <TableCell>Attribute</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(attrs).map(k => (
            <ReturnValue key={k} attrName={k} attrs={attrs[k]} />
          ))}
        </TableBody>
      </Table>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default FunctionEvents;
