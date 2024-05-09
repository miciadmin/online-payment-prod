import React, { useEffect, useState, useRef } from 'react';
import Step1 from "../component/step1";
import { useLocation, useNavigate } from "react-router-dom";

export default function() {
    const location = useLocation();
    const prevLocation = useRef("");
    const navigate = useNavigate();
    const [params, setParams] = useState({});
    
    const handlePopstate = (event) => { };
   
    window.addEventListener('popstate', handlePopstate);

    useEffect(() => {
        const handlePopstate = () => {
            if (prevLocation.current  === "/search-policy"
            || prevLocation.current  === "/") {
                for (let i = 0; i < window.history.length; i++) {
                    history.go(-1);
                }
            }
        };
        prevLocation.current = location.pathname;
        window.addEventListener("popstate", handlePopstate);
    }, [prevLocation]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paramsObject = {};
        for (const [key, value] of urlParams) {
          paramsObject[key] = value;
        }
        setParams(paramsObject);
    }, []);
    
    useEffect(() => {
        if (params.refno
        && params.digest
        && params.message
        && params.txnid
        && params.status) {
            navigate(`/payment-result/${params.status}/${params.refno}`);
        } 
    }, [params]);
    
    return(
        <Step1/>
    )
}