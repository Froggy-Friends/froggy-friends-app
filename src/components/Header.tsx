import { Fragment, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import { makeStyles, createStyles } from '@mui/styles';
import { Grid, Link, Theme, useMediaQuery, Typography, Badge, Fab, AppBar, Toolbar, IconButton, Drawer, Button, useTheme, Container, Divider, ListItemIcon, MenuItem, Menu, Stack, Box, Modal } from "@mui/material";
import { Close, ShoppingCart, Menu as MenuIcon, DarkMode, LightMode, Logout, Settings, AccountCircle, Assignment } from "@mui/icons-material";
import { cartCount, toggle } from "../redux/cartSlice";
import { ColorModeContext } from "../App";
import logo from '../images/logo.png';
import metamask from '../images/metamask.webp';
import brave from '../images/brave.svg';
import Cart from "./Cart";
import axios from "axios";

declare var window: any;

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    avatar: { 
      cursor: 'pointer',
      [theme.breakpoints.up('sm')]: {
        marginTop: '5px'
      },
      [theme.breakpoints.up('lg')]: {
        marginTop: '10px'
      }
    },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.secondary.main,
      borderRadius: 5,
      padding: 4,
      [theme.breakpoints.down('sm')]: {
        width: 300
      }
    }
  })
);

interface HeaderProps {
  isAdmin: boolean;
  onAdminChange: Function;
}

