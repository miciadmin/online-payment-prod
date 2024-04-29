import React, { useEffect, useState, useRef } from 'react';
import Step1 from "../component/step1";
import { useLocation, useNavigate } from "react-router-dom";
import { endpoint } from '../js/utils';

export default function() {
    const location = useLocation();
    const prevLocation = useRef("");
    const navigate = useNavigate();
    const [params, setParams] = useState({});
    
    const handlePopstate = (event) => { };
   
    window.addEventListener('popstate', handlePopstate);

    useEffect(() => {
        const handlePopstate = () => {
            if (prevLocation.current  === "/search-policy") {
                for (let i = 0; i < window.history.length; i++) {
                    history.go(-1);
                }
            }
        };
        prevLocation.current = location.pathname;
        window.addEventListener("popstate", handlePopstate);
    }, [location, history]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paramsObject = {};
    
        for (const [key, value] of urlParams) {
          paramsObject[key] = value;
        }
    
        setParams(paramsObject);
    }, []);
    
    useEffect(() => {
        console.log(params);
        if (params.refno
        && params.digest
        && params.message
        && params.txnid
        && params.status === 'S') {
            console.log('Has successfull transaction:' + params.refno);
            navigate('/payment-result');
            sendSuccessEmail();
        } 
    }, [params]);

    const sendSuccessEmail = async () => {
        try {
            //setLoading(true);
            const response = await fetch(`${endpoint()}/sendSuccessEmail?refNo=${params.refno}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            //setLoading(false);
        }
    }
        
    return(
        <Step1/>
    )
}