import { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Button, TextField, Divider,useTheme, InputAdornment, IconButton, Typography} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { tokens } from "../../theme";
import { IdentificationCard, ShieldCheck, Eye, EyeSlash } from "@phosphor-icons/react";
import { loginUser } from "../../store/slices/UserSlice";
import { utilities,currentProject } from "../../store/slices/UtilitySlice";
import { dispatchAll} from "../../store/actions/GetActions";
import Loader from "../helpers/loader/Loader";
import { getRegex, getRegexError } from "../../utilities/regexUtilities";
import InfoAlert from "../helpers/alerts/InfoAlert";

const LoginComponent = () => {
    // STANDARDS
    let navigate = useNavigate();
    const dispatch = useDispatch()
    const isNonMobile = useMediaQuery("(min-width:600px)");
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
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [infoDetails, setInfoDetails] = useState({});

    // METHODS
    const handleNavigation = (route) => {
        navigate(route)
    }
    const initialiseStore = async (jwt, user) => {
        let payload = {}
        let userDetails = { ...user };
        userDetails['jwt'] = jwt
        userDetails['authenticated'] = true
        payload = userDetails
        const config = { headers: { Authorization: 'Bearer ' + jwt } }
        dispatch(dispatchAll(utility.api, config, "all"))
        dispatch(utilities({ 'config': config }))
        dispatch(currentProject(""))
        dispatch(loginUser(payload))
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async(values) => {
        setIsLoading(true)
        let payload = {
            email: values.email,
            password: values.password,
        }
        axios.post(utility.api + "accounts/login", payload)
            .then(response => {
                if (response.data.status === 'success') {
                    setIsLoading(false)
                    initialiseStore(response.data.jwt, response.data.user)
                } else {
                    setIsLoading(false)
                    setShowInfoAlert(true)
                    setInfoDetails({ msg: response.data.message, type: "error" })
                }
            }).catch(error => {
                setIsLoading(false)
                setShowInfoAlert(true)
                setInfoDetails({ msg: error.message, type: "error" })
            });
    }
    // WATCHER
    useEffect(() => {
        if (user && user.authenticated && user._id) {
            handleNavigation("/")
        }
    }, [user])

    return (
        <Fragment>
            {isLoading ? (
                <Loader />
            ) : (
                <Box px={2}>
                    {showInfoAlert &&
                        <InfoAlert details={infoDetails} />
                    }
                    <Box style={{display: 'flex', justifyContent:"center",alignItems:"center"}} my={2}>
                        <Typography
                            ml={1}
                            variant="h3"
                            color={colors.grey[100]}
                            fontWeight="bold"
                        >
                            The
                        </Typography>
                        <Typography
                            variant="h3"
                            color={colors.greenAccent[500]}
                            fontWeight="bold"
                            ml={1}
                        >
                            Note
                        </Typography>
                    </Box>
                    <Divider/>
                    <Formik
                        onSubmit={handleSubmit}
                        initialValues={initialValueHandler}
                        validationSchema={checkoutSchema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    // mt={1}
                                    style={{ border: "0px solid" + colors.grey[theme.palette.mode == 'dark' ? 700 : 900]}}
                                    display="grid"
                                    gap="20px"
                                    gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                                    sx={{
                                        backgroundColor: colors.primary[500],
                                        padding: "10px",
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography fontWeight="bold" display="flex"  alignItems="center" variant="h4" color={colors.primaryhighlight[theme.palette.mode==='dark'?300:400]}>
                                            Sign In
                                        </Typography>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        label="Email*"
                                        onBlur={handleBlur}
                                        color="secondary"
                                        onChange={handleChange}
                                        value={values.email}
                                        name="email"
                                        error={!!touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IdentificationCard  weight="dualtone" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type={showPassword ? 'text' : 'password'}
                                        label="Password*"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.Password}
                                        color="secondary"
                                        name="password"
                                        error={!!touched.password && !!errors.password}
                                        helperText={touched.password && errors.password}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ShieldCheck weight="dualtone" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={togglePasswordVisibility}>
                                                        {showPassword ? <EyeSlash weight="dualtone" /> : <Eye weight="dualtone" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                        <Box display="flex" justifyContent="space-between" sx={{ gridColumn: "span 2" }}>
                                            <Box>
                                                <Typography
                                                        onClick={()=>handleNavigation('/signup')}
                                                        style={{ cursor:"pointer" }}
                                                        variant="caption"
                                                        fontSize="12px"
                                                        fontWeight="bold"
                                                        color={colors.grey[theme.palette.mode==='dark' ? 100:100]}
                                                    >
                                                    Create new account
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Button type="submit" color={theme.palette.mode === "dark"?"primaryhighlight2":"primaryhighlight2"} variant="contained" disableElevation>
                                                <Typography
                                                        variant="caption"
                                                        fontSize="12px"
                                                        fontWeight="bold"
                                                        color={colors.grey[theme.palette.mode==='dark' ? 100:900]}
                                                    >
                                                    Sign In
                                                </Typography>
                                            </Button>
                                            </Box>
                                    </Box>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            )}
        </Fragment>
    )

}


const emailInputRegExp = getRegex("email");
// const safeInputRegExp = /^[a-zA-Z0-9\s.,?!@#$%^&*()-_+=<>:;'"{}[\]|\\/]*$/;


const checkoutSchema = yup.object().shape({
    password: yup.string().required("Password is required"),
    email: yup.string().matches(emailInputRegExp,"").required("Email is required"),
});

const initialValueHandler = {
    password: "",
    email: ""
};

export default LoginComponent;