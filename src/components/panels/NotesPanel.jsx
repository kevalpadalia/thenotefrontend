import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme, Box, Typography, Button } from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import { Database } from "@phosphor-icons/react";
import NoteCard from "../reusable/NoteCard";
import Loader from "../helpers/loader/Loader";
import ProjectSelector from "../helpers/forms/ProjectSelector";
import InfoAlert from "../helpers/alerts/InfoAlert";
import { useSocket } from "../../context/SocketContext";

const NotesPanel = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const utility = useSelector((state) => state?.utility || {});
    const user = useSelector((state) => state.user?.user || {});
    const currentProject = useSelector((state) => state.utility?.currentProject || {});

    const [infoDetails, setInfoDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [notes, setNotes] = useState([]);
    const socketRef = useSocket();

    const getNotes = async () => {
        if (currentProject?._id) {
            setIsLoading(true);
            try {
                const response = await axios.post(`${utility.api}notes/get/all/notes`, { project_id: currentProject._id }, utility.config);
                if (response.data.status === 'success') {
                    setNotes(response.data.notes);
                } else {
                    setShowInfoAlert(true);
                    setInfoDetails({ msg: response.data.message, type: "error" });
                }
            } catch (error) {
                setShowInfoAlert(true);
                setInfoDetails({ msg: error.message, type: "error" });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCreate = async () => {
        if (currentProject?._id) {
            setIsLoading(true);
            try {
                const response = await axios.post(`${utility.api}notes/create/note`, { project_id: currentProject._id }, utility.config);
                if (response.data.status === 'success') {
                    if (socketRef && socketRef.current) {
                        socketRef.current.emit("new-note", { projectId: currentProject._id });
                        getNotes();
                    }
                } else {
                    setShowInfoAlert(true);
                    setInfoDetails({ msg: response.data.message, type: "error" });
                }
            } catch (error) {
                setShowInfoAlert(true);
                setInfoDetails({ msg: error.message, type: "error" });
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (currentProject?._id && user?.authenticated && user?.loggedIn) {
            getNotes();
        }
    }, [currentProject]);

    useEffect(() => {
        if (socketRef && socketRef.current) {
            const handleNoteUpdate = ({ projectId }) => {
                setNotes([])
                if (projectId === currentProject._id) {
                    getNotes();
                }
            };
            socketRef.current.on("new-note-recieve", handleNoteUpdate);
            socketRef.current.on("disconnected", handleNoteUpdate);
            socketRef.current.on("delete-project", handleNoteUpdate);
            socketRef.current.on("leave-project", ({projectId,userId}) => {
                setNotes([])
                if (projectId === currentProject._id && userId===user._id) {
                    getNotes();
                }
            });

            return () => {
                socketRef.current.off("new-note-recieve", handleNoteUpdate);
                socketRef.current.off("disconnected", handleNoteUpdate);
                socketRef.current.off("delete-project", handleNoteUpdate);
                socketRef.current.off("leave-project", handleNoteUpdate);
            };
        }
    }, [socketRef, currentProject]);

    return (
        <Fragment>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    {showInfoAlert && <InfoAlert details={infoDetails} />}
                    <Box display="flex" justifyContent="space-between">
                        <ProjectSelector />
                        {currentProject?._id && (
                            <Button
                                style={{ margin: "5px" }}
                                onClick={handleCreate}
                                size="small"
                                color={theme.palette.mode === "dark" ? "primaryhighlight2" : "primaryhighlight2"}
                                variant="contained"
                                disableElevation
                            >
                                <Typography
                                    variant="caption"
                                    fontSize="12px"
                                    fontWeight="bold"
                                    color={colors.grey[theme.palette.mode === 'dark' ? 100 : 900]}
                                >
                                    Create Note
                                </Typography>
                            </Button>
                        )}
                    </Box>
                    {notes.length > 0 ? (
                        notes.map(note => (
                            <NoteCard key={note._id} noteData={note} onDelete={getNotes} />
                        ))
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
                                <Database style={{ marginRight: "10px" }} size={25} weight="duotone" color={colors.redAccent[500]} />
                                No Notes Created
                            </Typography>
                        </Box>
                    )}
                    {!currentProject?._id && (
                        <Box pt={2} display="flex" justifyContent="center" alignItems="center">
                            <Button
                                style={{ margin: "5px" }}
                                onClick={() => navigate('/create/project')}
                                size="small"
                                color={theme.palette.mode === "dark" ? "primaryhighlight2" : "primaryhighlight2"}
                                variant="outlined"
                                disableElevation
                            >
                                <Typography
                                    variant="caption"
                                    fontSize="12px"
                                    color={colors.grey[theme.palette.mode === 'dark' ? 100 : 100]}
                                >
                                    Start By Creating a New Project or Select From Existing One
                                </Typography>
                            </Button>
                        </Box>
                    )}
                </div>
            )}
        </Fragment>
    );
};

export default NotesPanel;
