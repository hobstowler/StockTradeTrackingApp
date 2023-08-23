import React, {useEffect, useState} from 'react';
import StockList from "./components/StockList";
import StockWatchList from "./components/StockWatchList";
import KeyIndicators from "./components/KeyIndicators";
import OpenOrdersModule from "../orders/components/OpenOrdersModule";
import TransactionHistory from "../history/components/TransactionHistory";
import {Container} from "@mui/material";
import Search from "../shared/components/Search";

export default function Index({positions, activeAccount, openOrders}) {
  const [longStocks, setLongStocks] = useState([])
  const [shortStocks, setShortStocks] = useState([])
  const [activeStock, setActiveStock] = useState([])
  const [loading, updateLoading] = useState(false)
  const [symbol, setSymbol] = useState("")

    useEffect(() => {
    }, [])

    return (
      <Container maxWidth={"md"}>
        <Search helperText='Search for a stock' />
      </Container>
    )
}