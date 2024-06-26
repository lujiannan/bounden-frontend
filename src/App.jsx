import { Route, ScrollRestoration, createBrowserRouter, RouterProvider, createRoutesFromElements, Outlet } from 'react-router-dom';
import AuthProvider from 'react-auth-kit'
import createStore from 'react-auth-kit/createStore';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import refreshApi from "./utils/refreshApi";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BlogsProvider } from './ui/blog/BlogsContext';
import { MemoryMapProvider } from './ui/widget/widgets/MemoryMapContext'

import './App.css';
import Navbar from './ui/Navbar'
import Blogs from './ui/blog/Blogs';
import BlogsSelf from './ui/blog/BlogsSelf';
import BlogCreate from './ui/blog/BlogCreate';
import BlogEdit from './ui/blog/BlogEdit';
import BlogDetail from './ui/blog/BlogDetail';
import Login from './ui/user/Login';
import Widgets from './ui/widget/Widgets';
import { WidgetsData } from './utils/widgetsData';

export default function App() {
    // AOS animation initialization
    AOS.init({
        offset: 50,
        duration: 700,
        easing: 'ease',
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
                <Route path='/widgets' element={<Widgets />} />
                {WidgetsData.map((widget, index) => {
                    return (
                        <Route key={index} path={`/widgets${widget.url}`} element={widget.routeElement} />
                    )
                })}
                <Route path='*' element={<h1>Page not found</h1>} />
            </Route>
        )
    );

    return (
        <AuthProvider store={store}>
            <BlogsProvider>
                <MemoryMapProvider>
                    <RouterProvider router={router} />
                </MemoryMapProvider>
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