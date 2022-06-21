import {useEffect} from "react";

export default function Account({setActive}) {
    useEffect(() => {
        setActive('')
    }, [])

    return (
        <div>
            <div id='left'></div>
            <div id='center'></div>
            <div id='right'></div>
        </div>
    )
}