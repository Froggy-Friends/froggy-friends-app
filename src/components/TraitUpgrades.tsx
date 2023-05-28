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
import { Button, Link, Tooltip, Typography, useTheme } from '@mui/material';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';

declare var window: any;

export default function TraitUpgrades() {
  const theme = useTheme();
  const { account } = useEthers();
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);

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

  const retryUpgrade = async (upgrade: Upgrade) => {
    console.log("retry upgrade: ", upgrade);

    try {
      let data = {
        account: account,
        upgradeId: upgrade.id,
        retry: true
      };

      const apiUrl = process.env.REACT_APP_API;
      // prompt admin signature
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const message = JSON.stringify(data);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      const upgradeRequest = {...data, message: message, signature: signature};
      const results = (await axios.post<Upgrade>(`${apiUrl}/upgrades/retry`, upgradeRequest)).data;
      console.log("retry upgrade result: ", results);
    } catch (error) {
      console.log("retry upgrade error: ", error);
    }
  }

  return (
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
  )
}