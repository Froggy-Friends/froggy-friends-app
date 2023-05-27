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
import { Button } from '@mui/material';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function TraitUpgrades() {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);

  useEffect(() => {
    const fetchUpgrades = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API;
        const results = (await axios.get<Upgrade[]>(`${apiUrl}/upgrades/pending`)).data;
        console.log("upgrades: ", results);
        setUpgrades(results);
      } catch (error) {
        console.log("fetch upgrades error: ", error);
      }
    }
    fetchUpgrades();
  }, [])

  return (
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Frog ID</TableCell>
          <TableCell align="right">Trait Name</TableCell>
          <TableCell align="right">Upgrade State</TableCell>
          <TableCell align="right">Date</TableCell>
          <TableCell align="right">Retry</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {upgrades.map((upgrade) => (
          <TableRow key={upgrade.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>{upgrade.frogId}</TableCell>
            <TableCell align="right">{upgrade.traitName}</TableCell>
            <TableCell align="right">{upgrade.isComplete ? 'Complete' : upgrade.isPending ? 'Pending' : 'Failed'}</TableCell>
            <TableCell align="right">{getDate(upgrade.date)}</TableCell>
            <TableCell align="right">
              { upgrade.isPending ? <Button>Retry</Button> : ''}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  )
}