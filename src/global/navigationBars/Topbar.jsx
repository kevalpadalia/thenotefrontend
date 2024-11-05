import { Fragment,useState,useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, useTheme,useMediaQuery, AppBar, Toolbar } from "@mui/material";
import { tokens, ColorModeContext } from "../../theme";
import {List,Moon,Sun,ShareNetwork } from "@phosphor-icons/react";
import { varient } from "../../store/slices/UtilitySlice";
import Loader from "../../components/helpers/loader/Loader";
import AccountsMenu from "../AccountsMenu";
import InfoAlert from "../../components/helpers/alerts/InfoAlert";

const Topbar = () => {
  // STANDARDS
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const fullScreen = useMediaQuery(useTheme().breakpoints.up('md'));

  // STATE
  const utility = useSelector((state) => {
    return state && state.utility ? state.utility : {}
  })
  const currentProject=useSelector((state) => state && state.utility && state.utility.currentProject && state.utility.currentProject._id?state.utility.currentProject : {});
  // VARIABLES
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [infoDetails, setInfoDetails] = useState({});
  // METHODS
  const copyToClipboard = () => {
    let url = `http://localhost:5174/join/project/${currentProject._id}`
    navigator.clipboard.writeText(url)
      .then(() => {
          setShowInfoAlert(true)
          setInfoDetails({ msg: "The invite link has been successfully copied to your clipboard. Share it with your friends to begin collaborating!", type: "success" })
      })
      .catch((error) => {
          console.error("Failed to copy link:", error);
      });
  }

  const handleNavigation = (route) => {
    navigate(route);
  };

  const toggleNavBar = () => {
    let navVarient = utility.navVarient;
    navVarient = !navVarient;
    let payload = { 'navVarient': navVarient };
    dispatch(varient(payload));
  };
  // TEMPLATE
  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
          <Box sx={{ display: 'flex' }}>
          {showInfoAlert && <InfoAlert details={infoDetails} />}
          <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: colors.primary[500], borderBottom: '1px solid' + colors.grey[theme.palette.mode === 'dark' ? 700 : 900] }}>
            <Toolbar style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box display="flex" justifyContent="center" alignItems="center">
                {!fullScreen && (
                  <IconButton
                    aria-label="open drawer"
                    onClick={toggleNavBar}
                  >
                    <List size={25} weight="duotone"  />
                  </IconButton>
                )}
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
              </Box>
                <Box display="flex" alignItems="center">
                  {currentProject && currentProject._id &&
                    <Box>
                      <Typography
                        px={1.5}
                        py={0.5}
                        mr={2}
                        display="flex"
                        alignItems="center" 
                        onClick={copyToClipboard}
                        variant="body2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        style={{
                          borderRadius: "5px",
                          cursor: "pointer",
                          backgroundColor:colors.secondary[500]
                          // border: `1px solid ${colors.grey[theme.palette.mode === 'dark' ? 700 : 800]}`,
                        }}
                        ml={1}
                      >
                        <ShareNetwork size={20} weight="duotone" style={{ marginRight: "10px" }} />
                        Invite
                      </Typography>
                    </Box>
                  }
                <Box sx={{cursor:"pointer"}} mr={1} display="flex" alignItems="center" onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <Moon size={25} weight="duotone" />
                    ) : (
                        <Sun size={25} weight="duotone"  />
                    )}
                </Box>
                <Box alignItems="center">
                  <AccountsMenu/>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </Fragment>
  );
};

export default Topbar;
