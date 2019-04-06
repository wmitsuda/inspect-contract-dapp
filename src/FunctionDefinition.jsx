import React, { useState, useMemo } from "react";
import { HashLink as Link } from "react-router-hash-link";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Formik, Form } from "formik";
import AnchorLink from "./AnchorLink";
import FunctionInputs from "./FunctionInputs";
import FunctionOutputs from "./FunctionOutputs";
import FunctionEvents from "./FunctionEvents";

const FunctionDefinition = ({ f, index, contract, eventABI }) => {
  const [returnValues, setReturnValues] = useState();
  const [returnedEvents, setReturnedEvents] = useState();
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
      try {
        const outputs = await method.send();
        setReturnValues([outputs.status]);

        // Extract and parse received events
        const processEvent = e => {
          const { event: eventName, returnValues } = e;
          const abi = eventABI.filter(e => e.name === eventName);
          if (abi.length !== 1) {
            console.log("Could not find event ABI");
            return;
          }

          const event = abi[0];
          const attrs = {};
          for (const i of event.inputs) {
            Object.assign(attrs, {
              [i.name]: {
                type: i.type,
                value: returnValues[i.name]
              }
            });
          }
          return { event: e.event, logIndex: e.logIndex, attrs };
        };

        const { events } = outputs;
        const evs = Object.keys(events).flatMap(k => {
          const ev = events[k];
          if (Array.isArray(ev)) {
            return ev.map(e => processEvent(e));
          }
          return processEvent(ev);
        });
        evs.sort((a, b) => a.logIndex - b.logIndex);
        setReturnedEvents(evs);
      } catch (err) {
        console.log("User possibly has cancelled the send operation");
        console.log(err);
      }
    }

    setSubmitting(false);
  };

  return (
    <Card>
      <FunctionHeader index={index} f={f} address={contract.options.address} />
      <Divider />
      <Formik
        initialValues={initialValues}
        validateOnChange={false}
        onSubmit={handleSubmit}
        render={props => (
          <FunctionForm
            f={f}
            returnValues={returnValues}
            returnedEvents={returnedEvents}
            {...props}
          />
        )}
      />
    </Card>
  );
};

const functionReturns = f => {
  if (f.outputs.length === 0) {
    return "";
  }

  return (
    f.outputs.reduce(
      (str, o, idx) =>
        str + (idx === 0 ? "" : ", ") + o.type + (o.name ? " " + o.name : ""),
      " returns ("
    ) + ")"
  );
};

const FunctionHeader = React.memo(({ index, f, address }) => (
  <CardHeader
    title={
      <>
        <AnchorLink id={f.name} />
        <Grid alignItems="baseline" spacing={8} container>
          <Grid item>
            <Typography variant="h6" color="textSecondary">
              <small>function</small>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="textPrimary">
              <strong>{` ${f.name}(${
                f.inputs.length > 0 ? "..." : ""
              })`}</strong>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="textSecondary">
              <small>
                {" "}
                public {f.constant ? " view" : ""}
                {f.payable ? " payable" : ""}
                {functionReturns(f)}
              </small>
              &nbsp;
              <Link to={{ pathname: `/${address}`, hash: f.name }}>#</Link>
            </Typography>
          </Grid>
        </Grid>
      </>
    }
  />
));

const FunctionForm = ({
  f,
  returnValues,
  returnedEvents,
  isSubmitting,
  ...rest
}) => (
  <>
    <Form className="needs-validation" noValidate>
      <FunctionInputs
        f={f}
        inputs={f.inputs}
        disabled={isSubmitting}
        {...rest}
      />
    </Form>
    <Divider />
    {!isSubmitting && returnValues && (
      <FunctionOutputs
        outputs={f.outputs}
        processing={isSubmitting}
        returnValues={returnValues}
      />
    )}
    {returnedEvents && <FunctionEvents events={returnedEvents} />}
  </>
);

export default FunctionDefinition;
