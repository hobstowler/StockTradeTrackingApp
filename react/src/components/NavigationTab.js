import {Link} from "react-router-dom";

export default function NavigationTab({page, active, setActive}) {

    return (
            <Link className={active} to={page.url} onClick={() => setActive(page.label)}>
                {page.label[0].toUpperCase() + page.label.substring(1)}
            </Link>
    )
}