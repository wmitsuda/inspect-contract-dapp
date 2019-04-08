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

export default withRouter(OverviewCard);
