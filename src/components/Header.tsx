import { Fragment, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import { makeStyles, createStyles } from '@mui/styles';
import { Grid, Link, Theme, useMediaQuery, Typography, Badge, Fab, AppBar, Toolbar, IconButton, Drawer, Button, useTheme, Container, Tooltip, Avatar, Divider, ListItemIcon, MenuItem, Menu } from "@mui/material";
import { Close, ShoppingCart, Menu as MenuIcon, DarkMode, LightMode, Paid, Logout, PersonAdd, Settings, AccountCircle, Assignment } from "@mui/icons-material";
import { cartCount, toggle } from "../redux/cartSlice";
import { isPlaying } from "../redux/musicSlice";
import { ColorModeContext } from "../App";
import logo from '../images/logo.png';
import Cart from "./Cart";
import axios from "axios";

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
    }
  })
);

export default function Header() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(cartCount);
  const playing = useAppSelector(isPlaying);
  const navigate = useNavigate();
  const location = useLocation();
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isAboveTablet = useMediaQuery(theme.breakpoints.up('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTinyMobile = useMediaQuery(theme.breakpoints.down(321));
  const [sidemenuOpen, setSidemenuOpen] = useState<boolean>(false);
  const [musicOpen, setMusicOpen] = useState<boolean>(false);
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const ens = useLookupAddress();
  const [displayName, setDisplayName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isAccountMenuOpen = Boolean(anchorEl);
  const onAccountMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeAccountMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    async function getAdmins(account: string) {
      try {
        
        const response = await axios.get<string[]>(`${process.env.REACT_APP_API}/items/admins`);
        const admins = response.data;
        if (admins.includes(account)) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.log("get admins error: ", error);
      }
    }

    if (account) {
      getAdmins(account);
    }

  }, [account]);

  useEffect(() => {
    if (ens) {
      setDisplayName(ens);
    } else if (account && account.length > 0) {
      setDisplayName(shortenAddress(account));
    }
  }, [account, ens]);

  const onMusicClick = () => {
    setMusicOpen(!musicOpen);
  }

  const onCartClick = () => {
    // toggle items modal
    dispatch(toggle(true));
  }

  const getLinkColor = (link: string) => {
    return location.pathname === link ? "primary" : "secondary";
  }

  return (
      <Fragment>
        <AppBar position="fixed" color="inherit">
          <Toolbar sx={{bgcolor: theme.palette.background.default, pb: theme.spacing(1)}}>
            <Container maxWidth='xl' disableGutters={isMobile}>
              <Grid id="header" container item justifyContent={isMobile ? 'end' : 'space-between'} alignItems="center" xl={12} lg={12} md={12} sm={12} xs={12} pl={1}>
                <Grid id='logo' container item display={isTinyMobile ? 'none' : 'flex'} justifyContent="start" xl={3} lg={3} md={3} sm={4} xs={1}>
                  <Link href={'/staking'} underline='none'>
                    <img className={classes.avatar} alt='Home' src={logo} width={45} height={45}/>
                  </Link>
                  {
                    isDesktop && <Typography variant='h6' alignSelf='center' fontWeight='bold' pl={2}>Froggy Friends</Typography>
                  }
                </Grid>
                <Grid id='links' container item display={isAboveTablet ? "flex" : "none"} justifyContent='space-evenly' textAlign='center' xl={4} lg={4} md={5}>
                  <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    <Typography className="link" variant="h5" color={getLinkColor('/staking')} onClick={() => navigate("/staking")}>Stake</Typography>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    <Typography className="link" variant="h5" color={getLinkColor('/market')} onClick={() => navigate("/market")}>Market</Typography>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    <Typography className="link" variant="h5" color={getLinkColor('/leaderboard')} onClick={() => navigate("/leaderboard")}>Board</Typography>
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    <Typography className="link" variant="h5" color={getLinkColor('/studio')} onClick={() => navigate("/studio")}>Studio</Typography>
                  </Grid> 
                  <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    <Typography className="link" variant="h5" color={getLinkColor('/spaces')} onClick={() => navigate("/spaces")}>Spaces</Typography>
                  </Grid> 
                </Grid>
                <Grid id='buttons' container item justifyContent="end" alignItems='center' p={1} xl={5} lg={4} md={4} sm={8} xs={isTinyMobile ? 12 : 11}>
                  <Grid item display="flex" pr={1}>
                    <Fab size='small' onClick={colorMode.toggleColorMode}>
                      { theme.palette.mode === 'dark' ? <LightMode fontSize="medium"/> : <DarkMode fontSize="medium"/>}
                    </Fab>
                  </Grid>
                  <Grid item display="flex" pr={1}>
                    <Fab size='small' onClick={() => window.open('https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x46898f15f99b8887d87669ab19d633f579939ad9&chain=mainnet', '_blank')}>
                      <Paid fontSize='medium'/>
                    </Fab>
                  </Grid>
                  {/* <Grid item display="flex" pr={1}>
                    <Fab size='small' onClick={onMusicClick}>
                      <Badge invisible={!playing} badgeContent=" " color="primary">
                        <Headphones fontSize='medium'/>
                      </Badge>
                    </Fab>
                  </Grid> */}
                  <Grid item display="flex" pr={1}>
                    <Fab size='small' onClick={onCartClick}>
                      <Badge badgeContent={cartItemCount} color="primary">
                        <ShoppingCart fontSize='medium'/>
                      </Badge>
                    </Fab>
                  </Grid>
                  <Grid item display={isDesktop && !account ? "flex" : "none"}>
                    <Button variant='contained' onClick={() => activateBrowserWallet()}>
                      <Typography variant='h5'>Login</Typography>  
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
                        isAdmin && <MenuItem><Assignment fontSize="small"/> Admins</MenuItem>
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
                </Grid>
              </Grid>
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
              <Typography className="link" variant="h5" color={getLinkColor('/staking')} onClick={() => {navigate("/staking"); setSidemenuOpen(false)}}>Stake</Typography>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color={getLinkColor('/market')} onClick={() => {navigate("/market"); setSidemenuOpen(false)}}>Market</Typography>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color={getLinkColor('/leaderboard')} onClick={() => {navigate("/leaderboard"); setSidemenuOpen(false)}}>Board</Typography>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color={getLinkColor('/studio')} onClick={() => {navigate("/studio"); setSidemenuOpen(false)}}>Studio</Typography>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color={getLinkColor('/spaces')} onClick={() => {navigate("/spaces"); setSidemenuOpen(false)}}>Spaces</Typography>
            </Grid>
            <Grid id='account' container item alignItems='center'>
              <Grid item display={!account ? "flex" : "none"} pr={2}>
                <Button variant='contained' onClick={() => activateBrowserWallet()}>
                  <Typography variant='h5'>Login</Typography>  
                </Button>
              </Grid>
            </Grid>
            <Grid item display={account ? "flex" : "none"} pt={3}>
              <Typography variant='h5' color='secondary'>{displayName}</Typography>
            </Grid>
          </Grid>
        </Drawer>
        <Cart />
      </Fragment>
  )
}