import { Fragment, useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Box, Menu, MenuItem, Divider, Typography, useTheme,Avatar } from "@mui/material";
import {CaretDown } from "@phosphor-icons/react";
import axios from "axios";
import { tokens } from "../../../theme";
import Loader from "../../../components/helpers/loader/Loader";
import InfoAlert from "../alerts/InfoAlert";
import { currentProject } from "../../../store/slices/UtilitySlice";
import CreateModals from "../../modals/CreateModals";
import { useSocket } from "../../../context/SocketContext";

const ProjectSelector = () => {
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
    const selectedProject=useSelector((state) => state && state.utility && state.utility.currentProject && state.utility.currentProject._id?state.utility.currentProject : {});
    // VARIABLES
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
   const [infoDetails, setInfoDetails] = useState({});
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [projects, setProjects] = useState([]);
    const socketRef = useSocket();
    // METHODS
    const handleNavigation=(route)=>{
        setAnchorEl(null)
        navigate(route)
    }
    const getProjects = () => {
        setIsLoading(true)
        axios.get(utility.api + "projects/get/all/projects", utility.config)
        .then(response => {
            if (response.status === 200) {
                setProjects(response.data.projects)
            } else {
                setShowInfoAlert(true)
                setInfoDetails({ msg: response.data.message, type: "error" })
            }
            setIsLoading(false)
        }).catch(error => {
            setIsLoading(false)
             setShowInfoAlert(true)
            setInfoDetails({ msg: error.message, type: "error" })
        });
        setIsLoading(false)
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSetProject = (value) => {
        if (socketRef && socketRef.current) { 
            socketRef.current.emit('switch-project');
        }
        dispatch(currentProject(value))
    }

    // WATHCERS
    useEffect(() => {
        getProjects()
        if (socketRef && socketRef.current) { 
            socketRef.current.on('delete-project', ()=>{dispatch(currentProject(""))});
        }
        return () => {
            socketRef.current.off('switch-project');
            socketRef.current.off('delete-project');
        };
    }, [socketRef])
    // TEMPLATES
    return (
        <Fragment>
            {isLoading ?(
                <Loader/>
            ):(
                    <Box display="flex" pl={1}>
                    {showInfoAlert &&
                        <InfoAlert details={infoDetails} />
                    }
                    <Box px={1} py={0.5} mt={1} display="flex" alignItems="center" onClick={handleMenuOpen}  sx={{ backgroundColor:colors.secondary[500],cursor:"pointer",borderRadius: '5px' }}  >
                        <Typography
                            display="flex"
                            variant="body2"
                            alignItems="center"
                            color={colors.grey[100]}
                        >
                            {selectedProject && selectedProject && selectedProject._id?selectedProject.name:"Select Project"}
                            <CaretDown size={20} weight={"duotone"} style={{marginLeft:"5px"}}/>
                        </Typography>
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
                                    Projects
                                </Typography>
                            </Box>
                        }
                            <Divider />
                            {projects && projects.length > 0 ? (
                                <>
                                    {projects.  map(item => (
                                        <MenuItem key={item._id} onClick={() => handleSetProject(item)}><Typography size={25} color={colors.grey[100]} sx={{ ml: "10px" }} >{item.name}</Typography ></MenuItem>
                                    ))}
                                </>
                            ) : (
                                    <Box p={1}><CreateModals buttonText={"Create New Project"} navigateTo={'/create/project'} /></Box>
                            )}
                    </Menu>
                </Box>
            )}
        </Fragment>
    )
}

export default ProjectSelector;