import { Twitter } from "@mui/icons-material";
import { Stack, Avatar, Typography, Link, useTheme, useMediaQuery, Chip } from "@mui/material";
import { Space } from "../models/Spaces";

interface SpacesShowProps {
  space: Space;
}

export default function SpacesShow(props: SpacesShowProps) {
  const { space } = props;
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack direction='row' spacing={8} alignItems='center' pb={5}>
      <Stack id='pfp' alignItems='center' spacing={2}>
        <Avatar alt={space.host.name} src={space.host.avatar} sx={{ width: 80, height: 80 }}/>
        <Link href={space.host.twitterUrl} target="_blank" color='secondary'><Twitter/></Link>
      </Stack>
      <Stack direction={isMd ? 'column' : 'row'} spacing={isSm ? 2 : 8} alignItems={isSm ? 'start' : 'center'} pb={2}>
        <Stack id='titles'>
          <Typography variant='h4'>{space.name}</Typography>
          <Typography variant='subtitle1'>Hosted by {space.host}</Typography>
          <Stack id='times' direction={isSm ? 'column' : 'row'} pt={2} spacing={2} width='fit-content'>
            <Chip label={space.times.pst}/>
            <Chip label={space.times.est}/>
            <Chip label={space.times.gmt}/>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}