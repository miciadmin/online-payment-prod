import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function() {
    const navigate = useNavigate();

    return(
        <div className="text-center">
            <h1>Welcome Home</h1>
            <p>Under Development</p>
            
            <button type="button" className="btn btn-success mt-3" onClick={() => navigate('payment-step')}>Create Payment</button>
        </div>
    )
}