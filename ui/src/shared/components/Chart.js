import {CanvasJSChart} from 'canvasjs-react-charts'
import {useEffect, useState} from "react";

export default function Chart({symbol}) {
    const [symbolData, setSymbolData] = useState([])
    const [volumeData, setVolumeData] = useState([])
    const [dataOptions, setDataOptions] = useState({})
    const [volumeOptions, setVolumeOptions] = useState({})
    const [startDt, setStartDt] = useState(new Date(new Date().setDate(new Date().getDate() - 30)))
    const [endDt, setEndDt] = useState(new Date())
    const [resolution, setResolution] = useState("D")

    // gets new candles whenever the symbol, dates, or resolution changes
    useEffect(() => {
        getCandles()
    }, [symbol, startDt, endDt, resolution])

    // builds new options for graph when symbol data is refreshed
    useEffect(() => {
        buildOptions()
    }, [symbolData])

    // builds new options for volume graph when volume data is refreshed
    useEffect(() => {
        buildVolumeOptions()
    }, [volumeData])

    const buildCandleUrl = () => {
        let candleUrl = `/candles?symbol=${symbol}`
        candleUrl += `&resolution=${resolution}`
        candleUrl += `&start=${Math.floor(startDt.valueOf() / 1000)}`
        candleUrl += `&end=${Math.floor(endDt.valueOf() / 1000)}`
        return candleUrl
    }

    // fetches candle data from back end endpoint
    const getCandles = () => {
        if (symbol === undefined || symbol === '') {return}
        let candleUrl = buildCandleUrl()
        fetch(candleUrl, {method: 'GET'})
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null
                if (!response.ok) {return Promise.reject((data && data.error) || response.status)}
                setSymbolData(formatData(data[0]))
                setVolumeData(formatData(data[1]))
            })
    }

    // formats data for consumption by canvasJS graph and corrects the timestamp (ms to s)
    const formatData = (data) => {
        let dataPoints = []
        for (let i = 0; i < data.length; i++) {
            dataPoints.push({
                x: new Date(data[i].x * 1000),
                y: data[i].y
            })
        }
        return dataPoints
    }

    // builds graph options
    const buildOptions = () => {
        let newOptions = {
            theme: "light1",
            animationEnabled: true,
            axisX: {valueFormatString: "DD-MMM"},
            axisY: {prefix: "$", title: "Price (in USD)", includeZero: false},
            data: [{type: "candlestick", yValueFormatString: "$###0.00", xValueType: "dateTime", dataPoints: symbolData}]
        }
        setDataOptions(newOptions)
    }

    // builds options for volume graph
    const buildVolumeOptions = () => {
        let newOptions = {
            theme: "light1", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            axisX: {valueFormatString: "DD-MMM"},
            axisY: {title: "Volume (Thousands)", includeZero: false},
            data: [{type: "area", yValueFormatString: "$###0.00", xValueType: "dateTime", dataPoints: volumeData}]
        }
        setVolumeOptions(newOptions)
    }

    return (
        <div>
            <div className='priceChart'>
                <CanvasJSChart options={dataOptions} />
            </div>
            <div className='volumeChart'>
                <CanvasJSChart options={volumeOptions} />
            </div>
        </div>
    )
}