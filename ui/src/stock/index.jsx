import React, {useEffect, useState} from 'react';
import StockList from "./components/StockList";
import StockWatchList from "./components/StockWatchList";
import KeyIndicators from "./components/KeyIndicators";
import OpenOrdersModule from "../orders/components/OpenOrdersModule";
import TransactionHistory from "../history/components/TransactionHistory";

export default function Index({positions, activeAccount, openOrders, setActive}) {
  const [longStocks, setLongStocks] = useState([])
  const [shortStocks, setShortStocks] = useState([])
  const [activeStock, setActiveStock] = useState([])
  const [loading, updateLoading] = useState(false)
  const [symbol, setSymbol] = useState("")

    useEffect(() => {
        setActive('stocks')
    }, [])

    return (
      <div>
        <div id='left'>
          <StockList long={longStocks} short={shortStocks}/>
        </div>
        <div id='center'>
          <OpenOrdersModule openOrders={openOrders}/>
          <div className='formContainer'>
            <form id='stockSearchForm'>
              <input type='text' />
              <button type='submit'>Search</button>
              <p>Search for a stock symbol or select from your list of positions on the left or watchlist on the right.</p>
            </form>
          </div>
          <KeyIndicators />
          <TransactionHistory symbol={symbol} activeAccount={activeAccount} />
        </div>
        <div id='right'>
          <StockWatchList />
        </div>
      </div>
    )
}