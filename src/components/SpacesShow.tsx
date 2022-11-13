import { Twitter } from "@mui/icons-material";
import { Stack, Avatar, Typography, Link, useTheme, useMediaQuery } from "@mui/material";
import { Space } from "../models/Space";

interface SpacesShowProps {
  key: number;
  space: Space;
}

export default function SpacesShow(props: SpacesShowProps) {
  const { key, space } = props;
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Stack key={key} direction='row' spacing={8} alignItems='center' pb={5}>
      <Stack id='pfp' alignItems='center' spacing={2}>
        <Avatar alt={space.host} src={space.hostAvatar} sx={{ width: 80, height: 80 }}/>
        <Link href={space.twitter} target="_blank" color='secondary'><Twitter/></Link>
      </Stack>
      <Stack direction={isSm ? 'column' : 'row'} spacing={isSm ? 2 : 8} alignItems='center' pb={2}>
        <Stack id='titles' minWidth={isXs ? 0 : 200}>
          <Typography variant='h4'>{space.name}</Typography>
          <Typography variant='subtitle1'>Hosted by {space.host}</Typography>
        </Stack>
        <Typography variant='h6'>{space.timePST}</Typography>
        <Typography variant='h6'>{space.timeEST}</Typography>
        <Typography variant='h6'>{space.timeBST}</Typography>
        <Typography variant='h6'>{space.timeAEST}</Typography>
      </Stack>
    </Stack>
  )
}