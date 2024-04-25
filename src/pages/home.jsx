import React from 'react';
import { Link } from 'react-router-dom';

export default function() {

    const createPayment = () => {
        window.location.href = '/payment-step1';
        console.log('clicked here!');
    }

    return(
        <div className="text-center">
            <h1>Welcome Home</h1>
            <p>Under Development</p>
            
            <Link to="/payment-step1">
                <button type="button" className="btn btn-success mt-3">Create Payment</button>
            </Link>
        </div>
    )
}