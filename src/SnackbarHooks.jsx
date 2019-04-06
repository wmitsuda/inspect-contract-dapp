import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useSnackbar = (key, message) => {
  const [isOpen, setOpen] = useState(false);
  const showSnackbar = () => {
    setOpen(true);
  };
  const closeSnackbar = () => {
    setOpen(false);
  };

  const SnackbarComponent = () => (
    <Snackbar
      key={key}
      open={isOpen}
      autoHideDuration={3000}
      onClose={closeSnackbar}
      message={message}
      action={
        <IconButton color="inherit" onClick={closeSnackbar}>
          <CloseIcon />
        </IconButton>
      }
    />
  );

  return [showSnackbar, SnackbarComponent];
};

export { useSnackbar };
