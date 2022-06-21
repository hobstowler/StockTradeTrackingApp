import React, {useEffect} from 'react';
import StockList from "../components/StockList";
import StockWatchList from "../components/StockWatchList";
import KeyIndicators from "../components/KeyIndicators";
import OpenOrders from "../components/OpenOrders";

export default function Stocks({stocks, setActive}) {
    useEffect(() => {
        setActive('stocks')
    }, [])

    console.log(stocks)
    return (
        <div>
            <div id='left'>
                <StockList long={stocks} />
            </div>
            <div id='center'>
                <OpenOrders />
                <div className='formContainer'>
                    <form id='stockSearchForm'>
                        <input type='text' />
                        <button type='submit'>Search</button>
                        <p>Search for a stock symbol or select from your list of positions on the left or watchlist on the right.</p>
                    </form>
                </div>
                <KeyIndicators />
            </div>
            <div id='right'>
                <StockWatchList />
            </div>
        </div>
    )
}