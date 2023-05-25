import React, {useState} from 'react'
import {BarLoader} from "react-spinners";

export default function Balances({balances, initialBalances}) {
  const [showBalance, setShowBalance] = useState(false)

  if (balances !== undefined) {
    return (
      <div className='wrapper'>
        <div className='balanceSummary'>
          <table cellSpacing='0'>
            <tbody>
            <tr>
              <td>Account Value:</td>
              <td>${balances.liquidationValue || ''}</td>
              <td>Cash Balance:</td>
              <td>
                <div className="balNum">${balances.cashBalance}</div>
              </td>
            </tr>
            {showBalance ? <tr>
              <td>Stock Buying Power:</td>
              <td>
                <div className="balNum">${balances.buyingPower || '0.00'}</div>
              </td>
              <td>Long Stocks:</td>
              <td>
                <div className="balNum">${balances.longMarketValue || '0.00'}</div>
              </td>
              <td>Short Stocks:</td>
              <td>
                <div className="balNum">${balances.shortMarketValue || '0.00'}</div>
              </td>
            </tr> : null}
            <tr>
              <td>Option Buying Power:</td>
              <td>
                <div className="balNum">${balances.buyingPowerNonMarginableTrade || '0.00'}</div>
              </td>
              <td>Long Options:</td>
              <td>
                <div className="balNum">${balances.longOptionMarketValue.toLocaleString("en-US", {style:"currency", currency:"USD"}) || '0.00'}</div>
              </td>
              <td>Short Options:</td>
              <td>
                <div className="balNum">${balances.shortOptionMarketValue || '0.00'}</div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className='balanceDrawerToggle' onClick={() => setShowBalance(!showBalance)}>{showBalance ? "- Collapse -" : "- Expand -"}</div>
      </div>
    )
  } else {
    return (
      <div className='wrapper'>
        <div className='loader'><BarLoader color={"green"}/></div>
      </div>
    )
  }
}