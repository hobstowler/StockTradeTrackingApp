import {useState} from "react";
import {BsArrowRightCircleFill, BsArrowDownCircleFill} from 'react-icons/bs'

export default function OpenOrders({openOrders}) {
    const [display, setDisplay] = useState(true)

    const toggleDisplay = () => {
        setDisplay(!display)
    }

    return(
        <div className='openOrdersContainer'>
            <h3 onClick={toggleDisplay}>{display ? <BsArrowDownCircleFill /> : <BsArrowRightCircleFill />}Open Orders:</h3>
            {display ? <div className='ordersContainer'></div> : ""}
        </div>
    )
}