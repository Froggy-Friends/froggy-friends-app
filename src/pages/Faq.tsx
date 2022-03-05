import { makeStyles } from '@mui/styles';
import { Accordion, AccordionDetails, AccordionSummary, Container, createStyles, Grid, Theme, Typography } from "@mui/material";
import hills from '../images/hills.png';
import grass from '../images/grass.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    faq: {
      backgroundColor: theme.palette.success.main
    }
  })
);


export default function Faq() {
  const classes = useStyles();
  return (
    <Grid className={classes.faq} container direction='column'>
      <Grid item>
        <img className={classes.hills} alt='faq' src={hills} style={{width: '100%', marginTop: '-450px'}}/>  
      </Grid>
      <Grid item pt={20}>
        <Container maxWidth='lg'>
          <Grid container direction='column' alignItems='center'>
            <Grid item pb={10}>
              <Typography variant='h1' fontWeight='bold' textTransform='uppercase'>FAQs</Typography>  
            </Grid>
            <Grid item width={'100%'} pb={5}>
              <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant='h3' fontFamily='outfit'>Wen mint Froggies?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='h4' fontFamily='outfit'>3/18/22 2:30 PM PST</Typography>
                  </AccordionDetails>
              </Accordion>  
            </Grid>
            <Grid item width={'100%'} pb={5}>
              <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant='h3' fontFamily='outfit'>What is mint price ser?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='h4' fontFamily='outfit'>0.03 ETH per Froggy Friend</Typography>
                  </AccordionDetails>
              </Accordion>  
            </Grid>
            <Grid item width={'100%'} pb={5}>
              <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant='h3' fontFamily='outfit'>What is mint limit ser?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='h4' fontFamily='outfit'>2 Froggy Friend mints per wallet</Typography>
                  </AccordionDetails>
              </Accordion>  
            </Grid>
            <Grid item width={'100%'} pb={5}>
              <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant='h3' fontFamily='outfit'>Wen reveal?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='h4' fontFamily='outfit'>Froggy Friends reveal 4 days after mint</Typography>
                  </AccordionDetails>
              </Accordion>  
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid item>
        <img alt='grass' src={grass} style={{width: '100%'}}/>
      </Grid>
    </Grid>
  );
}
