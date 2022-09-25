import { makeStyles } from '@mui/styles';
import {  Container, createStyles, Grid, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography, useTheme } from "@mui/material";
import skyscrapers from "../images/skyscrapers.png";
import { useEffect, useState } from 'react';
import { Leaderboard } from '../models/Leaderboard';
import axios from 'axios';
import ribbit from '../images/ribbit.gif';
import { useEthers, useLookupAddress } from '@usedapp/core';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    leaderboardRow: {
      padding: 0,
      border: 0,
      '& td, th': {
        padding: '1rem 0',
        border: 0
      },
    },
  })
);

export default function Board() {
  const classes = useStyles();
  const [leaders, setLeaders] = useState<Leaderboard[]>([]);
  const {account} = useEthers();
  const ens = useLookupAddress();
  const [userStats, setUserStats] = useState<Leaderboard & {rank: number}>({account: "", ribbit: "", rank: 0});

  useEffect(() => {
    console.log(account)
    const getLeaderboard = async () => {
      try {
        const response = await axios.get<Leaderboard[]>(`${process.env.REACT_APP_API}leaderboard`);
        setLeaders(response.data);
      } catch (error) {
        console.log("leaderboard error: ", error);
      }
    };
    
    if (leaders.length === 0) {
      getLeaderboard();
    }
  }, []);

  useEffect(() => {
    if(ens) {
      const currUserStatsIdx = leaders.findIndex(leader => leader.account === ens);
      setUserStats({...leaders[currUserStatsIdx], rank: currUserStatsIdx})
    }
  }, [ens, leaders])

  useEffect(() => {
    console.log(userStats)
  }, [userStats]);

  return (
    <Grid id="leaderboard" container direction="column" pb={20}>
      <Paper elevation={3}>
        <Grid id='banner' container sx={{backgroundImage: `url(${skyscrapers})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 600}}/>
      </Paper>
      <Container maxWidth='lg' sx={{pt: 5}}>
        <Grid item container wrap='nowrap' justifyContent='space-between' alignItems='center'>
            <Typography variant="h4" sx={{fontWeight: 'bold'}}>Ribbit Leaderboard</Typography>
        </Grid>
        {userStats.rank > 0 && (
          <Grid item container wrap='nowrap' alignItems='center' sx={{py: 2}}>
            <Typography variant="h6" sx={{fontWeight: 'bold', mr: 2}}>Rank #{userStats.rank}</Typography>
            <Typography variant="h6">{userStats.account}</Typography>
          </Grid>
        )}
        <TableContainer component={Paper} sx={{mt: 5, height: "700px"}}>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow className={classes.leaderboardRow}>
                <TableCell><Typography variant='h5'>Rank</Typography></TableCell>
                <TableCell><Typography variant='h5'>Staker</Typography></TableCell>
                <TableCell><Typography variant='h5'>Ribbit Balance</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaders.map((leader, index) => (
                  <TableRow
                  key={leader.account}
                  className={classes.leaderboardRow}
                >
                  <TableCell>
                    <Typography variant='h6' color='secondary'># {index + 1}</Typography>
                  </TableCell>
                  <TableCell>
                    <Link href={`https://opensea.io/${leader.account}`} variant='h6' color='secondary' underline='none' target='_blank'>{leader.account}</Link>
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
      </Container>
    </Grid>
  )
}