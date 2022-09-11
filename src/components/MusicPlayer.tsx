import { useEffect, useState } from "react";
import { Card, Box, CardContent, Typography, CardMedia, Grid } from "@mui/material";
import { tracks, sprite } from "../data";
import { Track } from "../models/Track";
import { useAppDispatch } from "../redux/hooks";
import { togglePlay } from "../redux/musicSlice";
import useSound from 'use-sound';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import mix from "../tracks/mix.mp3";


export default function MusicPlayer() {
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(0);
  const [track, setTrack] = useState<Track>(tracks[current]);
  const [playing, setPlaying] = useState(false);
  const [songEnded, setSongEnded] = useState(false);
  const [play, {pause}] = useSound(mix, 
    { 
      id: tracks[current].id, 
      sprite: sprite,
      autoplay: true,
      onend: () => setSongEnded(true)
    }
  );

  useEffect(() => {
    if (songEnded) {
      setSongEnded(false);
      setPlaying(true);
      onNext();
    }
  }, [songEnded]);

  const onPlayToggle = (playToggle: boolean) => {
    if (playToggle) {
      play({id: track.id});
      setPlaying(playToggle);
      dispatch(togglePlay({isPlaying: true}));
    } else {
      pause();
      setPlaying(playToggle);
      dispatch(togglePlay({isPlaying: false}));
    }
  }

  const onPrevious = () => {
    // pause previuos track
    if (playing) {
      pause();
    }

    let newTrack;
    // skip to end of playlist
    if (current === 0) {
      newTrack = tracks[tracks.length - 1];
      setCurrent(tracks.length - 1);
      setTrack(newTrack);
    }
    // skip to previous track of playlist
    else {
      newTrack = tracks[current - 1];
      setCurrent(current - 1);
      setTrack(newTrack);
    }

    // auto play previous track if user is listenting to music
    if (playing) {
      play({id: newTrack.id});
    }
  }

  const onNext = () => {
    // pause previous track
    if (playing) {
      pause();
    }

    let newTrack;
    // skip to beginning of playlist
    if (current === tracks.length -1) {
      newTrack = tracks[0];
      setCurrent(0);
      setTrack(newTrack);
    }
    // skip to next track of playlist
    else {
      newTrack = tracks[current + 1];
      setCurrent(current + 1);
      setTrack(newTrack);
    }

    // auto play next track if user is listening to music
    if (playing) {
      play({id: newTrack.id});
    }
  }

  return (
    <Card sx={{ display: 'flex', maxWidth: 440, zIndex: 1 }}>
      <Grid container direction='column' minWidth={200} maxWidth={220}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6" color="secondary">{track.name}</Typography>
          <Typography variant="subtitle1" color="secondary" component="div">{track.producer}</Typography>
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton aria-label="previous" color="secondary" onClick={onPrevious}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton aria-label="play/pause" color="secondary" onClick={() => onPlayToggle(!playing)}>
            { playing ? <StopIcon sx={{ height: 38, width: 38 }}/> : <PlayArrowIcon sx={{ height: 38, width: 38 }} /> }
          </IconButton>
          <IconButton aria-label="next" color="secondary" onClick={onNext}>
            <SkipNextIcon />
          </IconButton>
        </Box>
      </Grid>
      <CardMedia component="img" sx={{ height: 150, maxWidth: 150 }} image={track.image} alt={track.name}/>
    </Card>
  )
}
