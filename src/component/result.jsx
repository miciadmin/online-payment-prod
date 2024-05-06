import React, { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { endpoint } from '../js/utils';

function ResultPage() {
    const { status } = useParams();
    const navigate = useNavigate();
    const [resultDetails, setResultDetails] = useState(JSON.parse(sessionStorage.getItem('resultDtls')));

    useEffect(() => {
        console.log(status);
        if (status === 'S') {
            console.log('Payment successfull: sending email.');
            sendSuccessEmail();
        } else {
            console.log('Payment failed.');
        }
        sessionStorage.clear();     
        window.history.pushState({}, '', '/');
    }, [status]);

    const sendSuccessEmail = async () => {
        const token = sessionStorage.getItem('token');
        try {
            //setLoading(true);
            const response = await fetch(`${endpoint()}/sendSuccessEmail?refNo=${params.refno}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            const data = response;
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            //setLoading(false);
        }
    }

    return(
        <div className="center-div">
            <div className="result-container">
                {status === 'S' ? (
                    <>
                        <div className="header bg-success">
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
                                <button type="button" className="btn btn-outline-success mt-3" onClick={() => navigate('/')}>Go to homepage</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="header bg-danger">
                            <i className="bi bi-x-circle text-medium" />
                            <span>Payment Failed</span>
                        </div>
                        <div className="body">
                            <p>Oops! It seems there was an issue with your payment. Unfortunately, we were unable to process your payment for your policy.</p>
                            <p>Please check your payment details and try again. If you continue to experience issues, feel free to contact us at www.mercantile.ph for further assistance.</p>
                            <div className="result-buttons">
                                <button type="button" className="btn btn-outline-success mt-3" onClick={() => navigate('/')}>Go to homepage</button>
                            </div>
                        </div>
                    </>
                )}                
            </div>
        </div>

    )
}

export default ResultPage