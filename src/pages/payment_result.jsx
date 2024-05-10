import React, { useState, useEffect} from 'react';
import ResultPage from "../component/result";

export default function() {
    const [params, setParams] = useState({});
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paramsObject = {};
        for (const [key, value] of urlParams) {
          paramsObject[key] = value;
        }
        setParams(paramsObject);
        
        if (params.refno
        && params.digest
        && params.message
        && params.txnid
        && params.status) {
            console.log('Payment successfull: sending email.');
            sendSuccessEmail();
        }
        console.log('processing params');
    }, []);
    
    console.log(params);
    
    const sendSuccessEmail = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(`${endpoint()}/sendSuccessEmail?refNo=${params.refno}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            const data = response;
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            sessionStorage.clear();     
        }
    }

    return(
        <ResultPage status={params.status} refno={params.refno}/>
    )
}