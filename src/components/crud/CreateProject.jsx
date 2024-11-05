import { Fragment, useState,useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import {useNavigate} from 'react-router-dom';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Button, TextField, useTheme,Typography, Grid} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { ArrowFatLeft } from "@phosphor-icons/react";
import axios from "axios";
import { tokens } from "../../theme";
import { projects } from "../../store/actions/GetActions";
import Loader from "../helpers/loader/Loader";
import InfoAlert from "../helpers/alerts/InfoAlert";
import { getRegex, getRegexError } from "../../utilities/regexUtilities";

const CreateProject = ({projectDetails,editMode,onClose,handleUpdate}) => {
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

    // VARIABLES
    const [isLoading, setIsLoading] = useState(false);
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [infoDetails, setInfoDetails] = useState({});
    const [title, setTitle] = useState(editMode && projectDetails && projectDetails._id?"Update Project":"Create New Project");
    const [api, setApi] = useState(editMode && projectDetails && projectDetails._id?"projects/update/project":"projects/create/project");
    // METHODS
    const handleNavigation = (route) => {
        navigate(route);
    };
    const handleSubmit = async (values) => {
        setIsLoading(true)
        let payload = null
        if(editMode && projectDetails && projectDetails._id){
            payload = {
                project_id: projectDetails._id,
                description: values.msg,
                name: values.name,
            }
        }else{ 
            payload = {
                description: values.msg,
                name: values.name,
            }
        }
        axios.post(utility.api + api, payload, utility.config)
        .then(response => {
            if (response.data.status === 'success') {
                setIsLoading(false)
                dispatch(projects(utility.api,utility.config))
                if(editMode && projectDetails && projectDetails._id){
                    handleUpdate()
                } else {
                    navigate('/projects')
                }
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

    // WATCHERS
    useEffect(() => {
    }, []);
    return (
        <Fragment>
            {isLoading ? (
                <Loader/>
            ) : (
                <Box
                sx={{paddingTop:"1px"}}
                >
                    {showInfoAlert &&
                        <InfoAlert details={infoDetails} />
                    }
                    <Box display="flex" justifyContent="center" alignItems="center" px={2} pt={2}>
                        <Typography
                            variant={isNonMobile?"h4":"body1"}
                            color={colors.grey[100]}
                            fontWeight="bold"
                            textAlign="center"
                        >
                            {title} 
                        </Typography>
                    </Box>
                    <Grid container
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Grid item xs={12} sm={8} >
                            <Box>
                                <Formik
                                    onSubmit={handleSubmit}
                                    initialValues={initialValueHandler(projectDetails)}
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
                                                display="grid"
                                                gap="17px"
                                                gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                                                sx={{
                                                    backgroundColor: colors.primary[500],
                                                    padding: "10px",
                                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                                }}
                                            >
                                                <Box>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        type="text"
                                                        label="Name*"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        value={values.name}
                                                        color="secondary"
                                                        name="name"
                                                        error={!!touched.name && !!errors.name}
                                                        helperText={touched.name && errors.name}
                                                        InputProps={{
                                                        }}
                                                        sx={{ gridColumn: "span 2" }}
                                                    />
                                                </Box>
                                                <Box>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        type="text"
                                                        label="Description (Optional)"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        value={values.msg}
                                                        multiline
                                                        name="msg"
                                                        color="secondary"
                                                        error={!!touched.msg && !!errors.msg}
                                                        helperText={touched.msg && errors.msg}
                                                        sx={{ gridColumn: "span 2" }}
                                                    />
                                                </Box>
                                                <Box display="flex" justifyContent="end">
                                                    <Button onClick={() => {
                                                        if(editMode && projectDetails && projectDetails._id){
                                                            onClose()
                                                        }else{
                                                            handleNavigation('/projects')
                                                        }

                                                    }} color="accent" variant="text" disableElevation size="small"><ArrowFatLeft size={25} weight="duotone" /><Typography variant="caption" sx={{ color: colors.grey[100], marginLeft: "5px" }}>Back</Typography></Button>
                                                    <Button style={{ marginLeft: "5px" }} type="submit" color={theme.palette.mode == 'dark' ? "primaryhighlight2" : "primaryhighlight2"} variant="contained" disableElevation>
                                                            <Typography variant="caption" sx={{ color: colors.grey[theme.palette.mode === 'dark' ? 100 : 900] }}>{editMode && projectDetails && projectDetails._id?"Update":"Create"}</Typography>
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </form>
                                    )}
                                </Formik>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )
            }
        </Fragment >
    )
}
const safeInputRegExp = getRegex("safeInputs");

const checkoutSchema = yup.object().shape({
    name: yup.string()
        .matches(safeInputRegExp, getRegexError("safeInputs"))
        .max(100, "Name should not be more than 100 characters")
        .required("Name is required"),
    msg: yup.string()
        .matches(safeInputRegExp, getRegexError("safeInputs"))
        .max(200, "Description should not be more than 100 characters"),
});

const initialValueHandler = (values) => {
    let initialValues = {}
    if (values) {
        initialValues = {
            msg: values.description,
            name: values.name,
        }
    } else {
        initialValues = {
            msg: "",
            name: "",
        }
    }
    return initialValues
};

export default CreateProject;