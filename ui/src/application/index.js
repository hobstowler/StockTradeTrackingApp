import React from 'react';
import {Container} from "@mui/system";
import {useSelector} from "react-redux";

const Home = () => {
  const activePage = useSelector(({application}) => application.page)

    return (
        <Container role='tabpanel' hidden={activePage !== 'Home'}>
            <div id='left'></div>
            <div id='center'></div>
            <div id='right'></div>
        </Container>
    )
}

export default Home