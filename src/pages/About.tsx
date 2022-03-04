import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Theme, Typography } from "@mui/material";

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    about: {
      backgroundColor: theme.palette.common.white
    }
  })
);


export default function About() {
  const classes = useStyles();
  return (
    <Grid className={classes.about} container direction='column' alignItems='center' mt={-1} pt={10}>
      <Typography variant='h1' textTransform='uppercase'>About</Typography>
    </Grid>
  );
}
