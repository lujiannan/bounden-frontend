import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // replace <a> tag with <Link> to enable routing faster (preload the page before the user clicks on the link)
import { MenuData } from "../utils/menuData";
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import "./Navbar.css";

function Navbar() {
    const [menuClicked, setMenuClicked] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isAuthenticated = useIsAuthenticated();

    const handleMenuIconClick = () => {
        setMenuClicked(!menuClicked);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    }, [])

    const handleScroll = () => {
        // if user scrolls down > n pixels, navbar's transpareny is higher
        if (window.scrollY > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }

    // hide the side bar when user clicks on a link (mobile)
    const handleLinkClick = () => {
        setMenuClicked(false);
    }

    return (
        // after scrolling down, navbar's background color & height changes
        <nav className={`NavbarItems ${scrolled ? "NavbarItems-affix" : ""}`}>
            <h1 className="logo">
                <Link to="/" className="nav-link-home">
                    <i className="fab fa-react"></i> Bounden
                </Link>
            </h1>
            <div className="menu-icon" onClick={handleMenuIconClick}>
                <i className={menuClicked ? "fas fa-times" : "fas fa-bars"}></i>
            </div>
            <ul className={menuClicked ? "nav-menu active" : "nav-menu"}>
                {MenuData.map((item, index) => {
                    return (
                        <li key={index}>
                            <Link to={item.url} className={item.cName} onClick={handleLinkClick}>
                                <i className={item.icon}></i> {item.title}
                            </Link>
                        </li>
                    )
                })}
            </ul>
            <div className="user-icon">
                <Link to="/login" className="nav-link-user" id="nav-link-user">
                    <i className="fa-solid fa-user"></i>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;