import { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // replace <a> tag with <Link> to enable routing faster (preload the page before the user clicks on the link)
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { MenuData } from "../utils/menuData";
import "./Navbar.css";

class Navbar extends Component {
    state = {
        clicked: false,
        scrolled: false,
    };

    handleMenuIconClick = () => {
        this.setState({ clicked: !this.state.clicked });
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        // if user scrolls down > n pixels, navbar's transpareny is higher
        if (window.scrollY > 50) {
            this.setState({ scrolled: true });
        } else {
            this.setState({ scrolled: false });
        }
    }

    // hide the side bar when user clicks on a link (mobile)
    handleLinkClick = () => {
        this.setState({ clicked: false });
    }

    render() {
        return (
            // after scrolling down, navbar's background color & height changes
            <nav className={`NavbarItems ${this.state.scrolled ? "NavbarItems-affix" : ""}`}>
                <h1 className="logo">
                    <i className="fab fa-react"></i> Bounden
                </h1>
                <div className="menu-icon" onClick={this.handleMenuIconClick}>
                    <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
                </div>
                <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
                    {MenuData.map((item, index) => {
                        return (
                            <li key={index}>
                                <Link to={item.url} className={item.cName} onClick={this.handleLinkClick}>
                                    <i className={item.icon}></i> {item.title}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                <div className="user-icon">
                    <Link to= "/login" className="nav-link-user" >
                        <i className="fa-solid fa-user"></i>
                    </Link>
                </div>
            </nav>
        );
    }
}

export default Navbar;