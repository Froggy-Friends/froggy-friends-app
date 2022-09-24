import { makeStyles } from '@mui/styles';
import { Card, CardContent, Container, createStyles, Grid, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import skyscrapers from "../images/skyscrapers.png";
import { useEffect, useState } from 'react';
import { Leaderboard } from '../models/Leaderboard';
import axios from 'axios';
import ribbit from '../images/ribbit.gif';
import { kFormatter, strToNum } from '../utils';
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
    leaderboardCard: {
      margin: "1rem 0",
      padding: 2,
      borderRadius: 0,
      overflow: "hidden",
      '& *': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
    }
  })
);

export default function Board() {
  const classes = useStyles();
  const theme = useTheme();
  const [leaders, setLeaders] = useState<Leaderboard[]>([]);
  const {account} = useEthers();
  const ens = useLookupAddress();
  const [userStats, setUserStats] = useState<Leaderboard & {rank: number}>({account: "", ribbit: "", rank: 0});
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        {isMobile 
        ? (
          <Grid item container textAlign="left">
            {leaders.map((leader, index) => (
              <Card sx={{ minWidth: "100%", borderRadius: 2 }} className={classes.leaderboardCard} key={leader.account}>
                <CardContent className={classes.leaderboardCardContent}>
                  <Grid container minWidth="100%" justifyContent="center">
                    <Grid container item maxWidth="90%">
                      <Grid item sx={{mb: 1}}>
                        <Typography variant='h5' fontWeight="bold">Rank #{index + 1}</Typography>
                      </Grid>
                      <Grid container item flexDirection="row" alignItems="start" flexWrap="nowrap">
                        <Grid container item alignItems="center" xs={2} marginRight={4} flexWrap="nowrap">
                          <img src={ribbit} style={{height: 25, width: 25}} alt='ribbit'/>
                          <Typography variant='h6' pl={1}>{kFormatter(strToNum(leader.ribbit))}</Typography>
                        </Grid>
                        <Grid item overflow="hidden" maxWidth="90%" sx={{paddingRight: 5, textOverflow: "ellipsis", overflow: leader.account.endsWith(".eth") ? "visible" : "hidden", overflowWrap: leader.account.endsWith(".eth") ? "break-word": "normal"}}>
                          <Link href={`https://opensea.io/${leader.account}`} variant='h6' color='secondary' underline='none' target='_blank' textAlign="right">{leader.account}</Link>
                        </Grid>
                      </Grid>  
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
        )
        : (
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
        )}
      </Container>
    </Grid>
  )
}