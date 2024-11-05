import { Fragment,useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate,useParams } from 'react-router-dom';
import { Box,Grid,Typography, useTheme,Button } from "@mui/material";
import axios from "axios";
import { UsersThree,ArrowFatLeft } from "@phosphor-icons/react";
import { tokens } from "../../theme";
import InfoAlert from "../helpers/alerts/InfoAlert";
import Loader from "../helpers/loader/Loader";
import TableTemplate from "../tables/TableTemplate";

const ProjectItems = () => {
    // STANDARDS
    let navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // STATE
    const utility = useSelector((state) => {
        return state && state.utility ? state.utility : {}
    })
    // VARIABLES
    const id=useParams()
    const [infoDetails, setInfoDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [projectDetails, setprojectDetails] = useState({});
    const [projectMembers, setProjectMembers] = useState([]);
    let columns = [
        { field: 'userId', headerName: 'ID', minWidth: 50, flex: 1},
        { field: 'userName', headerName: 'Name', minWidth: 50, flex: 0.6, },
        // { field: 'accessList', headerName: 'Access', minWidth: 50, flex: 0.8, }
    ];

    // METHODS
    const getProjectDetals=async()=>{
        setIsLoading(true)
        axios.post(utility.api + "projects/get/project/details",{project_id:id},utility.config)
        .then(response => {
            if (response.data.status === 'success') {
                setIsLoading(false)
                setprojectDetails(response.data.detail)
                setProjectMembers(response.data.detail["members"])
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
    // WATEHER
    useEffect(() => {
        getProjectDetals()
    }, [id])
    // TEMPLATES
    return (
        <Fragment>
            {isLoading?(
                <Loader/>
            ):(
            <>
            {showInfoAlert &&
                <InfoAlert details={infoDetails} />
            }
            <Box mx={1} mb={1} pt={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <Typography display="flex" alignItems="center"  fontWeight="bold" variant="h5" color={colors.grey[100]}>
                    {/* <UserCircle style={{ marginRight:"10px"}} size={iconHelper.size} weight={iconHelper.dualtone} /> */}
                    Project Details
                </Typography>
                <Button
                    onClick={() => navigate("/projects")} color="accent" variant="text" disableElevation size="small">
                    <ArrowFatLeft size={25} weight="duotone" />
                    <Typography variant="caption" sx={{ color: colors.grey[100], marginLeft: "5px" }}>Back</Typography>
                </Button>
            </Box>
            <Box mt={1} mx={1}>
                <Grid container
                        sx={{
                            backgroundColor:colors.secondary[500],
                        borderRadius: "5px",
                        borderTop: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                        borderLeft: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Grid
                            item
                            xs={12}
                            sm={12}
                            sx={{
                                padding:"10px",
                                borderRight: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                borderBottom: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <Typography
                                variant="caption"
                                color={colors.grey[100]}
                                display='flex'
                                alignItems='center'
                                sx={{paddingBottom:"5px"}}
                            >
                                ID
                            </Typography>
                            <Typography
                                variant="h5"
                                color={colors.grey[100]}
                                fontWeight="bold"
                            >
                                {projectDetails._id}
                            </Typography>
                        </Grid>
                        <Grid
                                item
                                xs={12}
                                sm={12}
                                sx={{
                                    padding:"10px",
                                    borderRight: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                    borderBottom: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color={colors.grey[100]}
                                    display='flex'
                                    alignItems='center'
                                    sx={{paddingBottom:"5px"}}
                                >
                                    Name
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                >
                                    {projectDetails.name}
                                </Typography>
                            </Grid>
                        <Grid
                                item
                                xs={12}
                                sm={12}
                                sx={{
                                    padding:"10px",
                                    borderRight: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                    borderBottom: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color={colors.grey[100]}
                                    display='flex'
                                    alignItems='center'
                                    sx={{paddingBottom:"5px"}}
                                >
                                    Description
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                >
                                    {projectDetails.description}
                                </Typography>
                            </Grid>
                        <Grid
                                item
                                xs={12}
                                sm={12}
                                sx={{
                                    padding:"10px",
                                    borderRight: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                    borderBottom: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color={colors.grey[100]}
                                    display='flex'
                                    alignItems='center'
                                    sx={{paddingBottom:"5px"}}
                                >
                                    Created By
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                >
                                    {projectDetails.createdByName}
                                </Typography>
                            </Grid>
                            <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    sx={{
                                        padding:"10px",
                                        borderRight: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                        borderBottom: "1px solid" + colors.grey[theme.palette.mode === 'dark' ? 700 : 900],
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        color={colors.grey[100]}
                                        display='flex'
                                        alignItems='center'
                                        sx={{paddingBottom:"5px"}}
                                    >
                                        Created At
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color={colors.grey[100]}
                                        fontWeight="bold"
                                    >
                                        {projectDetails.createdAt}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        {projectMembers && projectMembers.length > 0 ?
                            (
                                <Box  m={1}>
                                    <Box pb={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                        <Typography display="flex" alignItems="center" fontWeight="bold"  variant="h5" color={colors.grey[100]}>
                                           <UsersThree  style={{ marginRight:"10px"}} size={25} weight="duotone"/>
                                            Team Memebers
                                        </Typography>
                                    </Box>
                                    <TableTemplate rows={projectMembers} columns={columns} uniqueId={"userId"} />
                                </Box>
                                
                            ) : (
                                <Box pt={2} display="flex" justifyContent="center" alignItems="center">
                                    <Typography
                                        display="flex"
                                        alignItems="center"
                                        ml={1}
                                        variant="h5"
                                        color={colors.grey[100]}
                                        fontWeight="bold"
                                    >
                                        <UsersThree  style={{ marginRight:"10px"}} size={25} weight="duotone" color={colors.redAccent[500]}/>
                                        No Team members
                                    </Typography>
                                </Box>
                            )
                        }
                    </>
                )
            }
        </Fragment>
    )
}

export default ProjectItems;