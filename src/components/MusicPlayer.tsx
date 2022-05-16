import { useState } from "react";
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
  const [track, setTrack] = useState<Track>(tracks[0]);
  const [play, {stop, pause}] = useSound(track.sound);
  const [playing, setPlaying] = useState(false);

  const onToggle = (isPlaying: boolean) => {
    isPlaying ? play() : pause();
    setPlaying(isPlaying);
  }

  return (
    <Card className={classes.player}>
      <Box className={classes.playerBox}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6" color="secondary">{track.name}</Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous" color="secondary">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause" color="secondary" onClick={() => onToggle(!playing)}>
            { playing ? <PauseIcon sx={{ height: 38, width: 38 }}/> : <PlayArrowIcon sx={{ height: 38, width: 38 }} /> }
          </IconButton>
          <IconButton aria-label="next" color="secondary">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ maxWidth: 200 }}
        image={track.image}
        src="img"
        alt={track.name}
      />
    </Card>
  )
}