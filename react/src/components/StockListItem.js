import {BsChevronDoubleRight} from 'react-icons/bs'

export default function StockListItem({stock}) {
    return (
        <div className='stockListItem'>
            <div>
                <table cellPadding={2} cellSpacing={0}>
                    <tbody>
                        <tr>
                            <td>{stock.instrument.symbol}</td>
                            <td>{stock.longQuantity.toLocaleString() + ' @'}</td>
                            <td>{stock.averagePrice.toLocaleString('en-US', {style: 'currency', currency: 'usd'})}</td>
                            <td>{(stock.averagePrice * stock.longQuantity).toLocaleString('en-US', {style: 'currency', currency: 'usd'})}</td>
                        </tr>
                    <tr>
                        <td></td>
                        <td>{'current'}</td>
                        <td>{(stock.marketValue / stock.longQuantity).toLocaleString('en-US', {style: 'currency', currency: 'usd'})}</td>
                        <td>{stock.marketValue.toLocaleString('en-US', {style: 'currency', currency: 'usd'})}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <BsChevronDoubleRight />
            </div>

        </div>
    )
}