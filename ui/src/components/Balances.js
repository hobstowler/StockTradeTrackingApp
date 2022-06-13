import React, {useEffect, useState} from 'react'
import {getCookie} from "../middleware/misc";
import {getAccountBalances} from "../middleware/accounts";

export default function Balances() {
    const [balances, setBalances] = useState({
        'accountValue': 1000,
        'cash': 505,
        'buyingPower': 100,
        'optionBuyingPower': 50,
        'longStocks': 1500,
        'longOptions': 1000,
        'shortStocks': 500,
        'shortOptions': 150
    })

    useEffect(() => {
        getBalances()

        const interval = setInterval(() => {
            getBalances()
        }, 1000 * 60 * 5)
        return () => clearInterval(interval)
    }, [])

    const getBalances = () => {
        getAccountBalances()
        .then(response => response.json())
        .then(json => setBalances(json[0].securitiesAccount.currentBalances))
    }

    return (
        <div className='balances'>
            <div>
                <table cellSpacing='0'>
                    <tbody>
                        <tr>
                            <td>Account Value:</td><td>${balances.equity}</td>
                            <td>Cash Balance:</td><td><div className="balNum">${balances.cashBalance}</div></td>
                        </tr>
                        <tr>
                            <td>Stock Buying Power:</td><td><div className="balNum">${balances.buyingPower}</div></td>
                            <td>Long Stocks:</td><td><div className="balNum">${balances.longMarketValue}</div></td>
                            <td>Short Stocks:</td><td><div className="balNum">${balances.shortMarketValue}</div></td>
                        </tr>
                        <tr>
                            <td>Option Buying Power:</td><td><div className="balNum">${balances.buyingPowerNonMarginableTrade}</div></td>
                            <td>Long Options:</td><td><div className="balNum">${balances.longOptionMarketValue}</div></td>
                            <td>Short Options:</td><td><div className="balNum">${balances.shortOptionMarketValue}</div></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}