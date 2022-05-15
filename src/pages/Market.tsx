import { makeStyles } from '@mui/styles';
import { createStyles, Theme, Grid, Container, Typography, Box, Tab, Tabs, ToggleButton, ToggleButtonGroup, Paper } from "@mui/material";
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
      backgroundPosition: "center",
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
  const [filter, setFilter] = useState('active');

  const onFilterToggle = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string,
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

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
          <Grid id="left" xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid container alignItems="center" pb={1}>
              <Typography variant='h4' color='secondary' pr={1}>$RIBBIT Items</Typography>
              <ToggleButtonGroup
                color="primary"
                value={filter}
                exclusive
                onChange={onFilterToggle}
              >
                <ToggleButton value="active">Active</ToggleButton>
                <ToggleButton value="inactive">Inactive</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Box sx={{ flexGrow: 1, bgcolor: '#0000008a', display: 'flex', height: 500 }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                indicatorColor='primary'
                value={value}
                onChange={handleChange}
                aria-label="$RIBBIT Marketplace"
                sx={{ borderRight: 5, borderColor: 'divider' }}
              >
                <Tab label="Friends" {...a11yProps(0)} />
                <Tab label="Epic" {...a11yProps(1)} />
                <Tab label="Vito's Art" {...a11yProps(2)} />
                <Tab label="Allowlists" {...a11yProps(3)} />
                <Tab label="NFTs" {...a11yProps(4)} />
                <Tab label="Merch" {...a11yProps(5)} />
                <Tab label="Costumes" {...a11yProps(6)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Friends</Typography>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Epic</Typography>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Vito's Art</Typography>
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Allowlists</Typography>
              </TabPanel>
              <TabPanel value={value} index={4}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>NFTs</Typography>
              </TabPanel>
              <TabPanel value={value} index={5}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Merch</Typography>
              </TabPanel>
              <TabPanel value={value} index={6}>
                <Typography variant='h4' color='secondary' fontWeight='bold'>Costumes</Typography>
              </TabPanel>
            </Box>
          </Grid>
          <Grid id="right"  xl={2} lg={2} md={4} sm={4} xs={4}>

          </Grid>
        </Grid>
      </Container>
    </Grid>
  )
}