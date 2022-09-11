import { useNavigate } from "react-router-dom";
import { Avatar, Grid, Link, Typography, Theme, createStyles, useTheme, useMediaQuery, Fab } from "@mui/material";
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
      cursor: 'pointer'
    },
    footerIcon: {
      bgcolor: theme.palette.common.black
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
    <Grid id='footer' container justifyContent='center' textAlign='center' borderTop={0.5} borderColor={theme.palette.secondary.main}>
      <Grid container item direction='column' alignItems='center' pb={10}>
        <Grid item p={5}>
          <Avatar className={classes.avatar} alt='Home' src={logo} sx={{height: 50, width: 50}}/>
        </Grid>
        <Grid item>
          <Typography variant='body1'>
            4,444 of the friendliest frogs in the metaverse.
          </Typography>
          <Typography color='secondary' pt={3}>&copy; {new Date().getFullYear()}	FroggyLabs LLC</Typography>
        </Grid>
        <Grid container justifyContent='center' p={2}>
            <Grid item p={1}>
              <Link href="https://twitter.com/FroggyFriendNFT" underline='none' target='_blank'>
                <Fab size='small'>
                  <Avatar className={classes.avatar} alt='Twitter' src={twitter}/>
                </Fab>
              </Link>
            </Grid>
            <Grid item p={1}>
              <Link href="https://opensea.io/collection/froggyfriendsnft" underline='none' target='_blank'>
                <Fab size='small'>
                  <Avatar className={classes.avatar} alt='Opensea' src={opensea}/>
                </Fab>
              </Link>
            </Grid>
            <Grid item p={1}>
              <Link href="https://looksrare.org/collections/0x29652C2e9D3656434Bc8133c69258C8d05290f41" underline='none' target='_blank'>
                <Fab size='small'>
                  <Avatar className={classes.avatar} alt='Looks Rare' src={looksrare}/>
                </Fab>
              </Link>
            </Grid>
            <Grid item p={1}>
              <Link href="https://etherscan.io/address/0x29652C2e9D3656434Bc8133c69258C8d05290f41#code" underline='none' target='_blank'>
                <Fab size='small'>
                  <Avatar className={classes.avatar} alt='Etherscan' src={etherscan}/>
                </Fab>
              </Link>
            </Grid>
            <Grid item p={1}>
              <Link href="https://discord.gg/froggylabs" underline='none' target='_blank'>
                <Fab size='small'>
                  <Avatar className={classes.avatar} alt='Discord' src={discord}/>
                </Fab>
              </Link>
            </Grid>
        </Grid>
        <Grid container direction={isTinyMobile ? "column" : "row"} justifyContent='center' pt={2} maxWidth={500}>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Typography className="link" variant="h6" color='secondary' onClick={() => navigate("/staking")}>Stake</Typography>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Typography className="link" variant="h6" color='secondary' onClick={() => navigate("/market")}>Market</Typography>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
            <Typography className="link" variant="h6" color='secondary' onClick={() => navigate("/leaderboard")}>Board</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}