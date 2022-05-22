import { useNavigate } from "react-router-dom";
import { Grid, Avatar, Link, createStyles, Theme, useMediaQuery, Typography, Badge, Fab, AppBar, Toolbar } from "@mui/material";
import { makeStyles } from '@mui/styles';
import logo from '../images/logo.png';
import theme from "../theme";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppSelector } from "../redux/hooks";
import { cartCount } from "../redux/cartSlice";

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
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  console.log("cart count: ", cartItemCount);

  return (
      <AppBar position="fixed">
        <Toolbar>
          <Grid container item justifyContent='center' xl={4} lg={4} md={3} sm={3} xs={3}>
            <Link href={REACT_APP_WEBSITE_URL} underline='none'>
              <Avatar className={classes.avatar} alt='Home' src={logo} sx={{width: 75, height: 75}}/>
            </Link>
            <Typography variant='h4' color='secondary' fontWeight='bold' alignSelf="center" pl={3}>Ribbit Prime</Typography>
          </Grid>
          { isDesktop && 
            <Grid container item justifyContent='center' alignItems="center" textAlign='center' xl={6} lg={6} md={9} sm={9} xs={9}>
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
          }
          <Grid item alignSelf="center">
            <Fab size='medium'>
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCartIcon fontSize='large'/>
              </Badge>
            </Fab>
          </Grid>
        </Toolbar>
      </AppBar>
  )
}