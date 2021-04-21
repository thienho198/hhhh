import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ConfirmDialog(props) {
  const {open,question,content,nameButtonAgree='Ok',nameButtonNotAgree='Cancel'} = props.data;
  const {handleClose, handleOk} = props;
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{question}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk} color="primary">
            {nameButtonAgree}
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            {nameButtonNotAgree}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
