import React, { useState, useRef, useEffect} from 'react';
import Sidebar from './sidebar';
import { endpoint, goBack} from '../js/utils';
import MiciLogo from '../assets/mici_logo.svg'
import { useNavigate } from 'react-router-dom';

function SearchRefNo() {
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [errorRefNo, setErrorRefNo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refNoFormData, setRefNoFormData] = useState({
        refNo: ''
    });
    const handleRefNoFormDataChange = (e) => {
        const { name, value } = e.target;
        setRefNoFormData({
            ...refNoFormData,
            [name]: value.toUpperCase()
        });
        setErrorRefNo(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(refNoFormData.refNo) {
            proceedRefNoSearch();
        }
    };
    const proceedRefNoSearch = async () =>  {
        try {
            setLoading(true);
            const response = await fetch(`${endpoint()}/payment/getStatByRefNo/${refNoFormData.refNo}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if(data.isExist) {
                setPaymentDetails(data.paymentDetails);
                console.log(data.paymentDetails);
                console.log(paymentDetails);
                setErrorRefNo(false);
            } else {
                setPaymentDetails(null);
                setErrorRefNo(true);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="main-container">
            
            <Sidebar isVisible={isSidebarVisible}  onClose={()=>setSidebarVisible(false)}/>

            <div className="right-container">
                <div className="action-container2">
                    <div className="back-container2">
                        <img src={MiciLogo} alt=""/>
                        <span>MICI Online Payment</span>
                    </div>
                    <i className="bi bi-list ico-btn" onClick={()=>setSidebarVisible(!isSidebarVisible)}/>
                </div>

                <div className="card mt-4">
                    <div className="space-between">
                        <span className="card-title mb-2">Enter your Reference No.:</span>
                    </div>
                    <div>
                        <input type="text" className="form-control text-center" name="refNo" value={refNoFormData.refNo} onChange={handleRefNoFormDataChange} maxLength={10} required/>
                    </div>
                    <div className="text-center mt-3">
                        <button type="button" className="btn btn-success btn-w" onClick={handleSubmit}>
                            {loading ? <><i className="spinner-border spinner-border-sm"></i> Checking...</> : <><i className="bi bi-search"></i> View Status</>}
                        </button>
                    </div>
                </div>
                
                {paymentDetails && (
                    <>
                    <div className="divider"></div>
                    <div className="card">
                        <iframe className="payment-details" src={"https://test.dragonpay.ph/Bank/GetEmailInstruction.aspx?refno=" + paymentDetails.RefNo} title="Payment Status"></iframe>
                    </div>
                    </>
                )}

                {errorRefNo && (
                    <div className="text-center">
                        <span className="text-error">(Reference No. not found!)</span>
                    </div>
                )}

            </div>
        </div>
    )
}

export default SearchRefNo