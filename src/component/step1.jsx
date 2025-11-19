import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './sidebar';
import CookiePermission from './cookies_permission';
import { endpoint, currencyFormat, isValidEmail, isValidMobileNo, lpad, numInputOnly, textInputOnly, numAndTextInput } from '../js/utils';
import { useNavigate } from 'react-router-dom';
import MiciLogo from '../assets/mici_logo.svg'
import PartiallyPaidModal from './partially_paid_modal';
import ReadyForORModal from './ready_for_or_modal';

function Step1() {
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef({
        lineCd: null,
        sublineCd: null,
        issCd: null,
        issYy: null,
        seqNo: null,
        renewNo: null,
    });

    const [policyDetails, setPolicyDetails] = useState(JSON.parse(sessionStorage.getItem('policyDtls')));
    const [contactDetails, setContactDetails] = useState(JSON.parse(sessionStorage.getItem('contactDtls')));
    const [amountDueType, setAmountDueType] = useState(sessionStorage.getItem('amountDueType'));

    const [showReadyForORModal, setShowReadyForORModal] = useState(false);
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
            inputRef.current['lineCd'].focus();
        } catch (e) { }
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
        } catch (e) { }
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
    const handleClear = async (e) => {
        e.preventDefault();
        setPolicyFormData({
            lineCd: '',
            sublineCd: '',
            issCd: '',
            issYy: '',
            seqNo: '',
            renewNo: ''
        });
        setErrorPolicy(null);
        setErrorContact(null);
        try {
            inputRef.current['lineCd'].focus();
        } catch (e) { }
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
    const fetchPolicy = async (token) => {
        try {
            setLoading(true);

            // generate captcha token
            const recaptchaToken = await grecaptcha.enterprise.execute(
                import.meta.env.VITE_RECAPTCHA_SITE_KEY,
                { action: 'INQUIRY' }
            );

            // Send GET request with query and token
            const url = new URL(`${endpoint()}/inquire/policy-details`);
            url.searchParams.append("lineCd", policyFormData.lineCd);
            url.searchParams.append("sublineCd", policyFormData.sublineCd);
            url.searchParams.append("issCd", policyFormData.issCd);
            url.searchParams.append("issYy", policyFormData.issYy);
            url.searchParams.append("seqNo", policyFormData.seqNo);
            url.searchParams.append("renewNo", policyFormData.renewNo);
            url.searchParams.append("recaptchaToken", recaptchaToken);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // Get the error text from response
                const errorText = await response.text();
                setErrorPolicy(errorText);
                return;
            }

            const data = await response.json();
            console.log(data);
            if (data.isExist) {
                let status = data.policyDetails.payment_stat;
                if (status === 'SPOILED') {
                    setErrorPolicy('(Policy is spoiled)');
                } else if (status === 'CANCELLED') {
                    setErrorPolicy('(Policy is cancelled)');
                } else if (status === 'OTHER_CURRENCY') {
                    setErrorPolicy('(Policy currency not allowed)');
                } else if (status === 'FULLY_PAID') {
                    setErrorPolicy('(Policy is already settled)');
                } else if (status === 'HAS_SUCCESSFUL_PAYMENT') {
                    setShowReadyForORModal(true);
                } else if (status === 'TEMPORARY_PAYMENT') {
                    setErrorPolicy('(Policy has pending transaction)');
                } else if (status === 'OVERDUE') {
                    setErrorPolicy('(Policy is overdue)');
                } else if (status === 'WITH_CLAIM') {
                    setErrorPolicy('(Policy has pending claim)');
                } else if (status === 'PARTIALLY_PAID') {
                    setAmountDueType('Balance');
                    sessionStorage.setItem('amountDueType', 'Balance');
                    setShowPartiallyPaidModal(true);
                    setPolicyDetails(data.policyDetails);
                    setIsSearchingPolicy(false);
                } else {
                    setAmountDueType('Total');
                    sessionStorage.setItem('amountDueType', 'Total');
                    setPolicyDetails(data.policyDetails);
                    setIsSearchingPolicy(false);
                }
            } else {
                setErrorPolicy('(Policy not found)');
            }
        } catch (error) {
            setErrorPolicy('Server connection error');
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
    const handleMaxLength = (e) => {
        /*const { maxLength, value, name } = e.target;
        if (value.length >= maxLength) {
            const nextFieldMap = {
                lineCd: 'sublineCd',
                sublineCd: 'issCd',
                issCd: 'issYy',
                issYy: 'seqNo',
                seqNo: 'renewNo',
            };
            const nextField = nextFieldMap[name];
            if (nextField && inputRef.current[nextField]) {
                inputRef.current[nextField].focus();
            }
        }*/
    };
    /*const handleSeqNoFocusOut = (e) => {
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
    };*/
    const gotoNextPage = (e) => {
        let validEmail = isValidEmail(contactFormData.email);
        let validMobile = isValidMobileNo(contactFormData.mobileNo);
        if (validEmail) {
            if (validMobile) {
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

    return (
        <div className="main-container">

            <Sidebar isContainerVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
            <PartiallyPaidModal show={showPartiallyPaidModal} handleClose={() => setShowPartiallyPaidModal(false)} />
            <ReadyForORModal show={showReadyForORModal} handleClose={() => setShowReadyForORModal(false)} />

            <div className="right-container">
                <div className="action-container2">
                    <div className="back-container2">
                        <img src={MiciLogo} alt="" />
                        <b>Online Payment Facility</b>
                    </div>
                    <i className="bi bi-list ico-btn" onClick={() => setSidebarVisible(!isSidebarVisible)} />
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
                    <p>1. <strong>Payment Type:</strong> Only full payment for main policy is accepted.</p>
                    <p>2. <strong>Policy Status:</strong> Payments can only be processed for policies that are not overdue.</p>
                    <p>3. <strong>Claim Status:</strong> Ensure that there are no outstanding claims on your policy before proceeding with the payment.</p>
                </div>

                {isSearchingPolicy && (
                    <div className="card">
                        <div className="space-between">
                            <span className="card-title mb-2">Enter your Policy No.:</span>
                            {errorPolicy && (
                                <span className="text-error text-end" style={{ display: 'block' }}>{errorPolicy}</span>
                            )}
                        </div>
                        <div className="policy-no-fields">
                            <input type="text" ref={(e) => (inputRef.current.lineCd = e)} className="form-control text-center" name="lineCd" value={policyFormData.lineCd} onChange={handlePolicyFormDataChange} onInput={(e) => { textInputOnly(e); handleMaxLength(e, 0); }} maxLength={2} required />
                            <input type="text" ref={(e) => (inputRef.current.sublineCd = e)} className="form-control text-center" name="sublineCd" value={policyFormData.sublineCd} onChange={handlePolicyFormDataChange} onInput={(e) => { numAndTextInput(e); handleMaxLength(e, 0); }} maxLength={7} required />
                            <input type="text" ref={(e) => (inputRef.current.issCd = e)} className="form-control text-center" name="issCd" value={policyFormData.issCd} onChange={handlePolicyFormDataChange} onInput={(e) => { numAndTextInput(e); handleMaxLength(e, 0); }} maxLength={2} required />
                            <input type="text" ref={(e) => (inputRef.current.issYy = e)} className="form-control text-center" name="issYy" value={policyFormData.issYy} onChange={handlePolicyFormDataChange} onInput={(e) => { numInputOnly(e); handleMaxLength(e, 0); }} maxLength={2} required />
                            <input type="text" ref={(e) => (inputRef.current.seqNo = e)} className="form-control text-center" name="seqNo" value={policyFormData.seqNo} onChange={handlePolicyFormDataChange} onInput={(e) => { numInputOnly(e); handleMaxLength(e, 0); }} /*onBlur={handleSeqNoFocusOut}*/ maxLength={7} required />
                            <input type="text" ref={(e) => (inputRef.current.renewNo = e)} className="form-control text-center" name="renewNo" value={policyFormData.renewNo} onChange={handlePolicyFormDataChange} onInput={(e) => { numInputOnly(e); handleMaxLength(e, 0); }} /*onBlur={handleRenewNoFocusOut}*/ maxLength={2} required />
                        </div>
                        <span className="text-gray my-2">(Example: PA-SPA-HO-24-0000123-00)</span>
                        <div className="search-btn-div">
                            <button type="button" className="btn btn-success btn-w" onClick={handleSubmit}>
                                {loading ? <><i className="spinner-border spinner-border-sm"></i> Searching</> : <><i className="bi bi-search"></i> Search</>}
                            </button>
                            <button type="button" className="btn btn-outline-success btn-w" onClick={handleClear}>
                                <i className="bi bi-arrow-left-square"></i> Clear
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
                                        <span className="text-gray">Policy Number:</span>
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
                                        <span className="text-gray">Invoice Number:</span>
                                        <span className="text-right">{policyDetails.invoice_no_formatted}</span>
                                    </div>
                                    <div className="space-between col-md-12 mt-1">
                                        <span className="text-gray">Assured Name:</span>
                                        <span className="text-right">{policyDetails.assd_name}</span>
                                    </div>
                                    <div className="space-between col-md-12 mt-1">
                                        <span className="text-gray">Due Date:</span>
                                        <span className="text-right">{policyDetails.due_date}</span>
                                    </div>
                                    <div className="space-between col-md-12 mt-2">
                                        <span className="text-gray">{amountDueType === 'Balance' ? 'Balance Amount Due:' : 'Total Amount Due:'}</span>
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
                                <div>
                                    <span className="card-title">Contact Details </span>
                                    <span>(to recieve payment confirmation)</span>
                                </div>
                                <div className="row">
                                    <div className="col-xl-6 mb-1">
                                        <label htmlFor="inputPassword5" className="form-label text-gray">Email Address*</label>
                                        <input type="text" className="form-control" name="email" value={contactFormData.email} onChange={handleContactFormDataChange} required />
                                    </div>
                                    <div className="col-xl-6">
                                        <label htmlFor="inputAddress5" className="form-label text-gray">Mobile Number*</label>
                                        <input type="text" className="form-control" name="mobileNo" value={contactFormData.mobileNo} onChange={handleContactFormDataChange} required />
                                    </div>
                                </div>
                                {errorContact && (
                                    <span className="text-error" style={{ display: 'block' }}>{errorContact}</span>
                                )}
                            </div>
                        </div>

                        <div className="card">
                            <div className="row mt-4">
                                <div className="col-sm-6 mb-2"></div>
                                <div className="col-sm-6 text-right">
                                    <button type="button" className="btn btn-success btn-w" onClick={gotoNextPage}>Next <i className="bi bi-chevron-right fs-12 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <CookiePermission />
        </div>
    )
}

export default Step1