import { Grid, Paper, useTheme, Theme, useMediaQuery, Container, Typography, Divider } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import banner from '../images/community.png';
import { Space } from "../models/Space";

const spaces: Space[] = [
  {
    host: 'Ollie',
    twitter: 'https://twitter.com/ollliieeeeee',
    showName: 'Forg Hour',
    showHour: 9,
    showTimezone: 'BST'
  }
]

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    banner: {
      backgroundImage: `url(${banner})`, 
      backgroundSize: 'cover',
      [theme.breakpoints.up('xl')]: {
        backgroundPositionY: -200
      }
    }
  })
);

export default function Spaces() {
  const classes = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid id='spaces' container direction='column' justifyContent='start' minHeight={800} pt={8}>
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='xl' sx={{pt: 5, pb: 10}}>
        <Typography variant='h3' pb={5}>Community Spaces</Typography>
        <Divider sx={{pb: 5}}>Monday</Divider>
        <Divider sx={{pb: 5}}>Tuesday</Divider>
        <Divider sx={{pb: 5}}>Wednesday</Divider>
        <Divider sx={{pb: 5}}>Thursday</Divider>
        <Divider sx={{pb: 5}}>Friday</Divider>
      </Container>
    </Grid>
  )
}