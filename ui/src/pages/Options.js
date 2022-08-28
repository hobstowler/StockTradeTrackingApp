import React, {useEffect} from 'react';

export default function Options({setActive}) {
    useEffect(() => {
        setActive('options')
    }, [])

    return (
        <div>
            <div id='left'>LEFT</div>
            <div id='center'>CENTER</div>
            <div id='right'>RIGHT</div>
        </div>
    )

}