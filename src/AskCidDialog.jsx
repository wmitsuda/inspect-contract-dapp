import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CID } from "ipfs-http-client";

const useDialog = handleSubmit => {
  const [isOpen, setOpen] = useState(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);

  const AskCidDialog = () => (
    <>
      {isOpen && (
        <DialogComponent
          isOpen={isOpen}
          close={close}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );

  return { open, AskCidDialog };
};

const initialValues = {
  cid: ""
};

const shape = {
  cid: Yup.string()
    .required("Value is required")
    .test("is-cid", "Value is not a valid CID", value => {
      try {
        new CID(value);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    })
};
const validationSchema = Yup.object().shape(shape);

const DialogComponent = ({ isOpen, close, handleSubmit }) => {
  const internalHandleSubmit = (values, { setSubmitting }) => {
    handleSubmit(values.cid);
    setSubmitting(false);
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>Load ABI</DialogTitle>
      <Formik
        initialValues={initialValues}
        validateOnChange={false}
        validationSchema={validationSchema}
        onSubmit={internalHandleSubmit}
        render={props => (
          <Form>
            <DialogContent>
              <DialogContentText>
                Enter the CID of the json ABI you want to load. We will then try
                to get an object from IPFS with the informed CID and interpret
                it as an json ABI.
              </DialogContentText>
              <Field
                name="cid"
                render={({
                  field,
                  form: { isSubmitting, errors, touched }
                }) => (
                  <TextField
                    {...field}
                    label="CID"
                    error={errors.cid && touched.cid}
                    helperText={
                      errors.cid && touched.cid ? errors.cid : "(IPFS CID)"
                    }
                    margin="normal"
                    disabled={isSubmitting}
                    required
                    fullWidth
                  />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Load
              </Button>
            </DialogActions>
          </Form>
        )}
      />
    </Dialog>
  );
};

export { useDialog };
