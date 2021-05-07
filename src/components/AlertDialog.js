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

    const handleTx = () => {
        //this.props.text
        window.open('https://ropsten.etherscan.io/tx/' + '0x8360d4b31c2a924799a121ec304c48ab5aa620db7b9905c53d899da9a7ccc91b', '_blank');
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
                <DialogTitle id="alert-dialog-title">{props.dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <ul>
                        <li>{props.text}</li>
                        <br />
                        <li align="center"> <img height="70px" width="70px" src="metamask.svg" /></li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Maybe later
          </Button>
                    <Button onClick={(props.okButton === 'Install') ? handleInstall : handleTx} color="primary">
                        {props.okButton}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}