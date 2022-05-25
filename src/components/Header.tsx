import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Avatar, Link, createStyles, Theme, useMediaQuery, Typography, Badge, Fab, AppBar, Toolbar, IconButton } from "@mui/material";
import { makeStyles } from '@mui/styles';
import logo from '../images/logo.png';
import theme from "../theme";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { cartCount, toggle } from "../redux/cartSlice";

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
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const getTitle = () => {
    if (location.pathname === "/market") {
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
      <AppBar position="fixed">
        <Toolbar disableGutters>
          <Grid id="header" container item justifyContent="space-between" alignItems="center" pl={2} pr={2} xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid container item xl={3} lg={4} md={4} sm={10} xs={10}>
              <Link href={REACT_APP_WEBSITE_URL} underline='none'>
                <Avatar className={classes.avatar} alt='Home' src={logo} sx={{width: 65, height: 65}}/>
              </Link>
              <Typography variant='h5' color='secondary' fontWeight='bold' alignSelf="center" pl={3}>{getTitle()}</Typography>
            </Grid>
            <Grid container item display={isMobile ? "none" : "flex"} xl={6} lg={6} mx={8} sm={12} xs={12}>
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
              <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                <Link href={REACT_APP_WEBSITE_URL + '/license'} underline='none' variant="h5" color="secondary">License</Link>
              </Grid> 
            </Grid>
            <Grid item display={isMobile ? "flex" : "none"} textAlign="end" pr={3} sm={2} xs={2}>
              <IconButton size="large" color="inherit" aria-label="menu">
                <MenuIcon/>
              </IconButton>
            </Grid>
            {/* <Grid container item justifyContent="center" alignItems="center" xl={1} lg={1} md={1} sm={1} xs={1}>
              <Fab size='medium' onClick={onCartClick}>
                <Badge badgeContent={cartItemCount} color="primary">
                  <ShoppingCartIcon fontSize='large'/>
                </Badge>
              </Fab>
            </Grid> */}
          </Grid>
        </Toolbar>
      </AppBar>
  )
}