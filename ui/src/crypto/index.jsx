import React, {useEffect} from 'react';

export default function Index({setActive}) {
    useEffect(() => {
        setActive('crypto')
    }, [])

    return (
        <div className="body">CRYPTO</div>
    )
}