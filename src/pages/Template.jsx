import React, {useContext} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CelebrationIcon from '@mui/icons-material/Celebration';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Link, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Colaboradores from './Colaboradores';
import AddColaborador from './AddColaborador';
import AddColaboradores from './AddColaboradores';
import Birthday from './Birthday';
import Customization from './Customization';
import Register from '../components/Register';

import { MyContext } from '../contexts/MyContext';

import LogoHorizontal from '../assets/logos/logo_horizontal.png';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Template() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { logoutUser } = useContext(MyContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const links = [
    { name: 'Dashboard', path: `${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/`, icon: <BarChartIcon />},
    { name: 'Colaboradores', path: `${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/colaboradores`, icon: <GroupsIcon />},
    { name: 'Add Colaborador ', path: `${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/add-colaborador`, icon: <PersonAddIcon />},
    { name: 'Add Colaboradores', path: `${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/add-colaboradores`, icon: <GroupAddIcon />},
    { name: 'Aniversariantes', path: `${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/aniversariantes`, icon: <CelebrationIcon />},
    { name: 'Cadastrar Usuário', path: `${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/add-usuario`, icon: <VpnKeyIcon />},
    { name: 'Customização', path: `${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/customizacao`, icon: <AutoFixHighIcon />}
    
  ]

  return (
    <Box sx={{ display: 'flex', width: '100%', maxWidth: '1400px', justifyContent: 'center' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            People Manager
          </Typography>
          
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
        <img src={LogoHorizontal} width={170} alt="" />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>          
        </DrawerHeader>
        <Divider />
        <List>
            {links.map((link, index) => (
                <ListItem key={link.name} component={Link} to={link.path}>
                    <ListItemButton>
                    <ListItemIcon>
                        {link.icon}
                    </ListItemIcon>
                    <ListItemText sx={{color: theme.palette.text.primary}} primary={link.name} />
                    </ListItemButton>
                </ListItem>
            ))}
            {/* ListItem Logoff */}
            <ListItem>
                <ListItemButton onClick={logoutUser}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sair" />
                </ListItemButton>
            </ListItem>

        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
       
        <Routes>
          <Route path={`${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/`} element={<Dashboard />} />
          <Route path={`${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/colaboradores`} element={<Colaboradores />} />
          <Route path={`${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/add-colaborador`} element={<AddColaborador />} />
          <Route path={`${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/add-colaboradores`} element={<AddColaboradores />} />
          <Route path={`${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/aniversariantes`} element={<Birthday />} />
          <Route path={`${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/customizacao`} element={<Customization />} />
          <Route path={`${import.meta.env.VITE_REACT_APP_PATH_CLIENT}/add-usuario`} element={<Register />} />
        </Routes>
       
      </Main>
    </Box>
  );
}
