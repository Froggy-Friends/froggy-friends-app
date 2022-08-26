import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";
import { makeStyles } from '@mui/styles';
import { Grid, Avatar, Link, createStyles, Theme, useMediaQuery, Typography, Badge, Fab, AppBar, Toolbar, IconButton, Drawer, Fade, Button } from "@mui/material";
import { Close, ShoppingCart, Menu, Headphones, MonetizationOn } from "@mui/icons-material";
import { cartCount, toggle } from "../redux/cartSlice";
import { isPlaying } from "../redux/musicSlice";
import { darkTheme, SwapWidget } from '@uniswap/widgets'
import { uniswapConfig } from '../config';
import '@uniswap/widgets/fonts.css'
import logo from '../images/logo.png';
import theme from "../theme";
import MusicPlayer from "./MusicPlayer";
import Cart from "./Cart";

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
    },
    swap: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: 4,
      justifyContent: 'center'
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
  const isTablet = useMediaQuery(theme.breakpoints.up('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTinyMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isBelow320 = useMediaQuery(theme.breakpoints.down(320));
  const isMarket = location.pathname === "/market";
  const [sidemenuOpen, setSidemenuOpen] = useState<boolean>(false);
  const [musicOpen, setMusicOpen] = useState<boolean>(false);
  const [swapOpen, setSwapOpen] = useState<boolean>(false);
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
      return "Ribbit Market";
    } else if (location.pathname === "/staking") {
      return "Ribbit Staking";
    } else if (location.pathname === "/admin") {
      return "Froggy Admin"
    } else if (location.pathname === "/leaderboard") {
      return "Leaderboard";
    }
  }

  const onSwapClick = () => {
    setSwapOpen(!swapOpen);
  }

  const onMusicClick = () => {
    setMusicOpen(!musicOpen);
  }

  const onCartClick = () => {
    navigate("/market");
    // toggle items sidebar
    dispatch(toggle(true));
  }

  const getLinkColor = (link: string) => {
    return location.pathname == link ? "primary" : "secondary";
  }

  return (
      <Fragment>
        <AppBar position="fixed">
          <Toolbar disableGutters>
            <Grid id="header" container item justifyContent={isTinyMobile ? 'end' : 'space-between'} alignItems="center" xl={12} lg={12} md={12} sm={12} xs={12} pl={1}>
              <Grid id='logo' container item display={isBelow320 ? 'none' : 'flex'} justifyContent="start" xl={3} lg={3} md={3} sm={6} xs={2}>
                <Link href={'/staking'} underline='none'>
                  <Avatar className={classes.avatar} alt='Home' src={logo} sx={{width: 65, height: 65}}/>
                </Link>
                { isTablet && <Typography variant='h5' color='secondary' fontWeight='bold' alignSelf="center" pl={3}>{getTitle()}</Typography>}
              </Grid>
              <Grid id='links' container item display={isDesktop ? "flex" : "none"} justifyContent='space-evenly' textAlign='center' xl={4} lg={4} md={4}>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Typography className="link" variant="h5" color={getLinkColor('/staking')} onClick={() => navigate("/staking")}>Stake</Typography>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Typography className="link" variant="h5" color={getLinkColor('/market')} onClick={() => navigate("/market")}>Market</Typography>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Typography className="link" variant="h5" color={getLinkColor('/items')} onClick={() => navigate("/items")}>Items</Typography>
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <Typography className="link" variant="h5" color={getLinkColor('/leaderboard')} onClick={() => navigate("/leaderboard")}>Board</Typography>
                </Grid> 
              </Grid>
              <Grid id='buttons' container item justifyContent="end" alignItems='center' p={1} xl={3} lg={3} md={3} sm={6} xs={isBelow320 ? 12 : 10}>
                <Grid item display="flex" pr={2}>
                  <Fab size='small' onClick={onSwapClick}>
                    <MonetizationOn color={swapOpen ? "primary" : "inherit"} fontSize="medium"/>
                  </Fab>
                </Grid>
                <Grid item display="flex" pr={2}>
                  <Fab size='small' onClick={onMusicClick}>
                    <Badge invisible={!playing} badgeContent=" " color="primary">
                      <Headphones fontSize='medium'/>
                    </Badge>
                  </Fab>
                </Grid>
                <Grid item display="flex" pr={2}>
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
              <Typography className="link" variant="h5" color={getLinkColor('/staking')} onClick={() => {navigate("/staking"); setSidemenuOpen(false)}}>Stake</Typography>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color={getLinkColor('/market')} onClick={() => {navigate("/market"); setSidemenuOpen(false)}}>Market</Typography>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color={getLinkColor('/items')} onClick={() => {navigate("/items"); setSidemenuOpen(false)}}>Items</Typography>
            </Grid>
            <Grid item pb={3}>
              <Typography className="link" variant="h5" color={getLinkColor('/leaderboard')} onClick={() => {navigate("/leaderboard"); setSidemenuOpen(false)}}>Board</Typography>
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
        <Fade in={musicOpen}>
          <Grid id='player' className={classes.musicPlayer} container zIndex={1}>
            <MusicPlayer inverted={false}/>
          </Grid>
        </Fade>
        <Fade in={swapOpen}>
          <Grid id='swap' className={classes.swap} container zIndex={1}>
            <SwapWidget 
              theme={darkTheme} 
              jsonRpcUrlMap={uniswapConfig.jsonRpcUrlMap}
              tokenList={uniswapConfig.tokenList}  
              defaultOutputAmount={uniswapConfig.outputAmount}
              defaultOutputTokenAddress={uniswapConfig.outputTokenAddress}
            />
          </Grid>
        </Fade>
        <Cart />
      </Fragment>
  )
}