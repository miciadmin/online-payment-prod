import React, { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function ResultPage() {
    const navigate = useNavigate();
    const [resultDetails, setResultDetails] = useState(JSON.parse(sessionStorage.getItem('resultDtls')));

    sessionStorage.clear();     
    window.history.pushState({}, '', '/');

    return(
        <div className="center-div">
            <div className="result-container">
                <div className="header">
                    <i className="bi bi-check-circle text-medium" />
                    <span>Payment Successful</span>
                </div>
                <div className="body">
                {resultDetails && (
                    <span>Reference No: {resultDetails.RefNo}</span>
                )}  
                    <p>
                        Thank you for your payment! Your policy has been successfully paid, 
                        and an email containing the details has been sent to you. 
                        If you have any questions, feel free to contact us @ www.mercantile.ph
                    </p>
                    <div className="result-buttons">
                        <button type="button" className="btn btn-outline-success mt-3" onClick={() => navigate('/search-policy')}>Go to homepage</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ResultPage