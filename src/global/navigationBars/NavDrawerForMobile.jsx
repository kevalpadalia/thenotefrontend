import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from "react-redux";
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import {House  } from '@phosphor-icons/react'; 
import { Box, CssBaseline, List,ListItem,Switch,Stack, ListItemButton, ListItemIcon, ListItemText, Typography,Divider } from "@mui/material";
import { tokens } from "../../theme";
import HomePageSidebar from './sideBarLists/homePageSidebar';
import logo from '../../assets/logo.webp';
import ActiveUserList from '../../components/tables/ActiveUserList';

let drawerWidth = 280;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));


const Item = ({ title, to, icon, selected, setSelected, isActive, onNavigate }) => {
  const theme = useTheme();
  const navigate = useNavigate()
  const colors = tokens(theme.palette.mode);
  const handleNavigation = (route) => {
    // setOpen(false)
    // navigate(route);
    onNavigate()
  };
  return (
    <ListItem key={title} disablePadding sx={{ display: 'block' }} onClick={() => setSelected(title)} >
      <Link to={to} style={{
        textDecoration: "none",
        color: colors.grey[100]
      }}>
        <ListItemButton
          onClick={() => handleNavigation(to)}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        // selected={isActive}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              color: isActive ? colors.primaryhighlight[theme.palette.mode==='dark'?300:400] : colors.grey[200]
            }}
          >
            {icon}
          </ListItemIcon>
          {/* {title} */}
          {/* <Typography color={colors.grey[100]} sx={{ opacity: open ? 1 : 0 }}>{title}</Typography> */}
          {/* <ListItemText primary={title} sx={{ color: isActive ? colors.primaryhighlight[200] : colors.grey[100], opacity: open ? 1 : 0 }} /> */}
          <ListItemText primary={title} sx={{ color: isActive ? colors.primaryhighlight[theme.palette.mode==='dark'?300:400] : colors.grey[200] }} />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};

export default function MiniDrawer() {
  const theme = useTheme();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const colors = tokens(theme.palette.mode);
  const utility = useSelector((state) => {
    return state && state.utility ? state.utility : {}
  })
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("");
  const toggleDrawer = () => {
    setOpen(!open)
  }
  useEffect(() => {
    toggleDrawer()
  }, [utility.navVarient]);

  const homePageMenu = HomePageSidebar();
  
  useEffect(() => {

}, [utility])
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer open={open}
        onClose={toggleDrawer}
        anchor="left"
        sx={{
              flexShrink: 0,
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
            ...openedMixin(theme),
            backgroundColor: theme.palette.mode == 'dark' ? colors.secondary[500] : colors.primary[500],
            color: colors.grey[100]
          },
        }}
      >
       <List
                    sx={{
                        overflowY: "auto", height: '100%',
                        '::-webkit-scrollbar': {
                            display: 'none',
                        },
                        '-ms-overflow-style': 'none',  // IE and Edge
                        'scrollbar-width': 'none',     // Firefox
                    }}
                >
                    <Divider />
                    {homePageMenu.menuList.map((item, index) => {
                        const isActive = location.pathname === item.to;
                        // if(homePageMenu.allowedPaths.includes(location.pathname)){
                            return (
                                <Item
                                    key={index}
                                    title={item.title}
                                    to={item.to}
                                    icon={item.icon}
                                    selected={selected}
                                    setSelected={setSelected}
                                    isActive={isActive}
                                />
                            );
                        // }
                    })}
                    <Divider />
                    <ActiveUserList/>
                </List>
      </Drawer>
    </Box >
  );
}