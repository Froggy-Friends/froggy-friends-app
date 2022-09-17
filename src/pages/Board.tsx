import { makeStyles } from '@mui/styles';
import { Container, createStyles, Grid, IconButton, InputBase, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import skyscrapers from "../images/skyscrapers.png";
import { useEffect, useState } from 'react';
import { Leaderboard } from '../models/Leaderboard';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import ribbit from '../images/ribbit.gif';

const useStyles: any = makeStyles((theme: Theme) => 
  createStyles({
    leaderboardRow: {
      padding: 0,
      border: 0,
      '& td, th': {
        padding: '1rem 0',
        border: 0
      },

      '& th, h5': {
        fontWeight: 'bold'
      }
    },
    leaderboardSearch: {
      border: '1px solid white',
      borderRadius: '0.5rem',
    },
  })
);

export default function Board() {
  const classes = useStyles();
  const theme = useTheme();
  const [leaders, setLeaders] = useState<Leaderboard[]>([]);

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const response = await axios.get<Leaderboard[]>(`${process.env.REACT_APP_API}/leaderboard`);
        setLeaders(response.data);
      } catch (error) {
        console.log("leaderboard error: ", error);
      }
    };
    
    if (leaders.length === 0) {
      getLeaderboard();
    }
  }, [leaders]);

  return (
    <Grid id="leaderboard" container direction="column" pb={20}>
      <Paper elevation={3}>
        <Grid id='banner' container sx={{backgroundImage: `url(${skyscrapers})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 600}}/>
      </Paper>
      <Container maxWidth='lg' sx={{pt: 5}}>
        <Grid item container wrap='nowrap' justifyContent='space-between' alignItems='center'>
          <Grid item>
            <Typography variant="h4" sx={{fontWeight: 'bold'}}>Ribbit Leaderboard</Typography>
          </Grid>
          <Grid item container className={classes.leaderboardSearch} width='30%' sx={{px: 2}}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search by address"
              inputProps={{ 'aria-label': 'search leaderboard' }}
            />
            <IconButton type="button" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
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
                    <Typography variant='h6' color='secondary'># {index+1}</Typography>
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