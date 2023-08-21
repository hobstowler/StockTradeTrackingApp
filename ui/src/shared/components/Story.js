import {Link} from 'react-router-dom';

export default function Story({story}) {
    return(
        <div className='story'>
            <h3>{story.headline}</h3>
            <p className='summary'>{story.summary}</p>
            <p className='source'>Source: {story.source} <Link to={story.url}>Read More...</Link></p>
        </div>
    )
}