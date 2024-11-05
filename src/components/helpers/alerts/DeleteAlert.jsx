import { Fragment, useState } from "react";
import { useTheme, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Trash, Prohibit } from "@phosphor-icons/react";
import { tokens } from '../../../theme';

const DeleteAlert = ({ msg, onDelete, onCancel, buttonText, icon, header }) => {
    const [open, setOpen] = useState(true);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const handleClose = () => {
        setOpen(false);
        onCancel()
    };
    const handleAgree = () => {
        setOpen(false);
        onDelete()
    };
    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle mb="15px" backgroundColor={colors.redAccent[600]} color={colors.redAccent[200]}>
                    {header ? header : "Delete Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {msg}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="accent" variant="outlined" disableElevation>Cancel <Prohibit size={25} weight="duotone" color={colors.redAccent[400]} style={{ marginLeft: "5px" }} /></Button>
                    <Button onClick={handleAgree} color="accent" variant="outlined" disableElevation autoFocus>{buttonText ? buttonText : 'Delete'} {icon ? icon : <Trash size={25} weight="duotone" color={colors.redAccent[400]} style={{ marginLeft: "5px" }} />}</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default DeleteAlert;