import { ExpandMore, Search } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Container, Grid, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";


export default function Studio() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Grid id='studio' container direction='column' justifyContent='start' minHeight={800} pt={10}>
      <Container maxWidth='xl' sx={{pt: 5, pb: 5}}>
        <Typography color='secondary' variant='h3'>Froggy Studio</Typography>

        <Grid id='panel' container spacing={theme.spacing(8)}>
          <Grid id='selections' item xl={4}>
            <Stack pt={5}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                  <Typography color='secondary' variant='h5'>Owned Frogs</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <TextField placeholder='Search items by name' fullWidth 
                  InputProps={{endAdornment: (<IconButton><Search/></IconButton>)}}
                  value={search} onChange={onSearch}
                />
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Grid>
          <Grid id='preview' item xl={8}>
            <Stack pt={5}>
              <Typography color='secondary' variant='h5'>Preview</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Grid>

  )
}