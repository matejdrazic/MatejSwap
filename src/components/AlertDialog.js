import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
    const [open, setOpen] = React.useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        props.setAlertDialog();
        setOpen(false);
    };

    const handleInstall = () => {
        window.open('https://metamask.io', '_blank');
        props.setAlertDialog();
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"MetaMask is not detected!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.text}
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Maybe later
          </Button>
                    <Button onClick={handleInstall} color="primary">
                        Install
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}