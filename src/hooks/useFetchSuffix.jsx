/* 
This is a reusable component for geting data from a suffix url
*/

import { useState, useEffect } from'react';

// fetch from a suffix url (prefix is defined in package.json - 'proxy')
const useFetchSuffix = (urlSuffix) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Fetching blog data from the python server from proxy set in the package.json file
    // get called everytime there's a re-render
    useEffect(() => {      
        const abortController = new AbortController();
        
        fetch(process.env.REACT_APP_SERVER_URL + urlSuffix, {
            signal: abortController.signal,
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                // get access token from local storage
                "Authorization": "Bearer " + localStorage.getItem("_auth"),
            },
        })
            .then(res => {
                if (!res.ok) {throw Error('Could not fetch the data for that resource...');}
                return res.json();
            })
            .then(data => {
                // console.log(data);
                setData(data);
                setIsLoading(false);
                setFetchError(null);
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setIsLoading(false);
                    // process error while fetching data
                    setFetchError(error.message);
                    console.log(error.message)
                    // alert(fetchError);
                }
            });
        return () => {
            // cleanup function to avoid memory leaks
            abortController.abort();
        }
    }, [urlSuffix]); // pass in an empty array as second argument to only call once, or pass a dependency array to re-call it when certain variables change

    return [data, isLoading, fetchError];
}

export default useFetchSuffix;