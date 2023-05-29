import { Close, Search } from "@mui/icons-material";
import { Button, IconButton, Link, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Upgrade } from "../../models/Upgrade";
import { getDate } from "../../utils";

export default function SearchUpgrades() {
  const theme = useTheme();
  const [frogId, setFrogId] = useState('');
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [loadedUpgrades, setLoadedUpgrades] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  
  const onFrogIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrogId(event.target.value);
  };

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  const onSearchSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setUpgrades([]);
      setLoadedUpgrades(false);
      const apiUrl = process.env.REACT_APP_API;
      const fetchedUpgrades = (await axios.get<Upgrade[]>(`${apiUrl}/upgrades/frog/${frogId}`)).data;
      setUpgrades(fetchedUpgrades);
      setLoadedUpgrades(true);
    } catch (error) {
      setUpgrades([]);
      setLoadedUpgrades(true);
      setAlertMessage('Error starting upgrade ' + error);
      setShowAlert(true);
    }
  }

  return (
    <Stack spacing={5}>
      <Typography variant='h4'>Search Upgrades</Typography>
      <form onSubmit={onSearchSubmit}>
        <TextField placeholder='Search by frog ID' value={frogId} onChange={onFrogIdChange} InputProps={{endAdornment: (<IconButton type="submit"><Search/></IconButton>)}}/>
      </form>
      {
        upgrades.length > 0 &&
        <TableContainer component={Paper} sx={{backgroundColor: theme.palette.secondary.main}}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{color: theme.palette.background.default}}>Frog ID</TableCell>
                <TableCell sx={{color: theme.palette.background.default}} align="right">Trait Name</TableCell>
                <TableCell sx={{color: theme.palette.background.default}} align="right">Status</TableCell>
                <TableCell sx={{color: theme.palette.background.default}} align="right">Date</TableCell>
                <TableCell sx={{color: theme.palette.background.default}} align="right">Wallet</TableCell>
                <TableCell sx={{color: theme.palette.background.default}} align="right">Transaction</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {upgrades.map((upgrade) => (
                <TableRow key={upgrade.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: theme.palette.primary.main }}>
                  <TableCell sx={{color: theme.palette.background.default}}>{upgrade.frogId}</TableCell>
                  <TableCell sx={{color: theme.palette.background.default}} align="right">{upgrade.traitName}</TableCell>
                  <TableCell sx={{color: theme.palette.background.default}} align="right">{upgrade.isComplete ? 'Complete' : upgrade.isPending ? 'Pending' : 'Failed'}</TableCell>
                  <TableCell sx={{color: theme.palette.background.default}} align="right">{getDate(upgrade.date)}</TableCell>
                  <TableCell sx={{color: theme.palette.background.default}} align="right">
                    <Tooltip title={upgrade.wallet} style={{cursor: 'pointer'}}>
                      <Typography variant='inherit'>
                        {upgrade.wallet.substring(0, 4)}.....{upgrade.wallet.substring(upgrade.wallet.length - 3)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{color: theme.palette.background.default}} align="right">
                    <Tooltip title={upgrade.transaction} style={{cursor: 'pointer'}}>
                      <Link variant='inherit' href={`${process.env.REACT_APP_ETHERSCAN}/tx/${upgrade.transaction}`} target="_blank">
                        {upgrade.transaction.substring(0, 4)}.....{upgrade.transaction.substring(upgrade.transaction.length - 4)}
                      </Link>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
      {
        loadedUpgrades && upgrades.length === 0 && <Typography>There are no search results for frog {frogId} please try a different frog ID</Typography>
      }
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
    </Stack>
  )
}