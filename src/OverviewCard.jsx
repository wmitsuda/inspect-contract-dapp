import React, { useState } from "react";
import { withRouter } from "react-router-dom";
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
  const initialValues = { contractAddress: address ? address : "" };

  const handleSubmit = (values, actions) => {
    history.push(values.contractAddress);
    setEditing(false);
    actions.setSubmitting(false);
  };

  return (
    <Card>
      <AnchorLink id="_contract" />
      {address ? (
        <OverviewCardHeader address={address} isEditing={isEditing} />
      ) : (
        <CardContent>
          <Typography align="center" variant="h5" color="textPrimary">
            <span role="img" aria-label="hint">
              💡
            </span>{" "}
            Load some contract
          </Typography>
        </CardContent>
      )}
      <Divider />
      {isEditing ? (
        <Formik
          initialValues={initialValues}
          validateOnChange={false}
          onSubmit={handleSubmit}
          render={({ setFieldValue, setFieldTouched }) => {
            const setValue = value => {
              setFieldValue("contractAddress", value, false);
              setFieldTouched("contractAddress");
            };

            return (
              <Form className="needs-validation" noValidate>
                <CardContent>
                  <FunctionInput
                    input={{ type: "address", name: "contractAddress" }}
                    hideType={true}
                  />
                </CardContent>
                <CardActions>
                  <Button color="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    OK
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setValue("0xD7758b318edd7aD12A2A0142C56c335be1607A79")
                    }
                  >
                    ERC20 Test (ropsten)
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setValue("0xbae733b606788f169199D24c69bdC95a2dd9a500")
                    }
                  >
                    Demo (ropsten)
                  </Button>
                </CardActions>
              </Form>
            );
          }}
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
    title={address}
    titleTypographyProps={{
      variant: "h6",
      noWrap: true,
      color: isEditing ? "textSecondary" : "textPrimary"
    }}
  />
);

export default withRouter(OverviewCard);
