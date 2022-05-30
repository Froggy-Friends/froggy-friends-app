import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import { makeStyles } from '@mui/styles';
import { Grid, Avatar, Link, createStyles, Theme, useMediaQuery, Typography, Badge, Fab, AppBar, Toolbar, IconButton, Drawer, Tooltip, Box, Fade, Button } from "@mui/material";
import { Close, ShoppingCart, Menu, Headphones } from "@mui/icons-material";
import { cartCount, toggle } from "../redux/cartSlice";
import { isPlaying } from "../redux/musicSlice";
import logo from '../images/logo.png';
import theme from "../theme";
import MusicPlayer from "./MusicPlayer";

const { REACT_APP_WEBSITE_URL } = process.env;

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    avatar: {
      height: 100,
      width: 100,
      cursor: 'pointer',
      [theme.breakpoints.up('sm')]: {
        marginTop: '5px'
      },
      [theme.breakpoints.up('lg')]: {
        marginTop: '10px'
      }
    },
    musicPlayer: {
      position: 'absolute',
      inset: '80px 10px auto auto',
      maxWidth: 350
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
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isMarket = location.pathname === "/market";
  const [sidemenuOpen, setSidemenuOpen] = useState<boolean>(false);
  const [musicOpen, setMusicOpen] = useState<boolean>(false);
  const [drawerMusicOpen, setDrawerMusicOpen] = useState<boolean>(false);
  const { activateBrowserWallet, account } = useEthers();
  const ens = useLookupAddress();
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    if (ens) {
      setDisplayName(ens);
    } else if (account && account.length > 0) {
      setDisplayName(shortenAddress(account));
    }
  }, [account, ens]);

  const getTitle = () => {
    if (isMarket) {
      return "Ribbit Prime";
    } else if (location.pathname === "/staking") {
      return "Ribbit Staking";
    } else if (location.pathname === "/admin") {
      return "Froggy Admin"
    } else if (location.pathname === "/leaderboard") {
      return "Leaderboard";
    }
  }

  const onMusicClick = () => {
    setMusicOpen(!musicOpen);
  }

  const onCartClick = () => {
    navigate("/market");
    // toggle items sidebar
    dispatch(toggle());
  }

  return (
      <Fragment>
        <AppBar position="fixed">
          <Toolbar disableGutters>
            <Grid id="header" container item justifyContent="space-between" alignItems="center" pl={isMobile ? 2 : 4} pr={isMobile ? 2 : 4} xl={12} lg={12} md={12} sm={12} xs={12}>
              <Grid id='logo' container item justifyContent="start" xl={3} lg={3} md={3} sm={6} xs={11}>
                <Link href={REACT_APP_WEBSITE_URL} underline='none'>
                  <Avatar className={classes.avatar} alt='Home' src={logo} sx={{width: 65, height: 65}}/>
                </Link>
                <Typography variant='h5' color='secondary' fontWeight='bold' alignSelf="center" pl={3}>{getTitle()}</Typography>
              </Grid>
              <Grid id='links' container item display={isDesktop ? "flex" : "none"} justifyContent='space-evenly' textAlign='center' xl={6} lg={6} md={6}>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Link href={REACT_APP_WEBSITE_URL + '/team'} underline='none' variant="h5" color="secondary">Team</Link>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Link href={REACT_APP_WEBSITE_URL + '/collabs'} underline='none' variant="h5" color="secondary">Collabs</Link>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Typography className="link" variant="h5" color="secondary" onClick={() => navigate("/staking")}>Stake</Typography>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Typography className="link" variant="h5" color="secondary" onClick={() => navigate("/market")}>Market</Typography>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Typography className="link" variant="h5" color="secondary" onClick={() => navigate("/leaderboard")}>Board</Typography>
                </Grid> 
              </Grid>
              <Grid id='buttons' container item justifyContent="end" alignItems='center' p={1} xl={3} lg={3} md={3} sm={6} xs={1}>
                <Grid item display={isDesktop ? "flex" : "none"} pr={2}>
                  <Fab size='small' onClick={onMusicClick}>
                    <Badge invisible={!playing} badgeContent=" " color="primary">
                      <Headphones fontSize='medium'/>
                    </Badge>
                  </Fab>
                </Grid>
                <Grid item display={isDesktop ? "flex" : "none"} pr={2}>
                  <Fab size='small' onClick={onCartClick}>
                    <Badge badgeContent={cartItemCount} color="primary">
                      <ShoppingCart fontSize='medium'/>
                    </Badge>
                  </Fab>
                </Grid>
                <Grid item display={isDesktop && !account ? "flex" : "none"}>
                  <Button variant='contained' onClick={() => activateBrowserWallet()}>
                    <Typography variant='h5'>Log</Typography>  
                  </Button>
                </Grid>
                <Grid item display={isDesktop && account ? "flex" : "none"}>
                  <Typography variant='h5'>{displayName}</Typography>
                </Grid>
                <Grid item display={isMobile ? "flex" : "none"} justifyContent="end" pl={1}>
                  <IconButton size="large" color="inherit" aria-label="menu" onClick={() => setSidemenuOpen(!sidemenuOpen)}>
                    <Menu/>
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
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
              <Link href={REACT_APP_WEBSITE_URL + '/team'} underline='none' variant="h5" color="secondary">Team</Link>
            </Grid>
            <Grid item pb={3}>
              <Link href={REACT_APP_WEBSITE_URL + '/collabs'} underline='none' variant="h5" color="secondary">Collabs</Link>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color="secondary" onClick={() => {navigate("/staking"); setSidemenuOpen(false)}}>Stake</Typography>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color="secondary" onClick={() => {navigate("/market"); setSidemenuOpen(false)}}>Market</Typography>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color="secondary" onClick={() => {navigate("/leaderboard"); setSidemenuOpen(false)}}>Board</Typography>
            </Grid>
            <Grid item pb={3}>
              <Link href={REACT_APP_WEBSITE_URL + '/license'} underline='none' variant="h5" color="secondary">License</Link>
            </Grid>
            <Grid id='music' container item alignItems='center'>
              <Grid item pr={2}>
                <Fab size='small' onClick={onCartClick}>
                  <Badge badgeContent={cartItemCount} color="primary">
                    <ShoppingCart fontSize='medium'/>
                  </Badge>
                </Fab>
              </Grid>
              <Grid item pr={2}>
                <Fab size='small' onClick={() => setDrawerMusicOpen(!drawerMusicOpen)}>
                  <Headphones fontSize='medium'/>
                </Fab>
              </Grid>
              <Grid item display={!account ? "flex" : "none"} pr={2}>
                <Button variant='contained' onClick={() => activateBrowserWallet()}>
                  <Typography variant='h5'>Log</Typography>  
                </Button>
              </Grid>
            </Grid>
            <Grid item display={account ? "flex" : "none"} pt={3}>
              <Typography variant='h5' color='secondary'>{displayName}</Typography>
            </Grid>
            <Fade in={drawerMusicOpen}>
              <Grid id='drawerPlayer' container pt={3}>
                <MusicPlayer inverted/>
              </Grid>
            </Fade>
          </Grid>
        </Drawer>
        <Fade in={musicOpen}>
          <Grid id='player' className={classes.musicPlayer} container>
            <MusicPlayer inverted={false}/>
          </Grid>
        </Fade>
      </Fragment>
  )
}