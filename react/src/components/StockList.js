import StockListItem from "./StockListItem";

export default function StockList({long, short}) {
    console.log(long)
    return(
        <div>
            <h1>Positions</h1>
            <h2>Long</h2>
            {long !== undefined && long.length > 0 ? long.map((stock, i) => <StockListItem stock={stock} key={i} />) : '(No long positions)'}
            <h2>Short</h2>
            {short !== undefined && short.length > 0? short.map((stock, i) => <StockListItem stock={stock} key={i} />) : '(No short positions)'}
        </div>
    )
}