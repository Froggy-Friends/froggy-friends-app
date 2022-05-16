import { makeStyles } from '@mui/styles';
import { Card, Box, CardContent, Typography, CardMedia, useTheme, Theme, createStyles } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    player: {
      display: "flex",
      maxWidth: 200,
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

  return (
    <Card className={classes.player}>
      <Box className={classes.playerBox}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            Live From Space
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            Mac Miller
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="/static/images/cards/live-from-space.jpg"
        alt="Live from space album cover"
      />
    </Card>
  )
}