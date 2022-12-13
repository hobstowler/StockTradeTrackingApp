import {useEffect, useState} from "react";
import Story from "./Story";

export default function Stories({stock}) {
    const [stories, setStories] = useState([])

    // get stories from finnhub when stock symbol changes
    useEffect(() => {
        if (stock === undefined || stock === '') {
            return
        }
        getStories()
    }, [stock])

    // get today's date formatted for finnhub
    const getFormattedToday = () => {
        let today = new Date()
        let dd = String(today.getDate()).padStart(2, '0')
        let mm = String(today.getMonth()).padStart(2, '0')
        let yyyy = today.getFullYear()
        return `${yyyy}-${mm}-${dd}`
    }

    // get last week's date formatted for finnhub
    const getFormattedLastWeek = () => {
        let lastWeek = new Date()
        let today = new Date()
        lastWeek.setDate(today.getDate() - 7)
        let dd = String(lastWeek.getDate()).padStart(2, '0')
        let mm = String(lastWeek.getMonth()).padStart(2, '0')
        let yyyy = lastWeek.getFullYear()
        return `${yyyy}-${mm}-${dd}`
    }

    // fetch stories from finnhub
    const getStories = () => {
        let endDt = getFormattedToday()
        let startDt = getFormattedLastWeek()

        fetch(`/news/${stock}?start_dt=${startDt}&end_dt=${endDt}`, {
            method: 'GET'
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null

                if (!response.ok) {
                    let error = (data && data.error) || response.status
                    return Promise.reject(error)
                }
                setStories(data)
            })
    }

    return (
        <div>
            <h2>In the News...</h2>
            {(stories.length === 0) ?
                `I couldn't find any news about this company in the last week. No news is good news, right?`: null}
            {stories.slice(0, 5).map((story) => <Story story={story} />)}
        </div>
    )
}