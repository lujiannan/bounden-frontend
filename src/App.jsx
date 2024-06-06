import { Route, ScrollRestoration, createBrowserRouter, RouterProvider, createRoutesFromElements, Outlet } from 'react-router-dom';
import AuthProvider from 'react-auth-kit'
import createStore from 'react-auth-kit/createStore';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import refreshApi from "./utils/refreshApi";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BlogsProvider } from './ui/blog/BlogsContext';

import './App.css';
import Navbar from './ui/Navbar'
import Blogs from './ui/blog/Blogs';
import BlogsSelf from './ui/blog/BlogsSelf';
import BlogCreate from './ui/blog/BlogCreate';
import BlogEdit from './ui/blog/BlogEdit';
import BlogDetail from './ui/blog/BlogDetail';
import Login from './ui/user/Login';

export default function App() {
    // AOS animation initialization
    AOS.init({
        offset: 50,
        duration: 700,
        easing: 'ease-in-out',
    });

    const store = createStore({
        authName: '_auth',
        authType: 'localstorage',
        // cookieDomain: window.location.hostname,
        // cookieSecure: window.location.protocol === 'https:',
        refresh: refreshApi,
    });

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<AppLayout />}>
                <Route path='/' element={<Blogs />} />
                <Route element={<AuthOutlet fallbackPath='/login' />}>
                    <Route path='/blogs/create' element={<BlogCreate />} />
                    <Route path='/blogs-self' element={<BlogsSelf />} />
                    <Route path='/blogs-self/edit/:id' element={<BlogEdit />} />
                </Route>
                <Route path='/blogs/:id' element={<BlogDetail />} />
                <Route path='/login' element={<Login />} />
                <Route path='*' element={<h1>Page not found</h1>} />
            </Route>
        )
    );

    return (
        <AuthProvider store={store}>
            <BlogsProvider>
                <RouterProvider router={router} />
            </BlogsProvider>
        </AuthProvider>
    );
}

function AppLayout() {
    return (
        <>
            <div className='App'>
                <Navbar />
                <div className='container'>
                    <ScrollRestoration />
                    <Outlet />
                </div>
            </div>
        </>
    );
}