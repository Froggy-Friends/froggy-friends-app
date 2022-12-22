import { Fragment, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import { makeStyles, createStyles } from '@mui/styles';
import { Grid, Link, Theme, useMediaQuery, Typography, Badge, Fab, AppBar, Toolbar, IconButton, Drawer, Button, useTheme, Container, Stack, Modal, Box } from "@mui/material";
import { Close, ShoppingCart, Menu, DarkMode, LightMode, Paid } from "@mui/icons-material";
import { cartCount, toggle } from "../redux/cartSlice";
import { isPlaying } from "../redux/musicSlice";
import { ColorModeContext } from "../App";
import logo from '../images/logo.png';
import metamask from '../images/metamask.webp';
import brave from '../images/brave.svg';
import Cart from "./Cart";

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
  const isXs = useMediaQuery(theme.breakpoints.down(321));
  const [sidemenuOpen, setSidemenuOpen] = useState<boolean>(false);
  const [musicOpen, setMusicOpen] = useState<boolean>(false);
  const { activateBrowserWallet, account } = useEthers();
  const ens = useLookupAddress();
  const [displayName, setDisplayName] = useState<string>("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const ethereum = window.ethereum;

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
  }, [account])

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
                    <Typography className="link" variant="h5" color={getLinkColor('/staking')} onClick={() => navigate("/staking")}>Stake</Typography>
                    <Typography className="link" variant="h5" color={getLinkColor('/market')} onClick={() => navigate("/market")}>Market</Typography>
                    <Typography className="link" variant="h5" color={getLinkColor('/leaderboard')} onClick={() => navigate("/leaderboard")}>Board</Typography>
                    <Typography className="link" variant="h5" color={getLinkColor('/studio')} onClick={() => navigate("/studio")}>Studio</Typography>
                    <Typography className="link" variant="h5" color={getLinkColor('/spaces')} onClick={() => navigate("/spaces")}>Spaces</Typography>
                </Stack>
                <Stack id='buttons' direction='row' justifyContent="end" alignItems='center' p={1}>
                  <Stack direction='row' pr={1}>
                    <Fab size='small' onClick={colorMode.toggleColorMode}>
                      { theme.palette.mode === 'dark' ? <LightMode fontSize="medium"/> : <DarkMode fontSize="medium"/>}
                    </Fab>
                  </Stack>
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
                    <Button variant='contained' onClick={onLoginClicked}>
                      <Typography variant='h5'>Connect</Typography> 
                    </Button>
                  </Grid>
                  <Grid item display={isDesktop && account ? "flex" : "none"} pl={1}>
                    <Typography variant='h5'>{displayName}</Typography>
                  </Grid>
                  <Grid item display={!isAboveTablet ? "flex" : "none"} justifyContent="end" pl={1}>
                    <IconButton size="large" color="inherit" aria-label="menu" onClick={() => setSidemenuOpen(!sidemenuOpen)}>
                      <Menu/>
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
                <img src={metamask} height={35} width={35}/>
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
                  <img src={brave} height={35} width={35}/>
                  <Typography>Brave</Typography>
                </Stack>
              }
            </Stack>
          </Box>
        </Modal>
      </Fragment>
  )
}