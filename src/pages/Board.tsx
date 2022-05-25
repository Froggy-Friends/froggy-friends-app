import { makeStyles } from '@mui/styles';
import { createStyles, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import skyscrapers from "../images/skyscrapers.png";
import { useEffect, useState } from 'react';
import { Leaderboard } from '../models/Leaderboard';
import axios from 'axios';
import ribbit from '../images/ribbit.gif';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    leaderboard: {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, 0)), url(${skyscrapers})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: '110%',
      direction: 'column',
      justifyContent: "center"
    }
  })
);

export default function Board() {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [leaders, setLeaders] = useState<Leaderboard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Leaderboard[]>(`${process.env.REACT_APP_API}/leaderboard`);
        console.log("response: ", response);
        setLeaders(response.data);
        setLoading(false);
      } catch (error) {
        console.log("leaderboard error: ", error);
        // setAlertMessage("Issue fetching froggies owned");
        // setShowAlert(true);
        setLoading(false);
      }
    };
    
    if (leaders.length === 0) {
      console.log("get leaderboard...");
      getLeaderboard();
    }
  }, [leaders]);

  return (
    <Grid id="leaderboard" container className={classes.leaderboard} pt={10}>
      <Grid id="items" container item m={5} xl={6} lg={10} md={12} sm={12} xs={12}>
        <TableContainer component={Paper} sx={{maxHeight: isDesktop ? 550 : 850}}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><Typography variant='h5'>Rank</Typography></TableCell>
                <TableCell><Typography variant='h5'>Staker</Typography></TableCell>
                <TableCell><Typography variant='h5'>Ribbit</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaders.map((leader, index) => (
                <TableRow
                  key={leader.account}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant='h6' color='secondary'>{index+1}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='h6' color='secondary'>{leader.account}</Typography>
                  </TableCell>
                  <TableCell>
                    <Grid container alignItems="center" minWidth={200}>
                      <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                      <Typography variant='h6' color='secondary' pl={1}>{leader.ribbit}</Typography>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}