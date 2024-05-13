import { useEffect, useState, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom"; // replace <a> tag with <Link> to enable routing faster (preload the page before the user clicks on the link)
import { MenuData } from "../utils/menuData";
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import boundenIcon from '../images/bounden.png';
import "./Navbar.css";

function Navbar() {
    const [menuClicked, setMenuClicked] = useState(false);
    const [isUserLoggedInClicked, setIsUserLoggedInClicked] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();

    const handleMenuIconClick = () => {
        setMenuClicked(!menuClicked);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        
        // cleanup function to remove event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

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

    const handleLoggedInUserClick = () => {
        isAuthenticated ? setIsUserLoggedInClicked(!isUserLoggedInClicked) : navigate('/login');
    }

    const handleSignOutClick = () => {
        setIsUserLoggedInClicked(false);
        signOut();
        // set user icon to logged out state
        const user_icon = document.getElementById('user-icon');
        user_icon.classList.remove('active');
    }

    return (
        // after scrolling down, navbar's background color & height changes
        <nav className={`NavbarItems ${scrolled ? "NavbarItems-affix" : ""}`}>
            <h1 className="bounden-title">
                <Link to="/" className="nav-link-home">
                    <img className="bounden-icon" alt="Bounden Icon" src={boundenIcon}></img>
                    <span>Bounden</span>
                </Link>
            </h1>
            <div className="menu-icon" onClick={handleMenuIconClick}>
                <i className={menuClicked ? "ri-close-line" : "ri-menu-line"}></i>
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
            <div className={`user-icon ${isAuthenticated ? "active" : ""}`} id="user-icon"
                onClick={() => { handleLoggedInUserClick() }}>
                <div className="nav-link-user-container">
                    <i className="ri-user-fill"></i>
                    {isUserLoggedInClicked && (
                        <div className='dropdown-list'>
                            <div className='dropdown-item'
                                onClick={handleSignOutClick}>
                                <i className='ri-logout-box-r-line'></i>
                                <span>&nbsp;&nbsp;Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;