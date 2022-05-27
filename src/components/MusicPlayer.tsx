import { useState } from "react";
import useSound from 'use-sound';
import { makeStyles } from '@mui/styles';
import { Card, Box, CardContent, Typography, Theme, createStyles, CardMedia } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { tracks } from "../data";
import { Track } from "../models/Track";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({

  })
);

export default function MusicPlayer() {
  const classes = useStyles();
  const [current, setCurrent] = useState(0);
  const [track, setTrack] = useState<Track>(tracks[current]);
  const [play, {pause}] = useSound(track.sound);
  const [playing, setPlaying] = useState(false);

  const onToggle = (isPlaying: boolean) => {
    isPlaying ? play() : pause();
    setPlaying(isPlaying);
  }

  const onPrevious = () => {
    // end of playlist, start from beginning
    if (current === 0) {
      setCurrent(tracks.length-1);
      setTrack(tracks[tracks.length-1]);
      // play({id: track.id})
    }
  }

  const onNext = () => {
    if (current === tracks.length -1) {
      setCurrent(0);
      setTrack(tracks[0]);
      // play({id: track.id})
    }
  }

  return (
    <Card className="inverted" sx={{ display: 'flex', minWidth: 250 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 150 }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6" color="info">{track.name}</Typography>
          <Typography variant="subtitle1" color="info" component="div">{track.producer}</Typography>
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton aria-label="previous" color="info" onClick={onPrevious}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton aria-label="play/pause" color="info" onClick={() => onToggle(!playing)}>
            { playing ? <PauseIcon sx={{ height: 38, width: 38 }}/> : <PlayArrowIcon sx={{ height: 38, width: 38 }} /> }
          </IconButton>
          <IconButton aria-label="next" color="info" onClick={onNext}>
            <SkipNextIcon />
          </IconButton>
        </Box>
      </Box>
      <CardMedia component="img" sx={{ width: 130 }} image={track.image} alt={track.name}/>
    </Card>
  )
}