import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tokens } from '../../../theme';
import { useTheme } from "@mui/material";
import Alert from '@mui/material/Alert';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from "axios";
import { loginUser } from "../../../store/slices/UserSlice";
import { utilities } from "../../../store/slices/UtilitySlice";

const InfoAlert = ({ details }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // alert(msg)
    let alertType = 'error'
    if (details && details.type) {
        alertType = details.type
    }
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
    };
    const utility = useSelector((state) => {
        return state.utility
    })
    const handleLogout = () => {
        axios.get(utility.api + "accounts/logout", utility.config)
            .then(response => {
                if (response.status === 200) {
                    let payload = {}
                    payload['user'] = null
                    payload['authenticated'] = false
                    dispatch(loginUser(payload))
                    navigate("/login")
                }
            }).catch(error => {
                console.log(error)
            });
    };
    useEffect(() => {
        if (details && details.msg) {
            if (details.msg === 'Unauthenticated access') {
                handleLogout()
            }
        }
    }, [])
    return (
        <Fragment>
            {details && details.msg && details.msg !== 'Unauthenticated access' &&
                <Dialog open={open} onClose={handleClose}>
                    {alertType == 'error' &&
                        <Alert  severity={alertType} action={
                            <Button color="inherit" size="small" onClick={handleClose}>
                                ok
                            </Button>
                        }>
                            {details.msg ? details.msg : ''}
                        </Alert>
                    }
                    {alertType == 'success' &&
                        <Alert severity={alertType} action={
                            <Button color="inherit" size="small" onClick={handleClose}>
                                ok
                            </Button>
                        }>
                            {details.msg ? details.msg : ''}
                        </Alert>
                    }
                    {alertType == 'info' &&
                        <Alert severity={alertType} action={
                            <Button color="inherit" size="small" onClick={handleClose}>
                                ok
                            </Button>
                        }>
                            {details.msg ? details.msg : ''}
                        </Alert>
                    }
                </Dialog>
            }
            {/* <Dialog open={open} onClose={handleClose}>
                <DialogTitle mb="15px" backgroundColor={alertColor}>
                    {msg}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="accent" variant="outlined" disableElevation>ok</Button>
                </DialogActions>
            </Dialog> */}
        </Fragment>
    )
}
export default InfoAlert