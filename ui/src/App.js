import logo from './logo.svg';
import './App.css';
import Home from "./pages/Home";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from "./components/Footer";
import Watchlist from "./pages/Watchlist";
import {useState} from "react";
import Stocks from "./pages/Stocks";
import Options from "./pages/Options";
import Crypto from "./pages/Crypto";

function App() {
    const [activePage, setActive] = useState('home')

    return (
        <div className="App">
            <BrowserRouter>
                <Header activePage={activePage} setActive={setActive} />
                <div className='body'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/stocks' element={<Stocks />} />
                        <Route path='/options' element={<Options />} />>
                        <Route path='/crypto' element={<Crypto />} />
                        <Route path='/watch' element={<Watchlist />} />
                        <Route path='/account' element={<Watchlist />} />
                    </Routes>
                </div>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
