import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, useTheme,Typography,Divider} from "@mui/material";
import axios from "axios";
import { Trash,PencilSimple,FolderOpen,Database,SignOut } from "@phosphor-icons/react";
import { tokens} from "../../theme";
import InfoAlert from "../helpers/alerts/InfoAlert";
import DeleteAlert from "../helpers/alerts/DeleteAlert";
import CreateModals from "../modals/CreateModals";
import moment from 'moment'
import CreateProject from "../crud/CreateProject";
import { projects } from "../../store/actions/GetActions";
import TableTemplate from "./TableTemplate";
import Loader from "../helpers/loader/Loader";
import { useSocket } from "../../context/SocketContext";
import { currentProject } from "../../store/slices/UtilitySlice";

const ProjectsList = () => {
    // STANDARDS
    let navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch()

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
    const [msg, setMsg] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [infoDetails, setInfoDetails] = useState({});
    const [edit, setEdit] = useState(false);
    const [projectList, setProjectList] = useState([]);
    const [projectDetails, setProjectDetails] = useState({});
    const [projectToDelete, setProjectToDelete] = useState(null);
    const socketRef = useSocket();
    let columns = [
        { field: '_id', headerName: 'ID', minWidth: 50, flex: 1},
        { field: 'name', headerName: 'Project Name', minWidth: 50, flex: 0.6, },
        { field: 'description', headerName: 'Description', minWidth: 50, flex: 0.8, },
        { field: 'createdByName', headerName: 'Created By', minWidth: 50, flex: 0.5, },
        { field: 'createdAt', headerName: 'Created On', minWidth: 50, flex: 0.7, },
    ];
    {
        columns.push(
            {
                field: "action",
                flex: 1.2,
                minWidth: 80,
                headerName: "Actions",
                renderCell: (params) => {
                    const handEdit = () => {
                            setEdit(true)
                            setProjectDetails(params.row);
                    }
                    const handleAlertDialog = () => {
                        setProjectToDelete(params.row)
                        setMsg('Are you sure you want to delete "'+params.row.name+ '" Project?')
                        setShowAlert(true)

                    };
                    const handleDelete = async() => {
                        setIsLoading(false)
                        setShowAlert(false)
                        axios.post(utility.api + "projects/delete/project",{project_id:projectToDelete._id}, utility.config)
                            .then(response => {
                                if (response.data.status == "success") {
                                    setProjectToDelete(null)
                                    handleDeleteSuccess()
                                    if (socketRef && socketRef.current) { 
                                        socketRef.current.emit('delete-project',{projectId:selectedProject._id});
                                    }
                                    setInfoDetails({ msg: "Project deleted successfully", type: "success" })
                                    setShowInfoAlert(true)
                                } else {
                                    setShowInfoAlert(true)
                                    setInfoDetails({ msg: response.data.message, type: "error" })
                                }
                            }).catch(error => {
                                setShowInfoAlert(true)
                                setInfoDetails({ msg: error.message, type: "error" })
                            });
                    }
                    return (
                        <Fragment>
                            {showAlert &&
                                <DeleteAlert msg={msg} onDelete={handleDelete} onCancel={() => setShowAlert(false)} />
                            }
                            <Typography
                                px={1}
                                mr={1}
                                onClick={()=>navigate(`/project/details/${params.row._id}`)}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                variant="caption"
                                color={colors.grey[100]}
                                sx={{marginLeft:"2px",cursor:"pointer",borderRadius:"5px", border: "1px solid" + colors.grey[theme.palette.mode == 'dark' ? 700 : 900],}}
                                // fontWeight="bold"
                            >
                                View Details
                            </Typography>
                            {user && user.authenticated && user._id && user._id === params.row.createdById &&
                                <Typography
                                    px={1}
                                    mr={1}
                                    onClick={handEdit}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    variant="caption"
                                    color={colors.grey[100]}
                                    sx={{ cursor: "pointer", borderRadius: "5px", border: "1px solid" + colors.grey[theme.palette.mode == 'dark' ? 700 : 900], }}
                                // fontWeight="bold"
                                >
                                    Edit
                                    <PencilSimple style={{ cursor: "pointer", marginLeft: "10px" }} size={15} weight="duotone" color={colors.greenAccent[500]} />
                                </Typography>
                            }
                            {user && user.authenticated && user._id && user._id === params.row.createdById &&
                                <Trash onClick={handleAlertDialog} style={{ cursor: "pointer", marginLeft: "2px" }} size={15} weight="duotone" color={colors.greenAccent[500]} color={colors.redAccent[400]} />
                            }
                            {selectedProject && selectedProject._id && user && user.authenticated && user._id && user._id !== params.row.createdById &&
                                 <Typography
                                    px={1}
                                    mr={1}
                                    onClick={handleLeave}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    variant="caption"
                                    color={colors.grey[100]}
                                    sx={{ cursor: "pointer", borderRadius: "5px", border: "1px solid" + colors.grey[theme.palette.mode == 'dark' ? 700 : 900], }}
                                // fontWeight="bold"
                                >
                                    Leave
                                <SignOut onClick={handleAlertDialog} style={{ cursor: "pointer", marginLeft: "2px" }} size={15} weight="duotone" color={colors.greenAccent[500]} color={colors.redAccent[400]} />
                                </Typography>
                            }
                        </Fragment>
                    );
                },
            },
        );
    }

    // METHODS
    const handleDeleteSuccess = () => {
        dispatch(projects(utility.api, utility.config))
        getProjects()
    }
    const handleLeave = () => {
        setIsLoading(true)
        axios.post(utility.api + "projects/leave/project",{project_id:selectedProject._id},utility.config)
            .then(response => {
            if (response.data.status === 'success') {
                setIsLoading(false)
                if (socketRef && socketRef.current) { 
                    socketRef.current.emit('leave-project',{userId:user._id});
                }
                dispatch(currentProject(""))
                getProjects()
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
    const getProjects = () => {
        setIsLoading(true)
        setProjectList([])
        axios.get(utility.api + "projects/get/all/projects",utility.config)
            .then(response => {
            if (response.data.status === 'success') {
                setIsLoading(false)
                    let temp=[]
                    let dbData=response.data.projects
                    for (let i of dbData) {
                        temp.push(
                            {
                                _id: i._id,
                                name: i.name,
                                description: i.description,
                                createdById: i.createdById,
                                createdByName: user && user._id === i.createdById?"You":i.createdByName,
                                createdAt:moment(i.createdAt).format("DD-MM-YYYY HH:MM")
                            }
                            
                        )
                    }
                    setProjectList(temp)
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
    const handleClose = () => {
        setEdit(false)
        setProjectDetails(null)
    }
    const handleUpdate = () => {
        setProjectDetails(null)
        setEdit(false)
        getProjects()
    }

    // WATCHER
    useEffect(() => {
        getProjects()
        if (socketRef && socketRef.current) { 
            socketRef.current.on('delete-project', ()=>{getProjects()});
        }
        return () => {
            socketRef.current.off('switch-project');
        };
    }, [])

    // TEMPLATE
    return (
        <Fragment>
            {isLoading?(
                <Loader/>
            ):(
                <Box p={1}>
                    {showInfoAlert &&
                        <InfoAlert details={infoDetails} />
                    }
                {edit ? (
                    <Box>
                        {projectList && projectList.length > 0 && projectDetails && projectDetails._id &&
                            <CreateProject projectDetails={projectDetails} editMode={true}  onClose={handleClose} handleUpdate={handleUpdate} />
                        }
                    </Box>
                    ) : (
                        <>
                            <Box display="flex" justifyContent="space-between" >
                                <Typography
                                    display="flex"
                                    alignItems="center"
                                    variant="h5"
                                    color={colors.grey[100]}
                                    // fontWeight="bold"
                                >
                                    <FolderOpen style={{ marginRight:"10px"}} size={25} weight="duotone"/>
                                    Projects
                                </Typography>
                                <CreateModals buttonText="Create Project" navigateTo="/create/project"/>
                            </Box>      
                            {projectList && projectList.length > 0 ?
                                (
                                    <Box mt={1}>
                                      
                                        <TableTemplate rows={projectList} columns={columns} uniqueId={"_id"}/>
                                    </Box>
                                ) : (
                                    <Box pt={1}>
                                        <Divider/>
                                        <Box pt={2} display="flex" justifyContent="center" alignItems="center">
                                        <Typography
                                            display="flex"
                                            alignItems="center"
                                            ml={1}
                                            variant="h5"
                                            color={colors.grey[100]}
                                            fontWeight="bold"
                                        >
                                            <Database  style={{ marginRight:"10px"}} size={25} weight="duotone" color={colors.redAccent[500]}/>
                                            No Projects Created
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            )}
        </Fragment >
    )
}

export default ProjectsList;