import React from 'react';
import {Container} from "@mui/material";
import {Box} from "@mui/system";
import StockKeyIndicators from "./components/StockKeyIndicators";
import StockSearch from "./components/StockSearch";
import StockGraph from "./components/StockGraph";
import StockDetail from "./components/StockDetail";

const Index = () => {

    return (
      <Container className='stockTab' maxWidth={'xl'}>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', maxWidth: 'lg', minWidth: 'lg'}}>
          <StockSearch />
          <StockKeyIndicators />
        </Box>
        <Box>
          <StockDetail />
          <StockGraph />
        </Box>
      </Container>
    )
}

export default Index