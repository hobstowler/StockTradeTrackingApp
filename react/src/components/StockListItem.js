import {BsChevronDoubleRight} from 'react-icons/bs'

export default function StockListItem({stock}) {
    return (
        <div className='stockListItem'>
            <div>
                {stock.instrument.symbol} | {stock.averagePrice} | {stock.longQuantity} @ ${stock.marketValue / 100}
            </div>
            <div>
                <BsChevronDoubleRight />
            </div>

        </div>
    )
}