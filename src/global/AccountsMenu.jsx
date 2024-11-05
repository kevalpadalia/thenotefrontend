import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Box, Menu, MenuItem, Divider, Typography, useTheme,Avatar } from "@mui/material";
import {SignOut,UserCircle } from "@phosphor-icons/react";
import axios from "axios";
import { loginUser } from "../store/slices/UserSlice";
import { tokens} from "../theme";
import Loader from "../components/helpers/loader/Loader";

const AccountsMenu = () => {
    // STANDARDS
    let navigate = useNavigate();
    const dispatch = useDispatch()
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // STATE
    const utility = useSelector((state) => {
        return state && state.utility ? state.utility : {}
    })
    const user = useSelector((state) => {
        return state && state.user && state.user.user ? state.user.user : {}
    })

    // VARIABLES
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    // METHODS
    const handleNavigation=(route)=>{
        setAnchorEl(null)
        navigate(route)
    }
    const handleLogout = () => {
        setIsLoading(true)
        axios.get(utility.api + "accounts/logout", utility.config)
        .then(response => {
            if (response.status === 200) {
                let payload = {}
                payload['user'] = null
                payload['loggedIn'] = false
                dispatch(loginUser(payload))
                setIsLoading(false)
                navigate("/login")
            }
        }).catch(error => {
            setIsLoading(false)
            console.log(error)
        });
        setIsLoading(false)
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // WATHCERS

    // TEMPLATES
    return (
        <Fragment>
            {isLoading ?(
                <Loader/>
            ):(
                <Box display="flex"  pl={1}>
                    <Box sx={{ borderRadius: '10px' }} >
                        <Avatar
                        size="22"
                            onClick={handleMenuOpen}
                            sx={{
                                cursor:"pointer",
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: 25, 
                                height: 25,
                                fontSize: "12px",
                                fontWeight:"bold",
                                color:colors.grey[theme.palette.mode==='dark' ? 100:1000],
                                bgcolor:theme.palette.mode === "dark"?colors.primaryhighlight[400]:colors.primaryhighlight[300]
                            }}
                        >
                            {user && user.authenticated && user.name?user.name.charAt(0):""}
                        </Avatar>
                    </Box>
                    <Menu
                        id="top-bar-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            style: {
                                backgroundColor: colors.primary[500],
                            },
                        }}
                    >
                        {user && user.authenticated && user._id &&
                            <Box sx={{ m: "15px" }} textAlign="center">
                                <Typography
                                    variant="h5"
                                    color={colors.grey[100]}
                                    fontWeight="bolder"
                                >
                                    Hello, {user && user.authenticated && user.name?user.name:""} 👋
                                    {/* Hello, {user.name} 😁 */}
                                </Typography>
                            </Box>
                        }
                        {user && user.authenticated && user.email &&
                            <Divider />
                        }
                        <Divider />
                        <MenuItem onClick={()=>handleNavigation("/user/details")}><UserCircle size={25}  weight="duotone" /><Typography size={25} color={colors.grey[100]} sx={{ ml: "10px" }} >Profile</Typography ></MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}><SignOut  size={25} weight="duotone" /><Typography color={colors.grey[100]} sx={{ ml: "10px" }} >Logout</Typography ></MenuItem>
                    </Menu>
                </Box>
            )}
        </Fragment>
    )
}

export default AccountsMenu;