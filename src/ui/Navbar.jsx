import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // replace <a> tag with <Link> to enable routing faster (preload the page before the user clicks on the link)
import { MenuData } from "../utils/menuData";
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import boundenIcon from '../images/bounden.png';
import "./Navbar.css";

function Navbar() {
    const [menuClicked, setMenuClicked] = useState(false);
    const menuIconRef = useRef(null);
    const menuRef = useRef(null);
    const navUserRef = useRef(null);
    const [isNavUserClicked, setIsNavUserClicked] = useState(false);

    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener("click", handleOutsideClick);

        // cleanup function to remove event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    function handleOutsideClick(event) {
        // if user clicks outside the specific element, close the element
        if (menuIconRef.current && !menuIconRef.current.contains(event.target) && !menuRef.current.contains(event.target)) {
            setMenuClicked(false);
        }
        if (navUserRef.current && !navUserRef.current.contains(event.target)) {
            setIsNavUserClicked(false);
        }
    }

    const handleMenuIconClick = () => {
        setMenuClicked(!menuClicked);
    }

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

    const handleNavUserClick = () => {
        isAuthenticated ? setIsNavUserClicked(!isNavUserClicked) : navigate('/login');
    }

    const handleSignOutClick = () => {
        setIsNavUserClicked(false);
        signOut();
        // set user icon to logged out state
        const nav_link_user_container = document.getElementById('nav-link-user-container');
        nav_link_user_container.classList.remove('active');
    }

    return (
        // after scrolling down, navbar's background color & height changes
        <nav className={`NavbarItems ${scrolled ? "NavbarItems-affix" : ""}`}>
            <div className="bounden-title">
                <Link to="/" className="nav-link-home">
                    <img className="bounden-icon" alt="Bounden Icon" src={boundenIcon}></img>
                    <span className="bounden-title-text">Bounden</span>
                </Link>
            </div>
            <div className="menu-icon" onClick={handleMenuIconClick} ref={menuIconRef}>
                <i className={menuClicked ? "ri-close-line" : "ri-menu-line"}></i>
            </div>
            <ul className={menuClicked ? "nav-menu active" : "nav-menu"} ref={menuRef}>
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
            <div className={`nav-link-user-container ${isAuthenticated ? "active" : ""}`} id="nav-link-user-container" ref={navUserRef}
                onClick={() => { handleNavUserClick() }}>
                <div className="user-icon">
                    <i className="ri-user-fill"></i>
                    {isNavUserClicked && (
                        <div className='dropdown-list'>
                            <div className='dropdown-item'
                                onClick={() => { navigate('/blogs-self') }}>
                                <i className='ri-edit-box-line'></i>
                                <span>&nbsp;&nbsp;My Blogs</span>
                            </div>
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