import { useEffect, useState } from "react";
import useSound from 'use-sound';
import { makeStyles } from '@mui/styles';
import { Card, Box, CardContent, Typography, CardMedia, useTheme, Theme, createStyles } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { tracks } from "../data";
import { Track } from "../models/Track";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    player: {
      display: "flex",
      maxWidth: "fit-content",
      position: 'fixed',
      bottom: 0,
      left: 0,
      margin: theme.spacing(2)
    },
    playerBox: {
      display: 'flex', 
      flexDirection: 'column'
    }
  })
);

export default function MusicPlayer() {
  const classes = useStyles();
  const theme = useTheme();
  const [current, setCurrent] = useState(0);
  const [track, setTrack] = useState<Track>(tracks[current]);
  const [play, {stop, pause, sound}] = useSound(track.sound);
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
    <Card className={classes.player}>
      <Box className={classes.playerBox}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6" color="secondary">{track.name}</Typography>
          <Typography variant="subtitle1" color="secondary" component="div">{track.producer}</Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous" color="secondary" onClick={onPrevious}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton aria-label="play/pause" color="secondary" onClick={() => onToggle(!playing)}>
            { playing ? <PauseIcon sx={{ height: 38, width: 38 }}/> : <PlayArrowIcon sx={{ height: 38, width: 38 }} /> }
          </IconButton>
          <IconButton aria-label="next" color="secondary" onClick={onNext}>
            <SkipNextIcon />
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ maxWidth: 160 }}
        image={track.image}
        alt={track.name}
      />
    </Card>
  )
}