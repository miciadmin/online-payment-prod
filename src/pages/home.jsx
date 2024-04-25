import React from 'react';

export default function() {

    const createPayment = () => {
        window.location.href = '/payment-step1';
    }

    return(
        <div className="text-center">
            <h1>Welcome Home</h1>
            <p>Under Development</p>
            
            <button type="button" className="btn btn-success mt-3" onClick={createPayment}>Create Payment</button>
        </div>
    )
}