// This is a custom hook for handling API requests without cluttering the components by abstracting the logic

import {useState, useEffect} from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try{
            setLoading(true);
            setError(null);

            const result = await fetchFunction();
            setData(result);
        }catch(err){
            setError(err instanceof Error ? err : new Error("An error occurred.") );
        }finally {
            setLoading(false);
        }
    }

    const reset = () => {
        setData(null);
        setLoading(false);
        setError(null);
    }

    useEffect(() => {
        if(autoFetch){
            fetchData();
        }
    }, []);

    return { data, loading, error, refetch: fetchData, reset };
}

export default useFetch;
/*
 The function 'useFetch' is a custom hook that accepts fetch funtions. It accepts functions that returns Promise of type 'generic' indicated by the <T></T>
*/