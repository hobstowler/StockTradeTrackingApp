export default function KeyIndicators({stock}) {
    //stock.ticker = '$AMD'
    //stock.desciption = "Advanced Micro Devices"
    return (
        <div className='keyIndicatorContainer'>
            <fieldset>
                <legend>Key Indicators for {stock ? stock.symbol : "n/a"} | {stock ? stock.description : "n/a"}</legend>
                <div className='indicatorContainer'></div>
            </fieldset>
        </div>
    )
}