import React, { useState, useRef, useEffect} from 'react';
import Sidebar from './sidebar';
import { endpoint, currencyFormat, isValidEmail, isValidMobileNo, lpad, numInputOnly, textInputOnly, numAndTextInput} from '../js/utils';
import { useNavigate } from 'react-router-dom';
import MiciLogo from '../assets/mici_logo.svg'
import PartiallyPaidModal from './partially_paid_modal';

function Step1() {
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();
    
    const [policyDetails, setPolicyDetails] = useState(JSON.parse(sessionStorage.getItem('policyDtls')));
    const [contactDetails, setContactDetails] = useState(JSON.parse(sessionStorage.getItem('contactDtls')));
    const [amountDueType, setAmountDueType] = useState(sessionStorage.getItem('amountDueType'));

    const [showPartiallyPaidModal, setShowPartiallyPaidModal] = useState(false);
    const [isSearchingPolicy, setIsSearchingPolicy] = useState(true);
    const [errorContact, setErrorContact] = useState(null);
    const [errorPolicy, setErrorPolicy] = useState(null);
    const [policyFormData, setPolicyFormData] = useState({
        lineCd: '',
        sublineCd: '',
        issCd: '',
        issYy: '',
        seqNo: '',
        renewNo: ''
    });
    const [contactFormData, setContactFormData] = useState({
        email: '',
        mobileNo: ''
    });

    useEffect(() => {
        try {
            inputRef.current.focus();
        } catch(e) {}
        if (policyDetails) {
            setIsSearchingPolicy(false);
        }
        if (contactDetails) {
            setContactFormData({
                email: contactDetails.email,
                mobileNo: contactDetails.mobileNo,
            })
        }
    }, [policyDetails]);

    const handlePolicyFormDataChange = (e) => {
        const { name, value } = e.target;
        setPolicyFormData({
            ...policyFormData,
            [name]: value.toUpperCase()
        });
        setErrorPolicy(null);
    };

    const handleContactFormDataChange = (e) => {
        const { name, value } = e.target;
        setContactFormData({
            ...contactFormData,
            [name]: value
        });
        setErrorContact(null);
    };
    const searchAnotherPolicy = (e) => {
        setPolicyDetails(null);
        setContactDetails(null);
        setErrorPolicy(null);
        setIsSearchingPolicy(true);
        setPolicyFormData({
            lineCd: '',
            sublineCd: '',
            issCd: '',
            issYy: '',
            seqNo: '',
            renewNo: ''
        });
        setContactFormData({
            email: '',
            mobileNo: ''
        });
        try {
            inputRef.current.focus();
        } catch(e) {}
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (policyFormData.lineCd
        && policyFormData.sublineCd
        && policyFormData.issCd
        && policyFormData.issYy
        && policyFormData.seqNo
        && policyFormData.renewNo) {
            proceedPolicySearch();
        } else {
            setErrorPolicy('(Fill empty fields first)');
        }
    };
    const proceedPolicySearch = () => {
        fetchToken()
            .then(token => {
                sessionStorage.setItem('token', token);
                fetchPolicy(token);
            })
            .catch(error => {
                console.error('Failed to fetch token: ' + error);
            });
    }
    const fetchPolicy = async (token) =>  {
        try {
            setLoading(true);
            const response = await fetch(`${endpoint()}/inquire?lineCd=${policyFormData.lineCd}&sublineCd=${policyFormData.sublineCd}&issCd=${policyFormData.issCd}&issYy=${policyFormData.issYy}&seqNo=${policyFormData.seqNo}&renewNo=${policyFormData.renewNo}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if(data.isExist) {
                    let status = data.policyDetails[0].payment_stat;
                    if (status === 'FULLY PAID') {
                        setErrorPolicy('(Policy is already settled)');
                    } else if (status === 'CANCELLED') {
                        setErrorPolicy('(Policy is cancelled)');
                    } else if (status === 'OVERDUE') {
                        setErrorPolicy('(Policy is overdue)');
                    } else if (status === 'PARTIALLY PAID') {
                        setAmountDueType('Balance');
                        sessionStorage.setItem('amountDueType', 'Balance');
                        setShowPartiallyPaidModal(true);
                        setPolicyDetails(data.policyDetails[0]);
                        setIsSearchingPolicy(false);
                    } else {
                        setAmountDueType('Total');
                        sessionStorage.setItem('amountDueType', 'Total');
                        setPolicyDetails(data.policyDetails[0]);
                        setIsSearchingPolicy(false);
                    }
                } else {
                    setErrorPolicy('(Policy not found)');
                }
            } else {
                setErrorPolicy('(Server connection error)');
            }
        } catch (error) {
            setErrorPolicy('(Server connection error)');
        } finally {
            setLoading(false);
        }
    };
    const fetchToken = async () => {
        const response = await fetch(`${endpoint()}/generateToken`);
        if (!response.ok) {
            setErrorPolicy('(Server connection error)');
        }
        return await response.text();
    }
    const handleSeqNoFocusOut = (e) => {
        let newValue;
        if(Number(e.target.value) > 0) {
            newValue = lpad(e.target.value, 7);
        } else {
            newValue = '';
        }
        e.target.value = newValue;
        setPolicyFormData({
            ...policyFormData,
            seqNo: newValue
        });
    };
    const handleRenewNoFocusOut = (e) => {
        if(e.target.value) {
            let newValue = lpad(e.target.value, 2);
            e.target.value = newValue;
            setPolicyFormData({
                ...policyFormData,
                renewNo: newValue
            });
        }
    };
    const goNextPage = (e) => {
        let validEmail = isValidEmail(contactFormData.email);
        let validMobile = isValidMobileNo(contactFormData.mobileNo);
        if(validEmail) {
            if(validMobile) {
                sessionStorage.setItem('contactDtls', JSON.stringify(contactFormData));
                sessionStorage.setItem('policyDtls', JSON.stringify(policyDetails));
                navigate('/choose-method');
            } else {
                setErrorContact('(Invalid mobile number)');
            }
        } else {
            setErrorContact('(Invalid email address)');
        }
    };

    return(
        <div className="main-container">
            
            <Sidebar isContainerVisible={isSidebarVisible} onClose={()=>setSidebarVisible(false)}/>
            <PartiallyPaidModal show={showPartiallyPaidModal} handleClose={() => setShowPartiallyPaidModal(false)} />

            <div className="right-container">
                <div className="action-container2">
                    <div className="back-container2">
                        <img src={MiciLogo} alt=""/>
                        <b>MICI Online Payment</b>
                    </div>
                    <i className="bi bi-list ico-btn" onClick={()=>setSidebarVisible(!isSidebarVisible)}/>
                </div>
                <div className="steps">
                    <div className="step-line" />
                    <div className="step-items">
                        <button className="step-button done" type="button">1</button>
                        <div className="step-title">Search Policy</div>
                    </div>
                    <div className="step-items">
                        <button className="step-button" type="button">2</button>
                        <div className="step-title">Choose Method</div>
                    </div>
                        <div className="step-items">
                        <button className="step-button" type="button">3</button>
                        <div className="step-title">Review Payment</div>
                    </div>
                </div>

                <div className="note-box">
                    <p className="note-title">Please note the following guidelines for processing payments:</p>
                    <p>1. Payment Type: Only full payment for main policy is accepted.</p>
                    <p>2. Policy Status: Payments can only be processed for policies that are not overdue.</p>
                    <p>3. Claim Status: Ensure that there are no outstanding claims on your policy before proceeding with the payment.</p>
                </div>

            {isSearchingPolicy && (
                <div className="card">
                    <div className="space-between">
                        <span className="card-title mb-2">Enter your Policy No.:</span>
                        {errorPolicy && (
                            <span className="text-error" style={{display: 'block'}}>{errorPolicy}</span>
                        )}
                    </div>
                    <div className="policy-no-fields">
                        <input type="text" ref={inputRef} className="form-control text-center" name="lineCd" value={policyFormData.lineCd} onChange={handlePolicyFormDataChange} onInput={textInputOnly} maxLength={2} required/>
                        <input type="text" className="form-control text-center" name="sublineCd" value={policyFormData.sublineCd} onChange={handlePolicyFormDataChange} onInput={textInputOnly} maxLength={5} required/>
                        <input type="text" className="form-control text-center" name="issCd" value={policyFormData.issCd} onChange={handlePolicyFormDataChange} onInput={numAndTextInput} maxLength={2} required/>
                        <input type="text" className="form-control text-center" name="issYy" value={policyFormData.issYy} onChange={handlePolicyFormDataChange} onInput={numInputOnly} maxLength={2} required/>
                        <input type="text" className="form-control text-center" name="seqNo" value={policyFormData.seqNo} onChange={handlePolicyFormDataChange} onInput={numInputOnly} onBlur={handleSeqNoFocusOut} maxLength={7} required/>
                        <input type="text" className="form-control text-center" name="renewNo" value={policyFormData.renewNo} onChange={handlePolicyFormDataChange} onInput={numInputOnly} onBlur={handleRenewNoFocusOut} maxLength={2} required/>
                    </div>
                    <span className="text-gray my-2">(Example: PA-SPA-HO-24-0000123-00)</span>
                    <div className="text-center">
                        <button type="button" className="btn btn-success btn-w" onClick={handleSubmit}>
                            {loading ? <><i className="spinner-border spinner-border-sm"></i> Searching</> : <><i className="bi bi-search"></i> Search</>}
                        </button>
                    </div>
                </div>
            )}

            {policyDetails && (
                <div>
                    <div id="policy-dtls-container">
                        <div className="card">
                            <span className="card-title">Policy Details</span>
                            <div className="row">
                                <div className="space-between col-md-12">
                                    <span className="text-gray">Policy No.:</span>
                                    <span className="text-right" id="policy-no">
                                        {policyDetails.line_cd}-
                                        {policyDetails.subline_cd}-
                                        {policyDetails.iss_cd}-
                                        {policyDetails.issue_yy}-
                                        {lpad(policyDetails.pol_seq_no, 7)}-
                                        {lpad(policyDetails.renew_no, 2)}
                                    </span>
                                </div>
                                <div className="space-between col-md-12 mt-1">
                                    <span className="text-gray">Invoice No.:</span>
                                    <span className="text-right">{policyDetails.invoice_no_formatted}</span>
                                </div>
                                <div className="space-between col-md-12 mt-1">
                                    <span className="text-gray">Assured:</span>
                                    <span className="text-right">{policyDetails.assd_name}</span>
                                </div>
                                <div className="space-between col-md-12 mt-1">
                                    <span className="text-gray">Due Date:</span>
                                    <span className="text-right">{policyDetails.due_date}</span>
                                </div>
                                <div className="space-between col-md-12 mt-2">
                                    <span className="text-gray">{amountDueType === 'Balance' ? 'Balance Amount Due:' : 'Total Amount Due:' }</span>
                                    <span className="text-right fw-bold">Php {currencyFormat(policyDetails.balance_amt_due)}</span>
                                </div>
                            </div>
                            <div className="text-center mt-3">
                                <button type="button" className="btn btn-outline-success btn-w" onClick={searchAnotherPolicy}> Search another policy</button>
                            </div>
                        </div>
                    </div>

                    
                    <div id="add-contact-container">
                        <div className="divider"></div>

                        <div className="card">
                            <span className="card-title">Add Contact Details</span>
                            <div className="row">
                                <div className="col-xl-6">
                                    <label htmlFor="inputPassword5" className="form-label text-gray">Email*</label>
                                    <input type="text" className="form-control" name="email" value={contactFormData.email} onChange={handleContactFormDataChange} required/>
                                </div>
                                <div className="col-xl-6 mt-1">
                                    <label htmlFor="inputAddress5" className="form-label text-gray">Mobile No*</label>
                                    <input type="text" className="form-control" name="mobileNo" value={contactFormData.mobileNo} onChange={handleContactFormDataChange} required/>
                                </div>
                            </div>
                            {errorContact &&(
                                <span className="text-error" style={{display: 'block'}}>{errorContact}</span>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="row mt-4">
                            <div className="col-sm-6 mb-2"></div>
                            <div className="col-sm-6 text-right">
                                <button type="button" className="btn btn-success btn-w" onClick={goNextPage}>Next <i className="bi bi-chevron-right fs-12 ml-2"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                
            </div>
        </div>
    )
}

export default Step1