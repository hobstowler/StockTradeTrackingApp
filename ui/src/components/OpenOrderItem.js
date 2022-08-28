import {BsChevronRight, BsXLg, BsFillPencilFill} from 'react-icons/bs'
export default function OpenOrderItem({order}) {
    let collection = order.orderLegCollection
    return(
        <div class='openOrderItemContainer'>
            <div>
                {collection[0].instrument.symbol}
            </div>
            <div className='openOrderExpander'><BsFillPencilFill/></div>
            <div className='openOrderExpander'><BsXLg/></div>
            <div className='openOrderExpander'><BsChevronRight/></div>
        </div>
    )
}