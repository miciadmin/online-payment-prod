import React, { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { endpoint } from '../js/utils';

function ResultPage(status, refno) {
    const navigate = useNavigate();

    /*useEffect(() => {
        if (status === 'S') {
            console.log('Payment successfull: sending email.');
            sendSuccessEmail();
        }
        sessionStorage.clear();     
        window.history.pushState({}, '', '/');
    }, [status]);

    const sendSuccessEmail = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(`${endpoint()}/sendSuccessEmail?refNo=${refno}`, {
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
        }
    }*/
    
    const [params, setParams] = useState({});
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paramsObject = {};
        for (const [key, value] of urlParams) {
          paramsObject[key] = value;
        }
        setParams(paramsObject);
        sessionStorage.clear();     
    }, []);
    
    /*useEffect(() => {
        if (params.refno
        && params.digest
        && params.message
        && params.txnid
        && params.status) {
            console.log('Payment successfull: sending email.');
            sendSuccessEmail();
        } 
    }, [params]);
    
    const sendSuccessEmail = async () => {
        const token = sessionStorage.getItem('token');
        try {
            fetch(`${endpoint()}/sendSuccessEmail?refNo=${params.refno}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            sessionStorage.clear();     
        }
    }*/

    return(
        <div className="center-div">
            <div className="result-container">
                {params.status === 'S' ? (
                    <>
                        <div className="header bg-success">
                            <i className="bi bi-check-circle text-medium" />
                            <span>Payment Successful</span>
                        </div>
                        <div className="body">
                            <span>Reference No: {params.refno}</span>
                            <p>
                                Thank you for your payment! Your policy has been successfully paid, 
                                and an email containing the details has been sent to you. 
                                If you have any questions, feel free to contact us at www.mercantile.ph
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
                            <p>Oops! It seems there was an issue with your payment. Either the payment has been cancelled, or the transaction failed.</p>
                            <p>If you continue to experience issues, feel free to contact us at www.mercantile.ph for further assistance.</p>
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