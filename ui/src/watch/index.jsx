import React, {useEffect} from 'react';

function Index() {
    useEffect(() => {
    }, [])

    return (
        <div>
            <div id='left'>left</div>
            <div id='center'>center</div>
            <div id='right'>right</div>
        </div>
    )
}

export default Index;