import { Close, ExpandMore, Search } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, CardMedia, Container, Grid, IconButton, Paper, Snackbar, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { Owned } from '../models/Owned';
import useDebounce from "../hooks/useDebounce";
import axios from "axios";
import { RibbitItem } from "../models/RibbitItem";


export default function Studio() {
  const theme = useTheme();
  const { account } = useEthers();
  const [search, setSearch] = useState('');
  const [frogs, setFrogs] = useState<Owned>({froggies:[], totalRibbit: 0, allowance: 0, isStakingApproved: false});
  const [friends, setFriends] = useState<RibbitItem[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<any>(undefined);
  const debouncedSearch = useDebounce(search, 500);
  console.log("owned: ", frogs);
  console.log("friends: ", friends);

  useEffect(() => {
    async function getFroggiesOwned(address: string) {
      try {
        const frogs = (await axios.get(`${process.env.REACT_APP_API}/owned/${address}`)).data;
        const friends = (await axios.get<RibbitItem[]>(`${process.env.REACT_APP_API}/owned/friends/${account}`)).data;
        setFrogs(frogs);
        setFriends(friends);
      } catch (error) {
        setAlertMessage("Issue fetching froggies owned");
        setShowAlert(true);
      }
    }

    if (account) {
      getFroggiesOwned(account);
    }
  }, [account])

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  return (
    <Grid id='studio' container direction='column' justifyContent='start' minHeight={800} pt={10}>
      <Container maxWidth='xl' sx={{pt: 5, pb: 5}}>
        <Typography color='secondary' variant='h3' pb={5}>Froggy Studio</Typography>

        <Grid id='panel' container spacing={theme.spacing(8)}>
          <Grid id='selections' item xl={4}>
            <Stack>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                  <Stack>
                  <Typography color='secondary' variant='h5'>Owned Frogs</Typography>
                  <Typography color='secondary' variant='subtitle1'>Select a frog to get started</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField placeholder='Search items by name' fullWidth sx={{pb: 5}}
                    InputProps={{endAdornment: (<IconButton><Search/></IconButton>)}}
                    value={search} onChange={onSearch}
                  />
                  <Grid container spacing={2} pb={5} maxHeight={300} overflow='scroll'>
                  {
                    frogs.froggies.map(frog => {
                      return <Grid key={frog.edition} item spacing={2} xl={3}>
                        <Card>
                          <CardMedia component='img' src={frog.image} height={100} alt=''/>
                          <CardContent sx={{padding: 2}}>
                            <Typography variant="body1">#{frog.edition}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    })
                  }
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Grid>
          <Grid id='preview' item xl={8}>
            <Paper sx={{padding: 2}}>
              <Stack minHeight={500}>
                <Typography color='secondary' variant='h5'>Preview</Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={showAlert} 
        autoHideDuration={5000} 
        message={alertMessage} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={onAlertClose}
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={onAlertClose}>
            <Close fontSize='small' />
          </IconButton>
        }
      />
    </Grid>

  )
}