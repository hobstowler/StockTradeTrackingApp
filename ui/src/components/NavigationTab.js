import {Link} from "react-router-dom";

export default function NavigationTab({page}) {
    return (
            <Link className={page.active} to={page.url}>{page.label[0].toUpperCase() + page.label.substring(1)}</Link>
    )
}