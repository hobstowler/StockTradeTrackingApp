import {useEffect, useState} from "react";
import {BsArrowRightCircleFill, BsArrowDownCircleFill} from 'react-icons/bs'
import OpenOrderItem from "./OpenOrderItem";

export default function OpenOrdersModule({openOrders}) {
    const [display, setDisplay] = useState(true)

    useEffect(() => {
        if (openOrders === undefined || openOrders.length === 0) {
            setDisplay(false)
        } else {
            setDisplay(true)
        }
    }, [openOrders])

    const toggleDisplay = () => {
        setDisplay(!display)
    }

    return(
        <div className='openOrdersContainer'>
            <h3 onClick={toggleDisplay}>{display ? <BsArrowDownCircleFill /> : <BsArrowRightCircleFill />}Open Orders:</h3>
            {display ?
                <div className='ordersContainer'>
                    {(openOrders === undefined || openOrders.length === 0) ? "(Empty)" :
                    openOrders.map((order, i) => <OpenOrderItem order={order} key={i} />)
                    }
                </div> : ""
            }
        </div>
    )
}