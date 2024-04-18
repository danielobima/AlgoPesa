import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FC } from "react";
import { ConversionResponse } from "../apis/convert";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  response: ConversionResponse | undefined;
};
const ResponseDialog: FC<Props> = ({ open, setOpen, response }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>{response?.message}</DialogTitle>
      <DialogContent>
        <DialogContentText>Transaction ID: {response?.transactionId}</DialogContentText>
        <DialogContentText>KES: {response?.amount_in_ksh}</DialogContentText>
        <DialogContentText>ALGO: {response?.amount_in_algorand}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponseDialog;
