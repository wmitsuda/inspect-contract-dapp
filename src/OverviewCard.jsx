import React, { useState, useMemo } from "react";
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
import { useWeb3 } from "./Web3Context";
import { createValidationSchema } from "./ValidationSchema";
import FunctionInput from "./FunctionInput";

const OverviewCard = ({ address, abiSetter, history }) => {
  const [isEditing, setEditing] = useState(false);
  const initialValues = { contractAddress: address ? address : "" };

  const web3 = useWeb3();
  const ValidationSchema = useMemo(() => {
    const inputs = [{ name: "contractAddress", type: "address" }];
    return createValidationSchema(inputs, false, web3);
  }, [web3]);

  const handleSubmit = (values, actions) => {
    history.push(values.contractAddress);
    setEditing(false);
    actions.setSubmitting(false);
  };

  return (
    <Card>
      <AnchorLink id="_contract" />
      <OverviewCardHeader address={address} isEditing={isEditing} />
      <Divider />
      {isEditing ? (
        <Formik
          initialValues={initialValues}
          validateOnChange={false}
          validationSchema={ValidationSchema}
          onSubmit={handleSubmit}
          render={({ setFieldValue, setFieldTouched }) => {
            const AddressButton = ({ address, children, ...rest }) => (
              <Button
                variant="outlined"
                onClick={() => setValue("contractAddress", address)}
                {...rest}
              >
                {children}
              </Button>
            );

            const setValue = (name, value) => {
              setFieldValue(name, value, false);
              setFieldTouched(name);
            };

            return (
              <Form noValidate>
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
                  <AddressButton address="0xD7758b318edd7aD12A2A0142C56c335be1607A79">
                    ERC20 Test (ropsten)
                  </AddressButton>
                  <AddressButton address="0xbae733b606788f169199D24c69bdC95a2dd9a500">
                    Demo (ropsten)
                  </AddressButton>
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

const OverviewCardHeader = ({ address, isEditing }) => {
  if (!address) {
    return (
      <CardContent>
        <Typography align="center" variant="h5" color="textPrimary">
          <span role="img" aria-label="hint">
            💡
          </span>{" "}
          Load some contract
        </Typography>
      </CardContent>
    );
  }

  return (
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
};

export default withRouter(OverviewCard);
