import React from 'react';
import StockList from "../components/StockList";
import StockWatchList from "../components/StockWatchList";
import KeyIndicators from "../components/KeyIndicators";

export default function Stocks({stocks}) {
    console.log(stocks)
    return (
        <div>
            <div id='left'>
                <StockList long={stocks} />
            </div>
            <div id='center'>
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