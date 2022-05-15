import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Container, Typography, Box, Tab, Tabs } from "@mui/material";
import market from "../images/market.png";
import { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    market: {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0, 0, 0, 0.1)), url(${market})`,
      backgroundColor: '#000000',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: '100%'
    }
  })
);


export default function Market() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid id="market" className={classes.market} container direction="column" pb={30}>
      <Container maxWidth="xl">
        <Grid container direction='column' textAlign='center' pt={10}>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12} pb={8}>
            <Typography variant='h2' color='secondary' fontWeight='bold'>$RIBBIT Marketplace</Typography>
          </Grid>
        </Grid>
        <Grid container pt={10} pb={10}>
          <Grid id="left" xl={8} lg={8} md={12} sm={12} xs={12}>
            <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 500 }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                <Tab label="Item One" {...a11yProps(0)} />
                <Tab label="Item Two" {...a11yProps(1)} />
                <Tab label="Item Three" {...a11yProps(2)} />
                <Tab label="Item Four" {...a11yProps(3)} />
                <Tab label="Item Five" {...a11yProps(4)} />
                <Tab label="Item Six" {...a11yProps(5)} />
                <Tab label="Item Seven" {...a11yProps(6)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                Item One
              </TabPanel>
              <TabPanel value={value} index={1}>
                Item Two
              </TabPanel>
              <TabPanel value={value} index={2}>
                Item Three
              </TabPanel>
              <TabPanel value={value} index={3}>
                Item Four
              </TabPanel>
              <TabPanel value={value} index={4}>
                Item Five
              </TabPanel>
              <TabPanel value={value} index={5}>
                Item Six
              </TabPanel>
              <TabPanel value={value} index={6}>
                Item Seven
              </TabPanel>
            </Box>
          </Grid>
          <Grid id="right"  xl={4} lg={4} md={4} sm={4} xs={4}>

          </Grid>
        </Grid>
      </Container>
    </Grid>
  )
}