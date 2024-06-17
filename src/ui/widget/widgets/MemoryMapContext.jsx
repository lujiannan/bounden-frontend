import React, { createContext, useState } from 'react';

// Create a context for the blogs data and functions to update it so that it can be accessed from any component in the app
// Also provide a way to maintain the blogs data while navigating between pages

export const MemoryMapContext = createContext();

export const MemoryMapProvider = ({ children }) => {
    const [markerList, setMarkerList] = useState([]);

    return (
        <MemoryMapContext.Provider value={{ markerList, setMarkerList }}>
            {children}
        </MemoryMapContext.Provider>
    );
};
