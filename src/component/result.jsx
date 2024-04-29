import React, { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function ResultPage() {
    const navigate = useNavigate();
    const [resultDetails, setResultDetails] = useState(JSON.parse(sessionStorage.getItem('resultDtls')));

    const viewInstructions = () => {
        const newWindow = window.open(resultDetails.Url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }
    const gotoHome = () => {
        window.location.href = 'home';
    }
    
    return(
        <div className="center-div">
            <div className="result-container">
                <div className="header">
                    <i className="bi bi-check-circle text-medium" />
                    <span>Payment request has been initiated!</span>
                </div>
                <div className="body">
                {resultDetails && (
                    <span>Reference No: {resultDetails.RefNo}</span>
                )}  
                    <p>
                        An email has been sent to you with payment instructions.
                        For over-the-counter payments, you will need the link contained in the
                        instruction to validate your payment. You may also view the instruction
                        online but save/print/bookmark it for future reference.
                    </p>
                    <div className="result-buttons">
                        <button type="button" className="btn btn-success" onClick={viewInstructions}>View Instructions online</button>
                        <button type="button" className="btn btn-outline-success mt-3" onClick={() => navigate('/search-policy')}>Go to homepage</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ResultPage