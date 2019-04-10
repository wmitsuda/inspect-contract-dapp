import React, { useContext } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router";
import { HashLink as Link } from "react-router-hash-link";
import { FunctionContext } from "./FunctionContext";
import AnchorLink from "./AnchorLink";

const FunctionTitle = ({ location: { pathname } }) => {
  const f = useContext(FunctionContext);
  return <FunctionHeader f={f} pathname={pathname} />;
};

const FunctionHeader = React.memo(({ f, pathname }) => (
  <CardHeader
    disableTypography={true}
    title={<FunctionDeclaration f={f} pathname={pathname} />}
    subheader={
      <Typography variant="caption" color="textSecondary">
        interfaceId ({f.signature})
      </Typography>
    }
  />
));

const FunctionDeclaration = ({ f, pathname }) => (
  <Grid alignItems="baseline" spacing={8} container>
    <AnchorLink id={f.name} />
    <Grid item>
      <Typography variant="h6" color="textSecondary">
        <small>function</small>
      </Typography>
    </Grid>
    <Grid item>
      <Typography variant="h6" color="textPrimary">
        <strong>{` ${f.name}(${f.inputs.length > 0 ? "..." : ""})`}</strong>
      </Typography>
    </Grid>
    <Grid item>
      <Typography variant="h6" color="textSecondary" noWrap={true}>
        <FunctionDeclarationSuffix f={f} />
        &nbsp;
        <Link to={{ pathname: pathname, hash: f.name }}>#</Link>
      </Typography>
    </Grid>
  </Grid>
);

const FunctionDeclarationSuffix = ({ f }) => (
  <small>
    {" "}
    public {f.constant ? " view" : ""}
    {f.payable ? " payable" : ""}
    <FunctionReturns outputs={f.outputs} />
  </small>
);

const FunctionReturns = ({ outputs }) => {
  if (outputs.length === 0) {
    return "";
  }

  return (
    outputs
      .map(o => o.type + (o.name ? ` ${o.name}` : ""))
      .reduce(
        (str, o, idx) => str + (idx === 0 ? "" : ", ") + o,
        " returns ("
      ) + ")"
  );
};

export default withRouter(FunctionTitle);
