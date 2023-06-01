import { Card, CardHeader, CardMedia, CardActions, Button, useTheme, useMediaQuery } from "@mui/material";

interface TraitCardProps {
  title: string;
  image: string;
  disabled: boolean;
  onTraitClick: () => void;
}

export default function TraitCard({title, image, disabled, onTraitClick}: TraitCardProps) {
  const theme = useTheme();
  const mobileXs = useMediaQuery(theme.breakpoints.down('xs'));
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const tablet = useMediaQuery(theme.breakpoints.down('md'));
  const desktop = useMediaQuery(theme.breakpoints.down('xl'));

  const getHeaderMaxWidth = (): number => {
    if (mobileXs) return 60;
    if (mobile) return 70;
    if (tablet) return 150;
    if (desktop) return 80;
    return 80;
  }

  return (
    <Card className="blend" elevation={0}>
      <CardHeader title={title} titleTypographyProps={{variant: 'body2', sx: {maxWidth: getHeaderMaxWidth(), whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis'} }}/>
      <CardMedia component='img' src={image} alt='' sx={{backgroundColor: '#93d0aa', borderRadius: 25}}/>
      <CardActions sx={{display: 'flex', justifyContent: 'center'}}>
      { !disabled && <Button color="primary" variant='outlined' onClick={onTraitClick}>Apply</Button> }
      </CardActions>
    </Card>
  )
}