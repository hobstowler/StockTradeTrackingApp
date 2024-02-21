import React from 'react';
import {Card, Container} from "@mui/material";
import {Box, useTheme} from "@mui/system";
import StockSearch from "./components/StockSearch";
import StockGraph from "./components/StockGraph";
import StockDetail from "./components/StockDetail";
import WatchListGroups from "../watch/components/WatchListGroups";

const Index = () => {
  const theme = useTheme()
  const md = theme.breakpoints.values['md']
  const lg = theme.breakpoints.values['lg']

    return (
      <Container className='stockTab' sx={{maxWidth: {xs: md, lg: lg}}}>
        <Container disableGutters sx={{flexGrow: 1, maxWidth: {xs: md, lg: lg}}}>
          <Card
            sx={{
              mt: '32px',
              mb: '24px',
              display: 'flex',
              mx: 'auto',
              maxWidth: {xs: '680px', lg: '100%'},
              flexDirection: {xs: 'column-reverse', lg: 'row'},
              alignItems: {xs: 'center', lg: 'inherit'},
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
              <StockSearch />
              <StockDetail />
            </Box>
            <WatchListGroups />
          </Card>
        </Container>
        <Box>
          <StockGraph />
        </Box>
      </Container>
    )
}

export default Index