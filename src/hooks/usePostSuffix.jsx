/* 
This is a reusable component for posting data at a suffix url
*/

import { useState, useEffect } from'react';

// posting data at a suffix url (prefix is defined in package.json - 'proxy')
// params: urlSuffix (suffix url), data (data to be posted: in "{}" format)
const usePostSuffix = (urlSuffix, data_in) => {
    const [result, setResult] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    // Posting blog data to the python server from proxy set in the package.json file
    // get called everytime there's a re-render
    useEffect(() => {      
        const abortController = new AbortController();

        fetch(urlSuffix, {
            signal: abortController.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_in)
        })
            .then((res) => {
                if (!res.ok) {throw Error('Could not fetch the data for that resource...');}
                console.log('Data posted');
                setResult(true);
                setFetchError(null);
                // return res.json();
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setResult(false);
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

    return [result, fetchError];
}

export default usePostSuffix;