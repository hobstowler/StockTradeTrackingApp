import NavigationTab from "./NavigationTab";

export default function Navigation({activePage}) {
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
                return <NavigationTab page={page} key={i} active={activePage === page.label ? 'active' : 'inactive'} />})
            }
        </nav>
    )
}