export default function Header(props: HeaderProps) {
  const { isAdmin, onAdminChange } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(cartCount);
  const navigate = useNavigate();
  const location = useLocation();
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isAboveTablet = useMediaQuery(theme.breakpoints.up('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down(321));
  const [sidemenuOpen, setSidemenuOpen] = useState<boolean>(false);
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const ens = useLookupAddress();
  const [displayName, setDisplayName] = useState<string>("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const ethereum = window.ethereum;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isAccountMenuOpen = Boolean(anchorEl);
  const onAccountMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeAccountMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (ens) {
      setDisplayName(ens);
    } else if (account && account.length > 0) {
      setDisplayName(shortenAddress(account));
    }
  }, [account, ens]);

  useEffect(() => {
    if (showLoginModal && account) {
      setShowLoginModal(false);
    }
  }, [account, showLoginModal]);

  useEffect(() => {
    async function getAdmins(account: string) {
      try {
        const admins = (await axios.get<string[]>(`${process.env.REACT_APP_API}/items/admins`)).data;
        const match = admins.some(admin => admin.toLowerCase() === account.toLowerCase());
        onAdminChange(match);
      } catch (error) {
        onAdminChange(false);
      }
    }

    if (account) {
      getAdmins(account);
    }

  }, [account]);

  const onCartClick = () => {
    // toggle items modal
    dispatch(toggle(true));
  }

  const getLinkColor = (link: string) => {
    return location.pathname === link ? "primary" : "secondary";
  }

  const onLoginClicked = () => {
    setShowLoginModal(true);
  }

  const onLoginModalClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setShowLoginModal(false);
  }

  return (
      <Fragment>
        <AppBar position="fixed" color="inherit">
          <Toolbar sx={{bgcolor: theme.palette.background.default, pb: theme.spacing(1)}}>
            <Container maxWidth='xl' disableGutters={isMobile}>
              <Stack id="header" direction='row' justifyContent={isXs ? 'end' : 'space-between'} alignItems="center" p={0.5}>
                <Stack id='logo' direction='row' display={isXs ? 'none' : 'flex'} alignSelf='end'>
                  <Link href={'/staking'} underline='none'>
                    <img className={classes.avatar} alt='Home' src={logo} width={55} height={55}/>
                  </Link> 
                  {
                    isDesktop && <Typography variant='h6' alignSelf='center' fontWeight='bold' pl={2}>Froggy Friends</Typography>
                  }
                </Stack>
                <Stack id='links' direction='row' display={isAboveTablet ? "flex" : "none"} justifyContent='space-evenly' textAlign='center' spacing={2}>
                    <Typography className="link" variant="h5" color={getLinkColor('/studio')} onClick={() => navigate("/studio")}>Studio</Typography>
                    <Typography className="link" variant="h5" color={getLinkColor('/market')} onClick={() => navigate("/market")}>Shop</Typography>
                </Stack>
                <Stack id='buttons' direction='row' justifyContent="end" alignItems='center' p={1}>
                  <Stack direction='row' pr={1}>
                    <Fab size='small' onClick={colorMode.toggleColorMode}>
                      { theme.palette.mode === 'dark' ? <LightMode fontSize="medium"/> : <DarkMode fontSize="medium"/>}
                    </Fab>
                  </Stack>
                  <Grid item display="flex" pr={1}>
                    <Fab size='small' onClick={onCartClick}>
                      <Badge badgeContent={cartItemCount} color="primary">
                        <ShoppingCart fontSize='medium'/>
                      </Badge>
                    </Fab>
                  </Grid>
                  <Grid item display={isDesktop && !account ? "flex" : "none"}>
                    <Button variant='contained' onClick={onLoginClicked}>
                      <Typography variant='h5'>Connect</Typography> 
                    </Button>
                  </Grid>
                  <Grid item display={isDesktop && account ? "flex" : "none"} pl={1}>
                    <Fab size='small' onClick={onAccountMenuClick}>
                      <AccountCircle fontSize='medium'/>
                    </Fab>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={isAccountMenuOpen}
                      onClose={closeAccountMenu}
                      onClick={closeAccountMenu}
                      PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                      <Typography pl={2}>{displayName}</Typography>
                      {
                        isAdmin && 
                        <MenuItem onClick={() => navigate("/admin")}>
                          <Assignment fontSize="small"/> Admin
                        </MenuItem>
                      }
                      <Divider />
                      <MenuItem disabled>
                        <ListItemIcon>
                          <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                      </MenuItem>
                      <MenuItem onClick={() => deactivate()}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </Grid>
                  <Grid item display={!isAboveTablet ? "flex" : "none"} justifyContent="end" pl={1}>
                    <IconButton size="large" color="inherit" aria-label="menu" onClick={() => setSidemenuOpen(!sidemenuOpen)}>
                      <MenuIcon/>
                    </IconButton>
                  </Grid>
                </Stack>
              </Stack>
            </Container>
          </Toolbar>
        </AppBar>
        <Drawer id="drawer" anchor="right" variant="persistent" open={sidemenuOpen}>
          <Grid container direction="column" minWidth={320} p={3}>
            <Grid id="title" container justifyContent="space-between" alignItems="center" pb={5}>
              <Grid item><Typography variant='h5' color='secondary'>Froggy Friends</Typography></Grid>
              <Grid item>
                <IconButton size="medium" color="secondary" onClick={() => setSidemenuOpen(!sidemenuOpen)}>
                  <Close/>
                </IconButton>
              </Grid>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color={getLinkColor('/studio')} onClick={() => {navigate("/studio"); setSidemenuOpen(false)}}>Studio</Typography>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color={getLinkColor('/shop')} onClick={() => {navigate("/shop"); setSidemenuOpen(false)}}>Shop</Typography>
            </Grid>
            <Grid id='account' container item alignItems='center'>
              <Grid item display={!account ? "flex" : "none"} pr={2}>
                <Button variant='contained' onClick={onLoginClicked}>
                  <Typography variant='h5'>Connect</Typography>  
                </Button>
              </Grid>
            </Grid>
            <Grid item display={account ? "flex" : "none"} pt={3}>
              <Typography variant='h5' color='secondary'>{displayName}</Typography>
            </Grid>
          </Grid>
        </Drawer>
        <Cart />
        <Modal open={showLoginModal} onClose={onLoginModalClose}>
          <Box className={classes.modal}>
            <Stack p={3} spacing={3}>
              <Typography variant='h5'>Connect Wallet</Typography>
              <Typography>Choose a wallet to connect.</Typography>
              <Stack
                  direction='row' 
                  p={2} 
                  spacing={1} 
                  alignItems='center' 
                  border='2px solid grey' 
                  borderRadius={2} 
                  sx={{cursor: 'pointer'}}
                  onClick={() => activateBrowserWallet()}
              >
                <img src={metamask} alt='Metamask' height={35} width={35}/>
                <Typography>Metamask</Typography>
              </Stack>
              { 
                ethereum && ethereum.isBraveWallet && 
                <Stack
                  direction='row' 
                  p={2} 
                  spacing={1} 
                  alignItems='center' 
                  border='2px solid grey' 
                  borderRadius={2} 
                  sx={{cursor: 'pointer'}}
                  onClick={() => activateBrowserWallet()}
                >
                  <img src={brave} alt='Brave' height={35} width={35}/>
                  <Typography>Brave</Typography>
                </Stack>
              }
            </Stack>
          </Box>
        </Modal>
      </Fragment>
  )
}