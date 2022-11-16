import { Twitter } from "@mui/icons-material";
import { Stack, Avatar, Typography, Link, useTheme, useMediaQuery, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { Space } from "../models/Space";
import axios from 'axios';

interface ScheduledShows {
  id: string;
  title: string;
  state: 'scheduled' | 'live';
  scheduled_start: string;
}

interface SpacesShowProps {
  space: Space;
}

export default function SpacesShow(props: SpacesShowProps) {
  const { space } = props;
  const theme = useTheme();
  const [shows, setShows] = useState<ScheduledShows[]>([]);
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    async function getScheduledShows(twitterHandle: string) {
      const shows = (await axios.get<ScheduledShows[]>(`${process.env.REACT_APP_API}/spaces/${twitterHandle}`)).data;
      console.log("shows: ", shows);
      setShows(shows);
    }

    if (space.handle) {
      console.log("get scheduled shows for handle: ", space.handle);
      getScheduledShows(space.handle);
    }
  }, [space]);

  return (
    <Stack direction='row' spacing={8} alignItems='center' pb={5}>
      <Stack id='pfp' alignItems='center' spacing={2}>
        <Avatar alt={space.host} src={space.hostAvatar} sx={{ width: 80, height: 80 }}/>
        <Link href={space.twitter} target="_blank" color='secondary'><Twitter/></Link>
      </Stack>
      <Stack direction={isMd ? 'column' : 'row'} spacing={isSm ? 2 : 8} alignItems={isSm ? 'start' : 'center'} pb={2}>
        <Stack id='titles'>
          <Typography variant='h4'>{space.name}</Typography>
          <Typography variant='subtitle1'>Hosted by {space.host}</Typography>
          <Stack id='times' direction={isSm ? 'column' : 'row'} pt={2} spacing={2} width='fit-content'>
            <Chip label={space.timePST}/>
            <Chip label={space.timeEST}/>
            <Chip label={space.timeBST}/>
            <Chip label={space.timeAEST}/>
            <Chip label={space.timeKST}/>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}