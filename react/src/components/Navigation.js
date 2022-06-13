import NavigationTab from "./NavigationTab";

export default function Navigation({activePage, setActive}) {
    const pages = [
        {url: '/', label: 'home'},
        {url: '/stocks', label: 'stocks'},
        {url: '/options', label: 'options'},
        {url: '/crypto', label: 'crypto'},
        {url: '/watch', label: 'watch'}/*,
        {url: '/account', label: 'account'}*/
    ]
    return (
        <nav>
            {pages.map((page, i) => {
                let {label} = page
                return <NavigationTab page={page} key={i} active={{activePage} === {label} ? 'active' : 'inactive'} />})
            }
        </nav>
    )
}