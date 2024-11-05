import { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider, useMediaQuery, useTheme, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// STORE
import { utilities } from "./store/slices/UtilitySlice";
import { dispatchAll } from './store/actions/GetActions';
// ASSETS
// GLOBAL
import Topbar from "./global/navigationBars/Topbar";
import NavDrawerForMobile from "./global/navigationBars/NavDrawerForMobile";
import NavDrawerForDesktop from "./global/navigationBars/NavDrawerForDesktop";
// PAGES
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import JoinProject from './pages/JoinProject';
import ProjectsPage from './pages/ProjectsPage';
// CRUD
import CreateProject from './components/crud/CreateProject';
// DETAILS
import ProjectItems from './components/items/ProjectItems';
import UserProfileDetails from './components/details/UserProfileDetails';
export default function App() {
  // STANDARDS
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [theme, colorMode] = useMode();
  const fullScreen = useMediaQuery(useTheme().breakpoints.up('md'));

  // STATE
  const user = useSelector((state) => state.user.user);
  const utility = useSelector((state) => state.utility);
  
  // VARIABLES
  const [settingUp, setSettingUp] = useState(true);

  // METHODS
  const isLoggedIn = () => {
    return user && user.authenticated && user._id;
  };
  

  // WATCHERS
  useEffect(() => {
    if (!isLoggedIn()) {
      dispatch(utilities());  
      if (location.pathname !== "/signup") {
        navigate("/login");
      }
    } else {
      if (settingUp) {
        dispatch(dispatchAll(utility.api, utility.config, "all"));
        setSettingUp(false);
        navigate("/");
      }
    }
  }, [user, settingUp, utility.api, utility.config, navigate, dispatch, location.pathname]);

  useEffect(() => {
    if (!utility || !utility.api) {
      dispatch(utilities());
    }
  }, [utility, dispatch]);

  // TEMPLATE
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isLoggedIn() ? (
          <div className="app">
            {fullScreen && <NavDrawerForDesktop />}
            {!fullScreen && <NavDrawerForMobile />}
            <main className="content">
              {isLoggedIn() && <Topbar />}
              <Box ml={fullScreen ? 8 : 7} mt={fullScreen ? 8 : 8}></Box>
              <Routes>
                {/* PAGES */}
                <Route path="/" element={<HomePage />} />
                <Route path="/join/project/:id" element={<JoinProject />} />
                <Route path="/projects" element={<ProjectsPage />} />
                {/* CRUD */}
                <Route path="/create/project" element={<CreateProject />} />
                {/* DETAILS */}
                <Route path="/project/details/:id" element={<ProjectItems />} />
                <Route path="/user/details" element={<UserProfileDetails />} />
              </Routes>
            </main>
          </div>
        ) : (
          <div className="app">
            <main className="content">
              <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </main>
          </div>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
