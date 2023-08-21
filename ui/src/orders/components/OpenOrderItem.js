import {BsChevronRight, BsXLg, BsFillPencilFill} from 'react-icons/bs'
export default function OpenOrderItem({order}) {
    let collection = order.orderLegCollection
    return(
        <div class='openOrderItemContainer'>
            <div>
              {order.orderType} Order for {collection[0].instrument.symbol} at {order.price.toLocaleString("en-US", {style:"currency", currency:"USD"})}
            </div>
            <div className='openOrderExpander'><BsFillPencilFill/></div>
            <div className='openOrderExpander'><BsXLg/></div>
            <div className='openOrderExpander'><BsChevronRight/></div>
        </div>
    )
}