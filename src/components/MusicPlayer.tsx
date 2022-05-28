import { useState } from "react";
import { Card, Box, CardContent, Typography, CardMedia } from "@mui/material";
import { tracks, sprite } from "../data";
import { Track } from "../models/Track";
import useSound from 'use-sound';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from '@mui/icons-material/SkipNext';
import mix from "../tracks/mix.mp3";

interface MusicPlayerProps {
  inverted: boolean;
}

export default function MusicPlayer(props: MusicPlayerProps) {
  const { inverted } = props;
  const [current, setCurrent] = useState(0);
  const [track, setTrack] = useState<Track>(tracks[current]);
  const [play, {pause}] = useSound(mix, { id: tracks[current].id, sprite: sprite});
  const [playing, setPlaying] = useState(false);

  const onPlayToggle = (playToggle: boolean) => {
    if (playToggle) {
      play({id: track.id});
      setPlaying(playToggle);
    } else {
      pause();
      setPlaying(playToggle);
    }
  }

  const onPrevious = () => {
    // end of playlist, start from beginning
    let newCurrent;
    let newTrack;
    if (current === 0) {
      newCurrent = tracks.length-1;
      newTrack = tracks[newCurrent];
      setCurrent(newCurrent);
      setTrack(tracks[newCurrent]);
      play({id: track.id})
    }
  }

  const onNext = () => {
    pause();
    let newCurrent;
    let newTrack;
    if (current === tracks.length -1) {
      console.log("skip next song end of playliist: ", current, track);
      newCurrent = 0;
      newTrack = tracks[0];
      setCurrent(newCurrent);
      setTrack(newTrack);
      play({id: newTrack.id});
    } else {
      console.log("skip next song: ", current, track);
      newCurrent = current + 1;
      newTrack = tracks[newCurrent];
      setCurrent(newCurrent);
      setTrack(newTrack);
      play({id: newTrack.id});
    }
  }

  return (
    <Card className={inverted ? "inverted" : ""} sx={{ display: 'flex', minWidth: 250 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 150 }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6" color={inverted ? "info" : "secondary"}>{track.name}</Typography>
          <Typography variant="subtitle1" color={inverted ? "info" : "secondary"} component="div">{track.producer}</Typography>
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton aria-label="previous" color={inverted ? "info" : "secondary"} onClick={onPrevious}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton aria-label="play/pause" color={inverted ? "info" : "secondary"} onClick={() => onPlayToggle(!playing)}>
            { playing ? <PauseIcon sx={{ height: 38, width: 38 }}/> : <PlayArrowIcon sx={{ height: 38, width: 38 }} /> }
          </IconButton>
          <IconButton aria-label="next" color={inverted ? "info" : "secondary"} onClick={onNext}>
            <SkipNextIcon />
          </IconButton>
        </Box>
      </Box>
      <CardMedia component="img" sx={{ width: 130 }} image={track.image} alt={track.name}/>
    </Card>
  )
}