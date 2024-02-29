import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {Box} from "@mui/system";

const Index = () => {
  const activePage = useSelector(({application}) => application.page)

    return (
        <Box role='tabpanel' hidden={activePage !== 'Options'} className='optionsTab'></Box>
    )

}

export default Index