import React, {useEffect} from 'react';

export default function Crypto({setActive}) {
    useEffect(() => {
        setActive('crypto')
    }, [])

    return (
        <div className="body">CRYPTO</div>
    )
}