import {Link} from "react-router-dom";

export default function NavigationTab({page, active}) {

    return (
            <Link className={active} to={page.url}>
                {page.label[0].toUpperCase() + page.label.substring(1)}
            </Link>
    )
}