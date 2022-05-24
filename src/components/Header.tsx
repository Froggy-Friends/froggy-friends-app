import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Avatar, Link, createStyles, Theme, useMediaQuery, Typography, Badge, Fab, AppBar, Toolbar } from "@mui/material";
import { makeStyles } from '@mui/styles';
import logo from '../images/logo.png';
import theme from "../theme";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const getTitle = () => {
    if (location.pathname === "/market") {
      return "Ribbit Prime";
    } else if (location.pathname === "/staking") {
      return "Ribbit Staking";
    } else if (location.pathname === "/admin") {
      return "Froggy Admin"
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
          <Grid container justifyContent="space-between" xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid container item justifyContent='center' xl={3} lg={3} md={4} sm={4} xs={3}>
              <Link href={REACT_APP_WEBSITE_URL} underline='none'>
                <Avatar className={classes.avatar} alt='Home' src={logo} sx={{width: 75, height: 75}}/>
              </Link>
              <Typography variant='h5' color='secondary' fontWeight='bold' alignSelf="center" pl={3}>{getTitle()}</Typography>
            </Grid>
            <Grid container item justifyContent='center' alignItems="center" textAlign='center' xl={6} lg={6} md={6} sm={6} xs={9}>
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
                <Link href={REACT_APP_WEBSITE_URL + '/license'} underline='none' variant="h5" color="secondary">License</Link>
              </Grid> 
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