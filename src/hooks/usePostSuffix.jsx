/* 
This is a reusable component for posting data at a suffix url
*/

import { useState, useEffect } from 'react';

// posting data at a suffix url (prefix is defined in package.json - 'proxy')
// params: urlSuffix (suffix url), data (data to be posted: in "{}" format)
const usePostSuffix = (urlSuffix, body_dict) => {
    const [result, setResult] = useState(false);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Posting blog data to the python server from proxy set in the package.json file
    // get called everytime there's a re-render
    useEffect(() => {      
        const abortController = new AbortController();

        fetch(process.env.REACT_APP_SERVER_URL + urlSuffix, {
            signal: abortController.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // get access token from local storage
                "Authorization": "Bearer " + localStorage.getItem("_auth"),
            },
            body: JSON.stringify(body_dict)
        })
            .then((res) => {
                if (!res.ok) {throw Error('Could not fetch the data for that resource...');}
                console.log('Data posted');
                return res.json();
            })
            .then((data) => {
                setData(data);
                setResult(true);
                setIsLoading(false);
                setFetchError(null);
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setResult(false);
                    setIsLoading(false);
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

    return [result, data, isLoading, fetchError];
}

export default usePostSuffix;