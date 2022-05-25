import { useNavigate } from "react-router-dom";
import { Avatar, Grid, Link, Typography, Theme, createStyles, useTheme, useMediaQuery } from "@mui/material";
import { makeStyles } from '@mui/styles';
import logo from '../images/logo.png';
import twitter from '../images/twitter.png';
import opensea from '../images/opensea.png';
import looksrare from '../images/looksrare.png';
import etherscan from '../images/etherscan.png';
import discord from '../images/discord.png';

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
    footer: {
      backgroundColor: '#181818'
    }
  })
);

export default function Footer() {
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTinyMobile = useMediaQuery(theme.breakpoints.down(400));

  return (
    <Grid id='footer' className={classes.footer} container justifyContent='center' textAlign='center'>
      <Grid container item direction='column' alignItems='center' pb={10}>
        <Grid item p={5}>
          <Avatar className={classes.avatar} alt='Home' src={logo} sx={{height: 50, width: 50}}/>
        </Grid>
        <Grid item>
          <Typography variant='body1' color='secondary'>
            4,444 of the friendliest frogs in the metaverse. 
          </Typography>
        </Grid>
        <Grid container justifyContent='center' p={2}>
            <Grid item p={1}>
              <Link href="https://twitter.com/FroggyFriendNFT" underline='none' target='_blank'>
                <Avatar className={classes.avatar} alt='Twitter' src={twitter} sx={{height: 35, width: 35}}/>
              </Link>
            </Grid>
            <Grid item p={1}>
              <Link href="https://opensea.io/collection/froggyfriendsnft" underline='none' target='_blank'>
                <Avatar className={classes.avatar} alt='Opensea' src={opensea} sx={{height: 35, width: 35}}/>
              </Link>
            </Grid>
            <Grid item p={1}>
              <Link href="https://looksrare.org/collections/0x29652C2e9D3656434Bc8133c69258C8d05290f41" underline='none' target='_blank'>
                <Avatar className={classes.avatar} alt='Looks Rare' src={looksrare} sx={{height: 35, width: 35}}/>
              </Link>
            </Grid>
            <Grid item p={1}>
              <Link href="https://etherscan.io/address/0x29652C2e9D3656434Bc8133c69258C8d05290f41#code" underline='none' target='_blank'>
                <Avatar className={classes.avatar} alt='Etherscan' src={etherscan} sx={{height: 35, width: 35}}/>
              </Link>
            </Grid>
            <Grid item p={1}>
              <Link href="https://discord.com/invite/froggyfriends" underline='none' target='_blank'>
                <Avatar className={classes.avatar} alt='Discord' src={discord} sx={{height: 35, width: 35}}/>
              </Link>
            </Grid>
        </Grid>
        <Grid container direction={isTinyMobile ? "column" : "row"} justifyContent='center' pt={2} maxWidth={500}>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Link href={process.env.REACT_APP_WEBSITE_URL + '/team'} underline='none' color='secondary' variant="h6">Team</Link>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Link href={process.env.REACT_APP_WEBSITE_URL + '/collabs'} underline='none' color='secondary' variant="h6">Collabs</Link>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Typography className="link" variant="h6" color='secondary' onClick={() => navigate("/staking")}>Staking</Typography>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Typography className="link" variant="h6" color='secondary' onClick={() => navigate("/market")}>Market</Typography>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Typography className="link" variant="h6" color='secondary' onClick={() => navigate("/leaderboard")}>Board</Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent={isMobile ? 'center' : 'space-between'} mt={10} pb={-10} maxWidth={'60%'} sx={{borderTop: '1px solid #b3b6bb'}}>
          <Grid item>
            <Typography color='secondary' pt={3}>&copy;	Froggy Friends NFT</Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems='center'>
              <Link href={process.env.REACT_APP_WEBSITE_URL + '/terms-of-use'} underline='none'>
                <Typography variant='body2' color='secondary' pt={3} pr={1}>Terms</Typography>
              </Link>
              <Typography color='secondary' pt={3}>•</Typography>
              <Link href={process.env.REACT_APP_WEBSITE_URL + '/privacy-policy'} underline='none'>
                <Typography variant='body2' color='secondary' pt={3} pl={1} pr={1}>Privacy</Typography>
              </Link>
              <Typography color='secondary' pt={3}>•</Typography>
              <Link href={process.env.REACT_APP_WEBSITE_URL + '/license'} underline='none'>
                <Typography variant='body2' color='secondary' pt={3} pl={1}>License</Typography>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}