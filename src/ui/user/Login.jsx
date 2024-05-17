import { useState } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { useNavigate } from 'react-router-dom'

import './Login.css'
import AlertModal from '../modal/AlertModal'

function Login() {
    // server api
    const URL_SUFFIX_SIGNIN = '/signin';
    const URL_SUFFIX_SIGNUP = '/signup';

    const signIn = useSignIn();
    const signOut = useSignOut();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    // true if user is authenticated while fetching, false otherwise
    const [isLoading, setIsLoading] = useState(false);
    const [isSignInActive, setIsSignInActive] = useState(true);
    const isAuthenticated = useIsAuthenticated()
    const [fetchError, setFetchError] = useState(null);
    const [shouldSignupAlertOn, setShouldSignupAlertOn] = useState(false);

    const handleSubmit = (e, suffix) => {
        setIsLoading(true);
        console.log(process.env.REACT_APP_SERVER_URL + suffix);
        e.preventDefault();
        // send data to server in a format {"user" : {username: "", password: "", etc.}}
        fetch(process.env.REACT_APP_SERVER_URL + suffix, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password })
        })
            .then(res => {
                console.log(res);
                if (!res.ok) {
                    setIsLoading(false);
                    throw Error('Could not fetch the data for that resource...');
                }
                setFetchError(null);
                return res.json();
            })
            .then(data => {
                // console.log(data.message);
                if (data.message.username === "This field cannot be blank" || data.message === "Username must be at least 2 characters long") {
                    setUsernameError(true);
                    setUsernameErrorMessage(data.message);
                    throw Error('Username error');
                } else if (data.message.email === "This field cannot be blank" || data.message === "Email does not exist" || data.message === "Email already exists" || data.message === "Email is not verified" || data.message === "Please enter a valid email") {
                    setEmailError(true);
                    setEmailErrorMessage(data.message);
                    throw Error('Email error');
                } else if (data.message.password === "This field cannot be blank" || data.message === "Password is incorrect" || data.message === "Password must be 8+ length with a mix of letters and numbers") {
                    setPasswordError(true);
                    setPasswordErrorMessage(data.message);
                    throw Error('Password error');
                }

                setIsLoading(false);

                // show the email confirmation alert modal after sign up
                if (suffix === URL_SUFFIX_SIGNUP) {
                    setShouldSignupAlertOn(true);
                    setTimeout(() => {
                        setShouldSignupAlertOn(false);
                    }, 5000)
                }

                // authenticate the user and redirect to dashboard page
                if (suffix === URL_SUFFIX_SIGNIN && signIn({
                    auth: {
                        token: data.access_token,
                        type: 'Bearer',
                    },
                    refresh: data.refresh_token,
                    userState: { uid: data.user_id, username: data.username, email: data.email },
                })) { // Only if you are using refreshToken feature
                    handleSignedInEffect();
                    // Redirect or do-something
                    navigate("/blogs");
                } else {
                    if (suffix !== URL_SUFFIX_SIGNUP) {
                        //Throw error
                        alert("Error Occoured. Try Again")
                    }
                }
            })
            .catch(error => {
                setIsLoading(false);
                setFetchError(error.message);
                console.log(error.message);
                // alert(fetchError);
            });
    }

    const handleSignUpSubmit = (e) => {
        handleSubmit(e, URL_SUFFIX_SIGNUP);
    }

    const handleSignInSubmit = (e) => {
        handleSubmit(e, URL_SUFFIX_SIGNIN);
    }

    const handleSignedInEffect = () => {
        // set user icon to logged in state
        const nav_link_user_container = document.getElementById('nav-link-user-container');
        nav_link_user_container.classList.add('active');
    }

    // make two sections of the login page switch there position on switch button click
    const handleSideSignInClick = () => {
        setIsSignInActive(true);
        // reset the form verification errors when switching forms
        setIsPasswordVisible(false);
        setUsernameError(false);
        setEmailError(false);
        setPasswordError(false);
    }

    const handleSideSignUpClick = () => {
        setIsSignInActive(false);
        // reset the form verification errors when switching forms
        setIsPasswordVisible(false);
        setUsernameError(false);
        setEmailError(false);
        setPasswordError(false);
    }

    return (
        <>
            <AlertModal isOpen={shouldSignupAlertOn} onClose={() => setShouldSignupAlertOn(false)}>
                <p>the verification link is sent to your email</p>
            </AlertModal>
            <div className='login-page-container'>
                <div className="login-container">
                    <div className={`login-main-container ${isSignInActive ? "" : "slide-right"}`}>
                        <div className='login-form-block' id='signUpForm'>
                            <h2>Create Account</h2>
                            <form>
                                <div className='login-form-input-container'>
                                    <label htmlFor="user_name">Username (not changeable)</label>
                                    <input className={`login-form-input ${usernameError ? "login-form-input-error" : ""}`} type="text" id="user_name"
                                        onChange={(e) => { setUsername(e.target.value) }} onFocus={() => { setUsernameError(false) }}>
                                    </input>
                                    {usernameError && <span className='login-form-input-error-message'>{usernameErrorMessage}</span>}
                                </div>

                                <div className='login-form-input-container'>
                                    <label htmlFor="user_email_signup">Email</label>
                                    <input className={`login-form-input ${emailError ? "login-form-input-error" : ""}`} type="email" id="user_email_signup"
                                        onChange={(e) => { setEmail(e.target.value) }} onFocus={() => { setEmailError(false) }} />
                                    {emailError && <span className='login-form-input-error-message'>{emailErrorMessage}</span>}
                                </div>

                                <div className='login-form-input-container'>
                                    <label htmlFor="user_password_signup">Password</label>
                                    <input className={`login-form-input ${passwordError ? "login-form-input-error" : ""}`} type={`${isPasswordVisible ? "text" : "password"}`} id="user_password_signup"
                                        onChange={(e) => { setPassword(e.target.value) }} onFocus={() => { setPasswordError(false) }} />
                                    {passwordError && <span className='login-form-input-error-message'>{passwordErrorMessage}</span>}
                                    <div
                                        className="password-toggle-button-signup"
                                        onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}
                                    >
                                        <i className={`${isPasswordVisible ? "ri-eye-fill" : "ri-eye-off-fill"}`}></i>
                                    </div>
                                </div>

                                <button type="submit" onClick={handleSignUpSubmit}>
                                    {isLoading ?
                                        <div className="login-form-loading-container">
                                            <div className="loading-pulse"></div>
                                        </div> : "Sign Up"}
                                </button>
                            </form>
                        </div>
                        <div className="login-form-block" id="signInForm">
                            <h2>Login</h2>
                            <form>
                                <div className='login-form-input-container'>
                                    <label htmlFor="user_email_signin">Email</label>
                                    <input className={`login-form-input ${emailError ? "login-form-input-error" : ""}`} type="email" id="user_email_signin"
                                        onChange={(e) => { setEmail(e.target.value) }} onFocus={() => { setEmailError(false) }} />
                                    {emailError && <span className='login-form-input-error-message'>{emailErrorMessage}</span>}
                                </div>

                                <div className='login-form-input-container'>
                                    <label htmlFor="user_password_signin">Password</label>
                                    <input className={`login-form-input ${passwordError ? "login-form-input-error" : ""}`} type={`${isPasswordVisible ? "text" : "password"}`} id="user_password_signin"
                                        onChange={(e) => { setPassword(e.target.value) }} onFocus={() => { setPasswordError(false) }} />
                                    {passwordError && <span className='login-form-input-error-message'>{passwordErrorMessage}</span>}
                                    <div
                                        className="password-toggle-button-signin"
                                        onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}
                                    >
                                        <i className={`${isPasswordVisible ? "ri-eye-fill" : "ri-eye-off-fill"}`}></i>
                                    </div>
                                </div>

                                <button type="submit" onClick={handleSignInSubmit}>
                                    {isLoading ?
                                        <div className="login-form-loading-container">
                                            <div className="loading-pulse"></div>
                                        </div> : "Sign In"}
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className={`login-aside-container ${isSignInActive ? "" : "slide-left"}`}>
                        <div className="signin-block">
                            <h2>Already a User?</h2>

                            <button type="submit" onClick={handleSideSignInClick}>Sign In</button>
                        </div>
                        <div className="signup-block">
                            <h2>New User?</h2>

                            <button type="submit" onClick={handleSideSignUpClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login