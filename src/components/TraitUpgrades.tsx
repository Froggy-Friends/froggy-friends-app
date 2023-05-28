import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { Upgrade } from '../models/Upgrade';
import { getDate } from '../utils';
import { Button, IconButton, Link, Snackbar, Tooltip, Typography, useTheme } from '@mui/material';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import { TraitUpgradeRequest } from '../models/TraitUpgradeRequest';
import { Close } from '@mui/icons-material';

declare var window: any;

export default function TraitUpgrades() {
  const theme = useTheme();
  const { account } = useEthers();
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchUpgrades = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API;
        const results = (await axios.get<Upgrade[]>(`${apiUrl}/upgrades/pending`)).data;
        setUpgrades(results);
      } catch (error) {
        console.log("fetch upgrades error: ", error);
      }
    }
    fetchUpgrades();
  }, [])

  const onAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowAlert(false);
  };

  const retryUpgrade = async (upgrade: Upgrade) => {
    try {
      let data = {
        account: `${account}`,
        upgradeId: upgrade.id,
        frogId: upgrade.frogId,
        traitId: upgrade.traitId,
        transaction: upgrade.transaction
      };

      const apiUrl = process.env.REACT_APP_FROGGY_FACTORY;
      // prompt admin signature
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const message = JSON.stringify(data);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      const upgradeRequest: TraitUpgradeRequest = {...data, message: message, signature: signature};
      const response = (await axios.post<Upgrade>(`${apiUrl}/upgrade/retry`, upgradeRequest));
      if (response.status === 201) {
        setAlertMessage('Item created');
        setShowAlert(true);
      }

    } catch (error) {
      setAlertMessage('Error retrying upgrade ' + error);
      setShowAlert(true);
    }
  }

  return (
    <>
    <TableContainer component={Paper} sx={{backgroundColor: theme.palette.secondary.main}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{color: theme.palette.background.default}}>Frog ID</TableCell>
            <TableCell sx={{color: theme.palette.background.default}} align="right">Trait Name</TableCell>
            <TableCell sx={{color: theme.palette.background.default}} align="right">Upgrade State</TableCell>
            <TableCell sx={{color: theme.palette.background.default}} align="right">Date</TableCell>
            <TableCell sx={{color: theme.palette.background.default}} align="right">Wallet</TableCell>
            <TableCell sx={{color: theme.palette.background.default}} align="right">Transaction</TableCell>
            <TableCell sx={{color: theme.palette.background.default}} align="center">Retry</TableCell>
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
              <TableCell align="center">
                { upgrade.isPending ? <Button variant='contained' onClick={() => retryUpgrade(upgrade)}>Retry</Button> : ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
   </TableContainer>
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
    </>
  )
}