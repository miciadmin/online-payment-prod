import React from 'react';
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
    const navigate = useNavigate();

    return(
        <div className="center-div">
            <div className="error-container">
                <div className="header bg-secondary">
                    <span>404</span>
                </div>
                <div className="body">
                    <p>The page you are looking for doesn't exist.</p>
                    <div className="result-buttons">
                        <button type="button" className="btn btn-outline-success mt-3" onClick={() => navigate('/')}>Go to homepage</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage