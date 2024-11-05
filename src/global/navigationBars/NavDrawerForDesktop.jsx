import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import {House  } from '@phosphor-icons/react'; 
import { Box, CssBaseline, List, Divider, Typography,Stack ,Switch, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { tokens } from "../../theme"
import HomePageSidebar from './sideBarLists/homePageSidebar';
import ActiveUserList from '../../components/tables/ActiveUserList';
import logo from '../../assets/logo.webp';
let drawerWidth = 180;
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


const Item = ({ title, to, icon, selected, setSelected, isActive }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <ListItem key={title} disablePadding sx={{ display: 'block' }} onClick={() => setSelected(title)} >
            <Link to={to} style={{
                textDecoration: "none",
            }}>
                <ListItemButton
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                    }}
                    selected={isActive}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            color: isActive ? colors.primaryhighlight[theme.palette.mode==='dark'?300:400] : colors.grey[100]
                        }}
                    >
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={title} sx={{ color: isActive ? colors.primaryhighlight[theme.palette.mode==='dark'?300:400] : colors.grey[200], opacity: open ? 1 : 0}} />
                </ListItemButton>
            </Link>
        </ListItem>
    );
};

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        // width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
                ...openedMixin(theme),
                backgroundColor: tokens(theme.palette.mode).primary[500],
                color: tokens(theme.palette.mode).grey[100]
            },
            '& .Mui-selected': {
                // color: "#FFFF !important",
                backgroundColor: tokens(theme.palette.mode).primary[500],
                color: tokens(theme.palette.mode).grey[100]
            },
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
                ...closedMixin(theme),
                backgroundColor: tokens(theme.palette.mode).primary[500],
                color: tokens(theme.palette.mode).grey[100]
            },
            '& .Mui-selected': {
                // color: "#FFFF !important",
                backgroundColor: tokens(theme.palette.mode).primary[500],
                color: tokens(theme.palette.mode).grey[100],
            },
        }),
    }),
);


export default function MiniDrawer() {
    const theme = useTheme();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const colors = tokens(theme.palette.mode);
    const utility = useSelector((state) => {
        return state && state.utility ? state.utility : {}
    })
    const [open, setOpen] = useState(true);
    const [varient, setVarient] = useState('permanent');
    const [selected, setSelected] = useState("");
    const homePageMenu = HomePageSidebar();
    const toggleDrawer = () => {
        setOpen(!open)
    }   
    
    useEffect(() => {
  
    }, [utility])
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Drawer variant={varient} open={open}>
                <Box py={3.5}> </Box>
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