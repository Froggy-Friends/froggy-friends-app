import { Grid, Avatar, Link, createStyles, Theme, useMediaQuery } from "@mui/material";
import { makeStyles } from '@mui/styles';
import logo from '../images/logo.png';
import theme from "../theme";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    header: {
      backgroundColor: "#181818"
    },
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
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Grid id='toolbar' className={classes.header} container item justifyContent='space-between' height={100} xl={12} lg={12} md={12} sm={12} xs={12} p={1}>
      <Grid container item justifyContent='center' xl={4} lg={4} md={3} sm={3} xs={3}>
        <Link href={process.env.REACT_APP_WEBSITE_URL} underline='none'>
          <Avatar className={classes.avatar} alt='Home' src={logo} sx={{width: 75, height: 75}}/>
        </Link>
      </Grid>
      { isDesktop && 
        <Grid container item justifyContent='center' textAlign='center' xl={6} lg={6} md={9} sm={9} xs={9} pt={2}>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Link href={process.env.REACT_APP_WEBSITE_URL + '/team'} underline='none' variant="h5" color="secondary">Team</Link>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Link href={process.env.REACT_APP_WEBSITE_URL + '/collabs'} underline='none' variant="h5" color="secondary">Collabs</Link>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Link href={process.env.REACT_APP_STAKING_URL} underline='none' variant="h5" color="secondary">Stake</Link>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Link href="/market" underline='none' variant="h5" color="secondary">Market</Link>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Link href={process.env.REACT_APP_WEBSITE_URL + '/license'} underline='none' variant="h5" color="secondary">License</Link>
          </Grid> 
        </Grid>
      }
    </Grid>
  )
}