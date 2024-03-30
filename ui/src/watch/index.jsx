import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {Box} from "@mui/system";

function Index() {
  const activePage = useSelector(({application}) => application.page)

    return (
      <Box role='tabpanel' hidden={activePage !== 'WatchList'} className='watchListTab'></Box>
    )
}

export default Index;