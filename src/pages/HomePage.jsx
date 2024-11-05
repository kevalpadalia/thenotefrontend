import { Fragment,useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import NotesPanel from "../components/panels/NotesPanel";

const HomePage = () => {
    // STANDARDS
    const navigate=useNavigate()

    // STATE
    const user = useSelector((state) => state.user.user);
    
    // VARIABLES
    
    // METHODS
    
    // WATHCERS
    useEffect(() => {
        if (!(user && user.authenticated && user.loggedIn && user._id)) {
       navigate('/login')
   } 
},[])
    // TEMPLATES
    return (
        <Fragment>
            <NotesPanel/>
        </Fragment>
    )
}

export default HomePage;