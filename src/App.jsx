import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from 'react-auth-kit'
import createStore from 'react-auth-kit/createStore';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import refreshApi from "./utils/refreshApi";
import AOS from 'aos';
import 'aos/dist/aos.css';

import './App.css';
import Navbar from './ui/Navbar'
import Blogs from './ui/blog/Blogs';
import BlogsSelf from './ui/blog/BlogsSelf';
import BlogCreate from './ui/blog/BlogCreate';
import BlogEdit from './ui/blog/BlogEdit';
import BlogDetail from './ui/blog/BlogDetail';
import Login from './ui/user/Login';

export default function App() {
    AOS.init();

    const store = createStore({
        authName: '_auth',
        authType: 'localstorage',
        // cookieDomain: window.location.hostname,
        // cookieSecure: window.location.protocol === 'https:',
        refresh: refreshApi,
    });

    return (
        <AuthProvider store={store}>
            <Router>
                <div className='App'>
                    {/* <Home /> */}
                    <Navbar />
                    <div className='container'>
                        <Routes>
                            <Route path='/' element={<Blogs />} />
                            {/* require a logged in user before one can create/edit a blog (also require when token expires) */}
                            <Route element={<AuthOutlet fallbackPath='/login' />}>
                                <Route path='/blogs/create' element={<BlogCreate />} />
                                <Route path='/blogs-self' element={<BlogsSelf />} />
                                <Route path='/blogs-self/edit/:id' element={<BlogEdit />} />
                            </Route>
                            {/* use 'blog/:id' to get the id of the blog dynamically */}
                            <Route path='/blogs/:id' element={<BlogDetail />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='*' element={<h1>Page not found</h1>} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}