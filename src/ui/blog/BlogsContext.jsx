import React, { createContext, useState } from 'react';

// Create a context for the blogs data and functions to update it so that it can be accessed from any component in the app
// Also provide a way to maintain the blogs data while navigating between pages

export const BlogsContext = createContext();

export const BlogsProvider = ({ children }) => {
    const [dataBlogs, setDataBlogs] = useState([]);
    const [isBlogsNoMorePages, setIsBlogsNoMorePages] = useState(false);

    return (
        <BlogsContext.Provider value={{ dataBlogs, setDataBlogs, isBlogsNoMorePages, setIsBlogsNoMorePages }}>
            {children}
        </BlogsContext.Provider>
    );
};
