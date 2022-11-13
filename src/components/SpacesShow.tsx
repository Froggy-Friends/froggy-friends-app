import { Twitter } from "@mui/icons-material";
import { Stack, Avatar, Typography, Link } from "@mui/material";
import { Space } from "../models/Space";

interface SpacesShowProps {
  key: number;
  space: Space;
}

export default function SpacesShow(props: SpacesShowProps) {
  const { key, space } = props;

  return (
    <Stack key={key} direction='row' spacing={8} alignItems='center'>
      <Stack id='pfp' alignItems='center' spacing={2}>
        <Avatar alt={space.host} src={space.hostAvatar} sx={{ width: 80, height: 80 }}/>
        <Link href={space.twitter} target="_blank" color='secondary'><Twitter/></Link>
      </Stack>
      <Stack id='titles' pb={2} minWidth={200}>
        <Typography variant='h4'>{space.name}</Typography>
        <Typography variant='subtitle1'>Hosted by {space.host}</Typography>
      </Stack>
      <Typography variant='h6' pb={2}>{space.timePST}</Typography>
      <Typography variant='h6' pb={2}>{space.timeEST}</Typography>
      <Typography variant='h6' pb={2}>{space.timeBST}</Typography>
      <Typography variant='h6' pb={2}>{space.timeAEST}</Typography>
    </Stack>
  )
}