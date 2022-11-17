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

  useEffect(() => {
    async function getSpacesCalendar() {
      const spacesCalendar = (await axios.get<SpacesCalendar>(`${process.env.REACT_APP_API}/spaces`)).data;
      setCalendar(spacesCalendar);
    }

    getSpacesCalendar();
  })

  useEffect(() => {
    async function getScheduledShows() {
      const shows = (await axios.get<ScheduledSpace[]>(`${process.env.REACT_APP_API}/spaces/scheduled`)).data;
      console.log("shows: ", shows);
    }
    
    getScheduledShows();
  });

  return (
    <Grid id='spaces' container direction='column' justifyContent='start' minHeight={800} pt={8}>
      <Paper elevation={3}>
        <Grid id='banner' className={classes.banner} container height={isSm ? 300 : 600}/>
      </Paper>
      <Container maxWidth='xl' sx={{pt: 5, pb: 10}}>
        <Typography variant='h3'>Community Spaces</Typography>
        <Typography variant='subtitle1' pb={5}>Weekly twitter spaces hosted by community members.</Typography>
        {/* {
          calendar && Object.keys(calendar).map((cal, index) => (
            <Fragment>
              <Divider sx={{pb: 5}}>Monday</Divider>
              {
                calendar[`${cal}`].map((space, index) => (
                  <SpacesShow key={index} space={space}/>
                ))
              }
            </Fragment>
          ))
        } */}
        { 
          calendar?.monday &&
          <Fragment>
            <Divider sx={{pb: 5}}>Monday</Divider>
            {
              calendar.monday.map((space, index) => {
                return (
                  // <SpacesShow key={index} space={space}/>
                  <div>Hello</div>
                )
              })
            }
          </Fragment>        
        }
        {/* { 
          calendar?.tuesday &&
          <Fragment>
            <Divider sx={{pb: 5}}>Tuesday</Divider>
            {
              calendar.tuesday.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          calendar?.wednesday &&
          <Fragment>
            <Divider sx={{pb: 5}}>Wednesday</Divider>
            {
              calendar.wednesday.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          calendar?.thursday &&
          <Fragment>
            <Divider sx={{pb: 5}}>Thursday</Divider>
            {
              calendar.thursday.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          calendar?.friday &&
          <Fragment>
            <Divider sx={{pb: 5}}>Friday</Divider>
            {
              calendar.friday.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          calendar?.saturday &&
          <Fragment>
            <Divider sx={{pb: 5}}>Saturday</Divider>
            {
              calendar.saturday.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        }
        { 
          calendar?.sunday &&
          <Fragment>
            <Divider sx={{pb: 5}}>Sunday</Divider>
            {
              calendar.sunday.map((space, index) => (
                <SpacesShow key={index} space={space}/>
              ))
            }
          </Fragment>        
        } */}
      </Container>
    </Grid>
  )
}