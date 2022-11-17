import { Twitter } from "@mui/icons-material";
import { Grid, Paper, useTheme, Theme, useMediaQuery, Container, Typography, Divider, Stack, Avatar, Link } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import banner from '../images/community.png';
import { spaces } from '../data';
import { Fragment } from "react";
import SpacesShow from "../components/SpacesShow";

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
  const mondayShows = spaces.filter(space => space.day === 'Monday');
  const tuesdayShows = spaces.filter(space => space.day === 'Tuesday');
  const wednesdayShows = spaces.filter(space => space.day === 'Wednesday');
  const thursdayShows = spaces.filter(space => space.day === 'Thursday');
  const fridayShows = spaces.filter(space => space.day === 'Friday');
  const saturdayShows = spaces.filter(space => space.day === 'Saturday');
  const sundayShows = spaces.filter(space => space.day === 'Sunday');

  return (
    <Grid id='spaces' container direction='column' justifyContent='start' minHeight={800} pt={8}>
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='lg' sx={{pt: 5, pb: 10}}>
        <Typography variant='h3'>Community Spaces</Typography>
        <Typography variant='subtitle1' pb={5}>Weekly twitter spaces hosted by community members.</Typography>
        { 
          mondayShows && mondayShows.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Monday</Divider>
            {
              mondayShows.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          tuesdayShows && tuesdayShows.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Tuesday</Divider>
            {
              tuesdayShows.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          wednesdayShows && wednesdayShows.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Wednesday</Divider>
            {
              wednesdayShows.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          thursdayShows && thursdayShows.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Thursday</Divider>
            {
              thursdayShows.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          fridayShows && fridayShows.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Friday</Divider>
            {
              fridayShows.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          saturdayShows && saturdayShows.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Saturday</Divider>
            {
              saturdayShows.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          sundayShows && sundayShows.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Sunday</Divider>
            {
              sundayShows.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
      </Container>
    </Grid>
  )
}