import { useState } from 'react';

import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';

import MuiDrawer from '@mui/material/Drawer';

import MuiAppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';

import List from '@mui/material/List';

import CssBaseline from '@mui/material/CssBaseline';

import Divider from '@mui/material/Divider';

import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import ListItem from '@mui/material/ListItem';

import ListItemButton from '@mui/material/ListItemButton';

import ListItemIcon from '@mui/material/ListItemIcon';

import ListItemText from '@mui/material/ListItemText';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

import Typography from '@mui/material/Typography';

import Avatar from '@mui/material/Avatar';

import { useAuth } from "../../../hooks/useAuth"




const menuItems = [

    {

        text: "Dashboard", path: "/dashboard", icon: <DashboardOutlinedIcon />

    },

    {

        text: "Expenses", path: "/dashboard/expenses", icon: <AttachMoneyOutlinedIcon />

    },

    {

        text: "Budgets", path: "/dashboard/budgets", icon: <AccountBalanceWalletOutlinedIcon />

    },

    {

        text: "Goals", path: "/dashboard/goals", icon: <FlagOutlinedIcon />

    },

]




const drawerWidth = 240;




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

    // necessary for content to be below app bar

    ...theme.mixins.toolbar,

}));




const AppBar = styled(MuiAppBar, {

    shouldForwardProp: (prop) => prop !== 'open',

})(({ theme }) => ({

    zIndex: theme.zIndex.drawer + 1,

    transition: theme.transitions.create(['width', 'margin'], {

        easing: theme.transitions.easing.sharp,

        duration: theme.transitions.duration.leavingScreen,

    }),

    variants: [

        {

            props: ({ open }) => open,

            style: {

                marginLeft: drawerWidth,

                width: `calc(100% - ${drawerWidth}px)`,

                transition: theme.transitions.create(['width', 'margin'], {

                    easing: theme.transitions.easing.sharp,

                    duration: theme.transitions.duration.enteringScreen,

                }),

            },

        },

    ],

}));




const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(

    ({ theme }) => ({

        width: drawerWidth,

        flexShrink: 0,

        whiteSpace: 'nowrap',

        boxSizing: 'border-box',

        variants: [

            {

                props: ({ open }) => open,

                style: {

                    ...openedMixin(theme),

                    '& .MuiDrawer-paper': openedMixin(theme),

                },

            },

            {

                props: ({ open }) => !open,

                style: {

                    ...closedMixin(theme),

                    '& .MuiDrawer-paper': closedMixin(theme),

                },

            },

        ],

    }),

);




export default function Layout() {

    const theme = useTheme();

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const location = useLocation();

    const { logout } = useAuth();

    const { user } = useAuth();

    const username = user?.email.split("@", 1)[0];




    const handleDrawerOpen = () => {

        setOpen(true);

    };




    const handleDrawerClose = () => {

        setOpen(false);

    };




    const handleNavigate = (linkName) => {

        if (linkName === "Dashboard") {

            navigate("/dashboard", {

                replace: true

            })

            return;

        };

        navigate(linkName.toLowerCase());

    }





    return (

        <Box sx={{ display: 'flex' }} >

            <CssBaseline />

            <AppBar position="fixed" open={open} className='shadow-none border bg-white'>

                <Toolbar className='text-black'>

                    <IconButton

                        color="inherit"

                        aria-label="open drawer"

                        onClick={handleDrawerOpen}

                        edge="start"

                        sx={[

                            {

                                marginRight: 5,

                            },

                            open && { display: 'none' },

                        ]}

                    >

                        <MenuIcon />

                    </IconButton>

                    <Typography variant="h6" noWrap component="div" onClick={() => navigate("/")}>

                        Wealthwise

                    </Typography>

                </Toolbar>

            </AppBar>

            <Drawer variant="permanent" open={open} >

                <DrawerHeader className='d-flex'>

                    <IconButton onClick={handleDrawerClose}>

                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}

                    </IconButton>

                </DrawerHeader>




                <Box

                    sx={{

                        display: "flex",

                        flexDirection: "column",

                        height: "100%",

                        justifyContent: "space-between"

                    }}

                >

                    <Box>

                        <Divider />

                        <List>

                            {menuItems.map((item, index) => (

                                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>

                                    <ListItemButton

                                        sx={{

                                            minHeight: 48,

                                            px: 2.5,

                                            justifyContent: open ? 'initial' : 'center',

                                        }}

                                        onClick={() => handleNavigate(item.text)}

                                        className={`${location.pathname === item.path ? 'text-primary' : ''}`}




                                    >

                                        <ListItemIcon

                                            sx={{

                                                minWidth: 0,

                                                justifyContent: 'center',

                                                mr: open ? 3 : 'auto',

                                            }}

                                            className={`${location.pathname === item.path ? 'text-primary' : ''}`}

                                        >

                                            {item.icon}

                                        </ListItemIcon>

                                        <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />

                                    </ListItemButton>

                                </ListItem>

                            ))}

                        </List>

                    </Box>




                    <Box>

                        <Divider />

                        <List>

                            <ListItem disablePadding sx={{ display: 'block' }}>

                                <ListItemButton

                                    sx={{

                                        minHeight: 48,

                                        px: 2.5,

                                        justifyContent: open ? 'initial' : 'center',

                                    }}

                                >

                                    <ListItemIcon

                                        sx={{

                                            minWidth: 0,

                                            justifyContent: 'center',

                                            mr: open ? 3 : 'auto',

                                        }}

                                    >

                                        <Avatar sx={{

                                            width: 28, height: 28

                                        }} alt={username} />

                                    </ListItemIcon>

                                    <ListItemText primary={username} sx={{ opacity: open ? 1 : 0 }} />

                                </ListItemButton>

                            </ListItem>

                            {['Logout'].map((text, index) => (

                                <ListItem key={text} disablePadding sx={{ display: 'block' }}>

                                    <ListItemButton

                                        sx={{

                                            minHeight: 48,

                                            px: 2.5,

                                            justifyContent: open ? 'initial' : 'center',

                                        }}

                                        onClick={() => logout()}

                                    >

                                        <ListItemIcon

                                            sx={{

                                                minWidth: 0,

                                                justifyContent: 'center',

                                                mr: open ? 3 : 'auto',

                                            }}

                                        >

                                            <ExitToAppOutlinedIcon />

                                        </ListItemIcon>

                                        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />

                                    </ListItemButton>

                                </ListItem>

                            ))}

                        </List>

                    </Box>

                </Box>

            </Drawer>




            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

                <DrawerHeader />

                <Outlet />

            </Box>

        </Box>

    );

}


