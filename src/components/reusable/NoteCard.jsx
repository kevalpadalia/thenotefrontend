import { Fragment, useRef, useEffect, useState } from "react";
import { Box,Typography,useTheme,Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { tokens } from "../../theme";
import { setNewOffset, autoHeightAdjust, setZIndex } from "../../utilities/DragDropUtilities";
import axios from "axios";
import {ClockCounterClockwise,SpinnerGap,Trash,Clock} from "@phosphor-icons/react";
import debounce from "lodash.debounce";
import { useSocket } from "../../context/SocketContext";
import DeleteAlert from "../helpers/alerts/DeleteAlert";
import moment from "moment"

const NoteCard = ({ noteData, onDelete, }) => {
    // STANDARDS
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // VARIABLE
    const noteBody = noteData.description;
    const noteHeading = noteData.heading;
    const [cardPosition, setCardPosition] = useState(JSON.parse(noteData.position));
    const cardColors = JSON.parse(noteData.colors);
    const textAreaRef = useRef(null);
    const mouseStartPosition = useRef({ x: 0, y: 0 });
    const noteCardRef = useRef(null);
    const timer = useRef(null)
    const [showAlert, setShowAlert] = useState(false);
    const [infoDetails, setInfoDetails] = useState({});
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [changedBy, setChangedBy] = useState("");
    const socketRef = useSocket();

    // STATE
    const utility = useSelector((state) => state?.utility || {});
    const currentProject = useSelector(
        (state) => state?.utility?.currentProject?._id ? state.utility.currentProject : {}
    );
    const user = useSelector((state) => {
        return state && state.user && state.user.user ? state.user.user : {}
    }) 

    // METHODS
    // Debounced function for updating note position
    const debouncedUpdatePosition = debounce((position) => {
        if (socketRef && socketRef.current) {
            socketRef.current.emit("position-change", {
                projectId: currentProject._id,
                newPosition: position,
                noteId: noteData._id,
                userName: user.name,
                userId:user._id
            })
        }
        axios
            .post(
                `${utility.api}notes/update/note/position`,
                {
                    project_id: currentProject._id,
                    new_position: JSON.stringify(position),
                    note_id: noteData._id,
                },
                utility.config
            )
            .then((response) => {
                if (response.data.status === "success") {
                } else {
                    setShowInfoAlert(true);
                    setInfoDetails({ msg: response.data.message, type: "error" });
                }
            })
            .catch((error) => {
                setShowInfoAlert(true);
                setInfoDetails({ msg: error.message, type: "error" });
            });
    }, 1000);

    const saveContent = (e) => {
        setUpdating(true)
        if (socketRef && socketRef.current) {
            socketRef.current.emit("content-change", {
                projectId: currentProject._id,
                content: textAreaRef.current.value,
                noteId: noteData._id,
                userName:user.name
            })
        }
        if (timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(async() => {
            try {
                await  axios
                    .post(
                        `${utility.api}notes/update/note/content`,
                        {
                            project_id: currentProject._id,
                            description: textAreaRef.current.value,
                            note_id: noteData._id,
                        },
                        utility.config
                    )
            } catch (error) {
                console.log(error)
            }
            setUpdating(false)
        },2000)
    }
    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
        const newPosition = setNewOffset(noteCardRef.current);
        saveContent()
        debouncedUpdatePosition(newPosition);
    };

    const mouseDown = (e) => {
        mouseStartPosition.current.x = e.clientX;
        mouseStartPosition.current.y = e.clientY;

        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);

        setZIndex(noteCardRef.current);
    };

    const mouseMove = (e) => {
        const mouseMoveDirection = {
            x: mouseStartPosition.current.x - e.clientX,
            y: mouseStartPosition.current.y - e.clientY,
        };

        mouseStartPosition.current.x = e.clientX;
        mouseStartPosition.current.y = e.clientY;

        const newPosition = setNewOffset(noteCardRef.current, mouseMoveDirection);
        setCardPosition(newPosition);
    };

    const handleDelete = () => {
        axios
            .post(
                `${utility.api}notes/delete/note`,
                {
                    project_id: currentProject._id,
                    note_id: noteData._id,
                },
                utility.config
            )
            .then((response) => {
                if (response.data.status === "success") {
                    if (socketRef && socketRef.current) {
                            socketRef.current.emit("note-delete", {
                                projectId: currentProject._id
                            })
                        }
                    onDelete()
                } else {
                    setShowInfoAlert(true);
                    setInfoDetails({ msg: response.data.message, type: "error" });
                }
            })
            .catch((error) => {
                setShowInfoAlert(true);
                setInfoDetails({ msg: error.message, type: "error" });
            });
    }

    useEffect(() => {
        autoHeightAdjust(textAreaRef);
        if (socketRef && socketRef.current) {
            socketRef.current.on("content-change-recieve", ({ projectId, content, noteId,userName }) => {
                if (textAreaRef.current && content !== null && noteId === noteData._id) {
                    setChangedBy(userName)
                    textAreaRef.current.value = content;
                }
            });
            socketRef.current.on("position-change-recieve", ({ projectId, newPosition, noteId, userName,userId }) => {
                if (userId && user && user._id && user._id !== userId && newPosition && noteData._id ===noteId) {
                    setCardPosition(newPosition);
                    setChangedBy(userName)
                }
            })
            socketRef.current.on("on-note-delete", ({ projectId}) => {
                if (projectId) {
                    onDelete()
                }
            })
            socketRef.current.on("new-note-recieve", ({ projectId}) => {
                if (projectId) {
                    onDelete()
                }
            })
            // socketRef.current.on("delete-project", ({ projectId}) => {
            //     if (projectId) {
            //         onDelete()
            //     }
            // })
    }

    return () => {
        if (socketRef && socketRef.current) {
            socketRef.current.off("content-change");
            socketRef.current.off("content-change-recieve");
            socketRef.current.off("position-change");
            socketRef.current.off("position-change-recieve");
            socketRef.current.off("on-note-delete");
            socketRef.current.off("note-delete");
            socketRef.current.off("delete-project");
        }
    };
}, [socketRef]);

    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
            debouncedUpdatePosition.cancel();
        };
    }, []);

    return (
        <Fragment>
            {showAlert &&
                <DeleteAlert msg={"Are you sure you want to delete this note?"} onDelete={handleDelete} onCancel={() => setShowAlert(false)} />
            }
            <Box
                ref={noteCardRef}
                className="note-card"
                style={{
                    left: `${cardPosition.x}px`,
                    top: `${cardPosition.y}px`,
                    backgroundColor: cardColors.colorBody,
                }}
            >
                                        {/* <Typography
                            display="flex"
                            onKeyUp={()=>saveContent()}
                            alignItems="center"
                            ml={1}
                            variant="h5"
                            color="#000000"
                            fontWeight="bold"
                        >
                            
                            {noteData.heading}
                        </Typography> */}
                <Box
                    display="flex"
                    onMouseDown={mouseDown} 
                    justifyContent="space-between"
                    className="note-card-heading"
                    style={{ backgroundColor: cardColors.colorHeader }}
                >
                 <Box display="flex" alignItems="center" minWidth="50px">
                        <Avatar
                            sx={{
                                cursor: "pointer",
                                width: 25,
                                height: 25,
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: colors.grey[theme.palette.mode === 'dark' ? 100 : 1000],
                                bgcolor: theme.palette.mode === "dark" ? colors.primaryhighlight[400] : colors.primaryhighlight[300]
                            }}
                        >
                            {noteData.createdByName ? noteData.createdByName.charAt(0) : ""}
                        </Avatar>
                        <span style={{fontWeight:"bold" ,marginLeft:"5px", color:"#000000"}}>{noteData.createdByName}</span>
                    </Box>
                    {updating ? (
                        <Box px={2} display="flex" justifyContent="start" alignItems="center">
                        <SpinnerGap style={{ marginRight: "10px" }} color="#000000" size={25} weight="duotone" />
                        <span style={{ color: "#000000" }}>Syncing changes...</span>
                        </Box>
                    ) : (
                        <Box px={1} display="flex" justifyContent="start" alignItems="center" >
                            <Clock style={{ marginRight: "10px" }} color="#000000" size={25} weight="duotone" />
                            <span style={{color:"#000000"}}>
                                {moment(noteData.createdAt).format("DD-MM-YYYY HH:MM")}
                            </span>
                        </Box>
                        // <Box cursor="pointer" onClick={() => setShowAlert(true)} display="flex" justifyContent="start" alignItems="center">
                        // <Trash style={{ marginRight: "10px" }} size={25} weight="duotone" color={colors.redAccent[500]} />
                        // </Box>
                    )}
                </Box>
                <Box className="note-card-body">
                    <textarea
                        ref={textAreaRef}
                        style={{ color: cardColors.colorText }}
                        defaultValue={noteBody}
                        onKeyUp={saveContent}
                        onInput={() => {
                            autoHeightAdjust(textAreaRef);
                        }}
                        onFocus={() => {
                            setZIndex(noteCardRef.current);
                        }}
                    ></textarea>
                </Box>
                <Box display="flex" justifyContent="space-between" p={1} className="note-card-footer" style={{ backgroundColor: cardColors.colorHeader }}>
                    <Box cursor="pointer" onClick={() => setShowAlert(true)} display="flex" justifyContent="start" alignItems="center">
                        <Trash style={{ marginRight: "10px" }} size={25} weight="duotone" color={colors.redAccent[500]} />
                    </Box>
                    {user && user.authenticated && user.loggedIn && user._id && changedBy && user.name !== changedBy &&
                        <Box px={1} display="flex" justifyContent="start" alignItems="center" >
                            <ClockCounterClockwise style={{ marginRight: "10px" }} color="#000000" size={25} weight="duotone" />
                            <span style={{color:"#000000"}}>
                                {`Last updated By ${changedBy}`}
                            </span>
                        </Box>
                    }
                </Box>
            </Box>
        </Fragment>
    );
};

export default NoteCard;
