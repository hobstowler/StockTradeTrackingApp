export default function StockCard(props) {
    return (
      <div className="card">
        <div className="cardHeader">
          <div className="cardHeaderElement" id="ticker">Asset:</div>
          <div className="cardHeaderElement"></div>
          <div className="cardHeaderElement"></div>
          <div className="cardHeaderElement"></div>
        </div>
        <div className="cardElements">
          <div className="cardElement" id="ticker">{props.ticker}</div>
          <div className="cardElementsInfo">
            <div className="cardElement">{props.shares}</div>
            <div className="cardElement">{props.price}</div>
            <div className="cardElement">{props.price * props.value}</div>
          </div>
        </div>
      </div>
    )
  }