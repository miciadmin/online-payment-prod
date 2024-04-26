import React, { useEffect, useRef } from 'react';
import Step1 from "../component/step1";
import { useLocation, useNavigate } from "react-router-dom";

export default function() {
    const location = useLocation();
    const prevLocation = useRef("");
    const navigate = useNavigate();
    
    const handlePopstate = (event) => {
      };
      
      window.addEventListener('popstate', handlePopstate);

    useEffect(() => {
        const handlePopstate = () => {
            /*if (prevLocation.current  === "/search-policy") {
                window.history.go(-(window.history.length - 1));
                navigate("/terms-and-condition", { replace: true });
                console.log('goback');
                console.log(-(window.history.length - 1));
            }*/
            // Check if the user is leaving the PWA
            if (prevLocation.current  === "/search-policy") {
                console.log('goback');
                history.pushState(null, null, document.URL);
            }
        };
        prevLocation.current = location.pathname;
        window.addEventListener("popstate", handlePopstate);
    }, [location, history]);

    return(
        <Step1/>
    )
}