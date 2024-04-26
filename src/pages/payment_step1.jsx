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
            if (prevLocation.current  === "/search-policy") {
                for (let i = 0; i < window.history.length; i++) {
                    //history.back();
                    history.go(-1);
                }
            }
        };
        prevLocation.current = location.pathname;
        window.addEventListener("popstate", handlePopstate);
    }, [location, history]);

    return(
        <Step1/>
    )
}