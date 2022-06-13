import React from 'react';
import StockCard from '../components/stockCard'
import OptionCard from '../components/optionCard'
import CryptoCard from '../components/cryptoCard'

export default class Home extends React.Component {
    constructor(props) {
      super(props)
      
    }
  
    render() {
      const cryptoTotal = "$0.00";
      return (
        <div>
          <div className="navColorBar"></div>
          <div className="body">
            <div className="positions"><h1>Positions</h1></div>
              <div className="posStocks"><h2>Stocks:</h2></div>
                <StockCard ticker="AMC" shares="100" price="$50" />
                <StockCard ticker="GME" shares="1000" price="$150" />
              <div className="posOptions"><br /><h2>Options:</h2></div>
              <div className="posCrypto">
                <br /><h2>Crypto:</h2>
                <h3>Total Value of Crypto Assets: {cryptoTotal}</h3>
                <div className="cards">
                  <CryptoCard ticker="Doge" shares="1000" price="$150" />
                  <CryptoCard ticker="Shib" shares="1000" price="$1220" />
                  <CryptoCard ticker="Polygon" shares="1000" price="$160" />
                  <CryptoCard ticker="BTC" shares="1000" price="$152" />
                  <CryptoCard ticker="ETH" shares="1000" price="$1" />
                  <CryptoCard ticker="BNB" shares="1000" price="$12" />
                </div>
              </div>
          </div>
        </div>
        
        )
    }
  }