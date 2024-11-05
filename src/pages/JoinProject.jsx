import { Fragment,useState,useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams ,useNavigate} from "react-router-dom";
import axios from "axios";
import { currentProject } from "../store/slices/UtilitySlice";
import { useSocket } from "../context/SocketContext";
import InfoAlert from "../components/helpers/alerts/InfoAlert";
import Loader from "../components/helpers/loader/Loader";
const JoinProject = () => {
    // STANDARDS
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const id = useParams()
    const socketRef = useSocket();
    // STATE
    const utility = useSelector((state) => state?.utility || {});
    const user = useSelector((state) => {
        return state && state.user && state.user.user ? state.user.user : {}
    })
    // VARIABLES
    const [infoDetails, setInfoDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showInfoAlert, setShowInfoAlert] = useState(false);

    // METHODS
    
    const joinProject = async () => {
        setIsLoading(true)
        axios.post(utility.api + "projects/join/project",{project_id:id.id},utility.config)
            .then(response => {
            if (response.data.status === 'success') {
                setIsLoading(false)
                dispatch(currentProject(id.id))
                if (socketRef && socketRef.current) { 
                    socketRef.current.emit('join', { projectId: id.id, userName: user.name });
                }
                setShowInfoAlert(true)
                setInfoDetails({ msg:"You have successfully joined the project", type: "success" })
            } else {
                setIsLoading(false)
                setShowInfoAlert(true)
                setInfoDetails({ msg: response.data.message, type: "error" })
            }
            navigate('/')
        }).catch(error => {
            setIsLoading(false)
            setShowInfoAlert(true)
            setInfoDetails({ msg: error.message, type: "error" })
            navigate('/')
        });
    }
    // WATHCERS
    useEffect(() => {
        if (user && user.authenticated && user._id && user.loggedIn) {
            joinProject()
        }
    }, [id])
    // TEMPLATES
    return (
        <Fragment>
            {isLoading ? (
                <Loader />
            ) : (
                    <>
                        {showInfoAlert && <InfoAlert details={infoDetails} />}
                    </>
            )}
        </Fragment>
    )
}

export default JoinProject;