import { Twitter } from "@mui/icons-material";
import { Stack, Avatar, Typography, Link, useTheme, useMediaQuery, Chip, Box } from "@mui/material";

interface SpacesShowProps {
  name: string;
  hostName: string;
  bannerUrl?: string;
  avatar: string;
  twitterUrl: string;
  pst: string;
  est: string;
  gmt: string;
}

export default function SpacesShow(props: SpacesShowProps) {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack direction={isSm ? 'column' : 'row'} spacing={4} justifyContent='center' alignItems='center' pb={5}>
      <Stack id='pfp' alignItems='center' spacing={2}>
        <Avatar alt={props.name} src={props.avatar} sx={{ width: 80, height: 80 }}/>
        <Link href={props.twitterUrl} target="_blank" color='secondary'><Twitter/></Link>
      </Stack>
      <Stack direction={isMd ? 'column' : 'row'} spacing={isSm ? 2 : 8} pb={2} minWidth={300}>
        <Stack id='titles' alignItems='center'>
          <Typography variant='h4'>{props.name}</Typography>
          <Typography variant='subtitle1'>Hosted by {props.hostName}</Typography>
          <Stack id='times' direction='row' pt={2} spacing={2} width='fit-content'>
            <Chip label={props.pst}/>
            <Chip label={props.est}/>
            <Chip label={props.gmt}/>
          </Stack>
        </Stack>
      </Stack>
      <Stack id='banner' alignItems='center' width='100%' sx={{display: isMd ? 'none' : 'default'}}>
        <Box component='img' src={props.bannerUrl} height={250} minWidth={500}/>
      </Stack>
    </Stack>
  )
}