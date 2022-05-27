import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Avatar, Link, createStyles, Theme, useMediaQuery, Typography, Badge, Fab, AppBar, Toolbar, IconButton, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';
import logo from '../images/logo.png';
import theme from "../theme";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { cartCount, toggle } from "../redux/cartSlice";
import { Fragment, useState } from "react";
import { Close } from "@mui/icons-material";

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
    }
  })
);

export default function Header() {
  const classes = useStyles();
  const cartItemCount = useAppSelector(cartCount);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTinyMobile = useMediaQuery(theme.breakpoints.down(375));
  const isMarket = location.pathname === "/market";
  const [sidemenuOpen, setSidemenuOpen] = useState<boolean>(false);

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
              <Grid container item justifyContent="start" xl={3} lg={4} md={4} sm={9} xs={7}>
                <Link display={isTinyMobile ? "none" : "flex"} href={REACT_APP_WEBSITE_URL} underline='none'>
                  <Avatar className={classes.avatar} alt='Home' src={logo} sx={{width: 65, height: 65}}/>
                </Link>
                <Typography variant='h5' color='secondary' fontWeight='bold' alignSelf="center" pl={3}>{getTitle()}</Typography>
              </Grid>
              <Grid container item display={isMobile ? "none" : "flex"} xl={6} lg={5}>
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
              <Grid container item justifyContent="end" xl={1} lg={1} md={2} sm={3} xs={5}>
                <Grid item display={isMarket && !isSmallMobile ? "flex" : "none"} pr={3}>
                  <Fab size='small' onClick={onCartClick}>
                    <Badge badgeContent={cartItemCount} color="primary">
                      <HeadphonesIcon fontSize='medium'/>
                    </Badge>
                  </Fab>
                </Grid>
                <Grid item display={isMarket ? "flex" : "none"} pr={1}>
                  <Fab size='small' onClick={onCartClick}>
                    <Badge badgeContent={cartItemCount} color="primary">
                      <ShoppingCartIcon fontSize='medium'/>
                    </Badge>
                  </Fab>
                </Grid>
                <Grid item display={isMobile ? "flex" : "none"} justifyContent="end">
                  <IconButton size="large" color="inherit" aria-label="menu" onClick={() => setSidemenuOpen(!sidemenuOpen)}>
                    <MenuIcon/>
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
            <Grid id='music' item>
              <Fab size='small' onClick={onCartClick}>
                <Badge badgeContent={cartItemCount} color="primary">
                  <HeadphonesIcon fontSize='medium'/>
                </Badge>
              </Fab>
            </Grid>
          </Grid>
        </Drawer>
      </Fragment>
  )
}