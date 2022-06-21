import React, {useEffect} from 'react';

export default function Home({setActive}) {
    useEffect(() => {
        setActive('home')
    }, [])

    return (
        <div>
            <div id='left'></div>
            <div id='center'></div>
            <div id='right'></div>
        </div>
    )
}