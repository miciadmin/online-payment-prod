import React, { useEffect} from 'react';
import Step1 from "../component/step1";

export default function() {
    
    useEffect(() => {
        const handlePopstate = () => {
            if (location.pathname === "/search-policy") {
              window.history.go(-(window.history.length - 1));
            }
        };
        window.addEventListener("popstate", handlePopstate);
    }, []);

    return(
        <Step1/>
    )
}