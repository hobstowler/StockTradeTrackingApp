import React, {useEffect} from 'react';
import AccountSelector from "./account/components/AccountSelector";

export default function Home() {
    useEffect(() => {
    }, [])

    return (
        <div>
          <AccountSelector />
            <div id='left'></div>
            <div id='center'></div>
            <div id='right'></div>
        </div>
    )
}