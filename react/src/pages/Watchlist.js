import React, {useEffect} from 'react';

export default function Watchlist({setActive}) {
    useEffect(() => {
        setActive('watch')
    }, [])

    return (
        <div>
            <div id='left'>left</div>
            <div id='center'>center</div>
            <div id='right'>right</div>
        </div>
    )
}