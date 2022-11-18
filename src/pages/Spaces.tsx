import { Grid, Paper, useTheme, Theme, useMediaQuery, Container, Typography, Divider } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import banner from '../images/community.png';
import { Fragment, useEffect, useState } from "react";
import SpacesShow from "../components/SpacesShow";
import axios from "axios";
import { ScheduledSpace, Space, SpacesCalendar } from "../models/Spaces";

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
  const [calendar, setCalendar] = useState<SpacesCalendar>();
  const [shows, setShows] = useState<ScheduledSpace[]>([]);

  useEffect(() => {
    async function getSpacesCalendar() {
      const spacesCalendar = (await axios.get<SpacesCalendar>(`${process.env.REACT_APP_API}/spaces`)).data;
      setCalendar(spacesCalendar);
    }

    getSpacesCalendar();
  }, [])

  useEffect(() => {
    async function getScheduledShows() {
      const shows = (await axios.get<ScheduledSpace[]>(`${process.env.REACT_APP_API}/spaces/scheduled`)).data;
      setShows(shows);
    }
    
    getScheduledShows();
  }, []);

  const getScheduledShow = (host: string) => {
    return shows.find(show => show.space.host.name.toLowerCase() === host.toLowerCase());
  }

  return (
    <Grid id='spaces' container direction='column' justifyContent='start' minHeight={800} pt={8}>
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='xl' sx={{pt: 5, pb: 10}}>
        <Typography variant='h3'>Community Spaces</Typography>
        <Typography variant='subtitle1' pb={5}>Weekly twitter spaces hosted by community members.</Typography>
        { 
          calendar && calendar.monday.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Monday</Divider>
            {
              calendar.monday.map((space, index) => {
                return (
                  <SpacesShow key={index} scheduled={getScheduledShow(space.host.name)} name={space.name} hostName={space.host.name} bannerUrl={space.bannerUrl} avatar={space.host.avatar}twitterUrl={space.host.twitterUrl}pst={space.times.pst}est={space.times.est}gmt={space.times.gmt}/>
                )
              })
            }
          </Fragment>        
        }
        { 
          calendar && calendar.tuesday.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Tuesday</Divider>
            {
              calendar.tuesday.map((space, index) => {
                return (
                  <SpacesShow key={index} scheduled={getScheduledShow(space.host.name)} name={space.name} hostName={space.host.name} bannerUrl={space.bannerUrl} avatar={space.host.avatar}twitterUrl={space.host.twitterUrl}pst={space.times.pst}est={space.times.est}gmt={space.times.gmt}/>
                )
              })
            }
          </Fragment>        
        }
        { 
          calendar && calendar.wednesday.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Wednesday</Divider>
            {
              calendar.wednesday.map((space, index) => {
                return (
                  <SpacesShow key={index} scheduled={getScheduledShow(space.host.name)} name={space.name} hostName={space.host.name} bannerUrl={space.bannerUrl} avatar={space.host.avatar}twitterUrl={space.host.twitterUrl}pst={space.times.pst}est={space.times.est}gmt={space.times.gmt}/>
                )
              })
            }
          </Fragment>        
        }
        { 
          calendar && calendar.thursday.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Thursday</Divider>
            {
              calendar.thursday.map((space, index) => {
                return (
                  <SpacesShow key={index} scheduled={getScheduledShow(space.host.name)} name={space.name} hostName={space.host.name} bannerUrl={space.bannerUrl} avatar={space.host.avatar}twitterUrl={space.host.twitterUrl}pst={space.times.pst}est={space.times.est}gmt={space.times.gmt}/>
                )
              })
            }
          </Fragment>        
        }
        { 
          calendar && calendar.friday.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Friday</Divider>
            {
              calendar.friday.map((space, index) => {
                return (
                  <SpacesShow key={index} scheduled={getScheduledShow(space.host.name)} name={space.name} hostName={space.host.name} bannerUrl={space.bannerUrl} avatar={space.host.avatar}twitterUrl={space.host.twitterUrl}pst={space.times.pst}est={space.times.est}gmt={space.times.gmt}/>
                )
              })
            }
          </Fragment>        
        }
        { 
          calendar && calendar.saturday.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Saturday</Divider>
            {
              calendar.saturday.map((space, index) => {
                return (
                  <SpacesShow key={index} scheduled={getScheduledShow(space.host.name)} name={space.name} hostName={space.host.name} bannerUrl={space.bannerUrl} avatar={space.host.avatar}twitterUrl={space.host.twitterUrl}pst={space.times.pst}est={space.times.est}gmt={space.times.gmt}/>
                )
              })
            }
          </Fragment>        
        }
        { 
          calendar && calendar.sunday.length > 0 &&
          <Fragment>
            <Divider sx={{pb: 5}}>Sunday</Divider>
            {
              calendar.sunday.map((space, index) => {
                return (
                  <SpacesShow key={index} scheduled={getScheduledShow(space.host.name)} name={space.name} hostName={space.host.name} bannerUrl={space.bannerUrl} avatar={space.host.avatar}twitterUrl={space.host.twitterUrl}pst={space.times.pst}est={space.times.est}gmt={space.times.gmt}/>
                )
              })
            }
          </Fragment>        
        }
      </Container>
    </Grid>
  )
}