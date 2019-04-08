import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Identicon } from "ethereum-react-components";
import { Formik, Form } from "formik";
import AnchorLink from "./AnchorLink";
import FunctionInput from "./FunctionInput";
import erc20ABI from "./abi/ERC20.json";
import erc165ABI from "./abi/ERC165.json";
import erc721ABI from "./abi/ERC721.json";
import demoABI from "./abi/Demo.json";

const OverviewCard = ({ address, abiSetter, history }) => {
  const [isEditing, setEditing] = useState(false);
  const initialValues = { contractAddress: address };

  const handleSubmit = (values, actions) => {
    console.log(values);
    history.push(values.contractAddress);
    setEditing(false);
    actions.setSubmitting(false);
  };

  return (
    <Card>
      <AnchorLink id="_contract" />
      <OverviewCardHeader address={address} isEditing={isEditing} />
      {isEditing ? (
        <Formik
          initialValues={initialValues}
          validateOnChange={false}
          onSubmit={handleSubmit}
          render={props => (
            <Form className="needs-validation" noValidate>
              <CardContent>
                <Divider />
                <FunctionInput
                  input={{ type: "address", name: "contractAddress" }}
                  hideType={true}
                />
              </CardContent>
              <CardActions>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Change
                </Button>
              </CardActions>
            </Form>
          )}
        />
      ) : (
        <CardActions>
          <Button
            variant="text"
            color="secondary"
            onClick={() => setEditing(true)}
          >
            Change...
          </Button>
        </CardActions>
      )}
      <Divider />
      <AbiCardActions abiSetter={abiSetter} />
    </Card>
  );
};

const OverviewCardHeader = ({ address, isEditing }) => (
  <CardHeader
    avatar={<Identicon address={address} size="small" />}
    title={<OverviewCardTitle address={address} isEditing={isEditing} />}
  />
);

const OverviewCardTitle = ({ address, isEditing }) => (
  <Grid container alignItems="center" spacing={8}>
    <Grid item>
      <Typography
        variant="h6"
        color={isEditing ? "textSecondary" : "textPrimary"}
      >
        {address}
      </Typography>
    </Grid>
  </Grid>
);

const AbiCardActions = React.memo(({ abiSetter }) => (
  <CardActions>
    <Button size="small" color="primary">
      Load ABI from JSON file...
    </Button>
    <UsePredefinedABI abiSetter={abiSetter} abi={erc20ABI}>
      Use ERC20
    </UsePredefinedABI>
    <UsePredefinedABI abiSetter={abiSetter} abi={erc165ABI}>
      Use ERC165
    </UsePredefinedABI>
    <UsePredefinedABI abiSetter={abiSetter} abi={erc721ABI}>
      Use ERC721
    </UsePredefinedABI>

    {process.env.NODE_ENV === "development" && (
      <UsePredefinedABI abiSetter={abiSetter} abi={demoABI}>
        Use Demo ABI
      </UsePredefinedABI>
    )}
  </CardActions>
));

const UsePredefinedABI = ({ abiSetter, abi, children }) => (
  <Button size="small" color="secondary" onClick={() => abiSetter(abi)}>
    {children}
  </Button>
);

export default withRouter(OverviewCard);
