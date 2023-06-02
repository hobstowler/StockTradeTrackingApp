import {useEffect, useState} from "react";
import OpenOrderItem from "./OpenOrderItem";

export default function OpenOrdersModule({openOrders}) {
  const [display, setDisplay] = useState(true)
  console.log(openOrders)

  useEffect(() => {
    if (openOrders === undefined || (Array.isArray(openOrders) && openOrders.length === 0)) {
      console.log(false)
      setDisplay(false)
    } else {
      setDisplay(true)
    }
  }, [openOrders])

  const toggleDisplay = () => {
    setDisplay(!display)
  }

  if (display) {
    return (
      <div className='openOrdersContainer'>
        <fieldset>
          <legend>Open Orders</legend>
          {display ?
            <div className='ordersContainer'>
              {(openOrders === undefined || (Array.isArray(openOrders) && openOrders.length === 0)) ? "(Empty)" :
                openOrders.map((order, i) => <OpenOrderItem order={order} key={i}/>)
              }
            </div> : ""
          }
        </fieldset>
      </div>
    )
  } else {
    return (<div></div>)
  }
}