import {
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import skyscrapers from "../images/skyscrapers.png";
import { useEffect, useState } from "react";
import { Leaderboard } from "../models/Leaderboard";
import axios from "axios";
import ribbit from "../images/ribbit.gif";
import { kFormatter, strToNum } from "../utils";
import { useEthers, useLookupAddress } from "@usedapp/core";

export default function BoardMobile() {
  const [leaders, setLeaders] = useState<Leaderboard[]>([]);
  const { account } = useEthers();
  const ens = useLookupAddress();
  const [userStats, setUserStats] = useState<Leaderboard>({
    account: "",
    ribbit: "",
    rank: 0,
  });

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const response = await axios.get<Leaderboard[]>(
          `${process.env.REACT_APP_API}/leaderboard`
        );
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
    if (ens) {
      const currUserStatsIdx = leaders.findIndex(
        (leader) => leader.account === ens || leader.account === account
      );
      setUserStats({ ...leaders[currUserStatsIdx], rank: currUserStatsIdx });
    }
  }, [ens, leaders]);

  return (
    <Grid id="leaderboard" container direction="column" pb={20}>
      <Paper elevation={3}>
        <Grid
          id="banner"
          container
          sx={{
            backgroundImage: `url(${skyscrapers})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: 600,
          }}
        />
      </Paper>
      <Container maxWidth="lg" sx={{ pt: 5 }}>
        <Grid
          item
          container
          wrap="nowrap"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" fontWeight="bold" pb={2}>
            Ribbit Leaderboard
          </Typography>
        </Grid>
        {userStats.rank && userStats.rank > 0 && (
          <Grid item container wrap="nowrap" alignItems="center" py={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mr: 2 }}>
              Rank #{userStats.rank}
            </Typography>
            <Typography variant="h6">{userStats.account}</Typography>
          </Grid>
        )}
        <Stack textAlign="left" spacing={2}>
          {leaders.map((leader, index) => (
            <Card
              sx={{ borderRadius: 2 }}
              className="blend"
              key={leader.account}
            >
              <CardContent>
                <Grid container width="100%" justifyContent="center">
                  <Grid container item>
                    <Grid item sx={{ mb: 1 }}>
                      <Typography variant="h5" fontWeight="bold">
                        Rank #{index + 1}
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      item
                      flexDirection="row"
                      alignItems="start"
                      flexWrap="nowrap"
                    >
                      <Grid
                        container
                        item
                        alignItems="center"
                        xs={2}
                        marginRight={4}
                        flexWrap="nowrap"
                      >
                        <img
                          src={ribbit}
                          style={{ height: 25, width: 25 }}
                          alt="ribbit"
                        />
                        <Typography variant="h6" pl={1}>
                          {kFormatter(strToNum(leader.ribbit))}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        overflow="hidden"
                        maxWidth="90%"
                        sx={{
                          paddingRight: 5,
                          textOverflow: "ellipsis",
                          overflow: leader.account.endsWith(".eth")
                            ? "visible"
                            : "hidden",
                          overflowWrap: leader.account.endsWith(".eth")
                            ? "break-word"
                            : "normal",
                        }}
                      >
                        <Link
                          href={`https://opensea.io/${leader.account}`}
                          variant="h6"
                          color="secondary"
                          underline="none"
                          target="_blank"
                          textAlign="right"
                        >
                          {leader.account}
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Grid>
  );
}
