export default function KeyIndicators({stock}) {
    //stock.ticker = '$AMD'
    //stock.desciption = "Advanced Micro Devices"
    return (
        <div className='keyIndicatorContainer'>
            <fieldset>
                <legend>Key Indicators for {"AMD"} | {"Advanced Micro devices"}</legend>
                <div className='indicatorContainer'></div>
            </fieldset>
        </div>
    )
}