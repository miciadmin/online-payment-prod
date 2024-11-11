import React, { useState, useEffect} from 'react';
import Sidebar from './sidebar';
import CCLogo from '../assets/credit_card_icon.png'
import { endpoint, currencyFormat, lpad, goBack, getCurrentDateTime, 
         bpiLogo, cbcLogo, rcbcLogo, ubpLogo, gcashLogo, mayaLogo, ccLogo, bogusLogo } from '../js/utils';
import { useNavigate } from 'react-router-dom';
import InvalidTokenModal from './invalid_session_modal';
import ErrorModal from './fatal_error_modal';

function Step3() {
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const [policyId, setPolicyId] = useState(JSON.parse(sessionStorage.getItem('policyId')));
    const [policyDetails, setPolicyDetails] = useState(JSON.parse(sessionStorage.getItem('policyDtls')));
    const [contactDetails, setContactDetails] = useState(JSON.parse(sessionStorage.getItem('contactDtls')));
    const [creditDetails, setCreditDetails] = useState(JSON.parse(sessionStorage.getItem('creditDtls')));
    const [selectedMethod, setSelectedMethod] = useState(sessionStorage.getItem('paymentMethod'));
    const [amountDueType, setAmountDueType] = useState(sessionStorage.getItem('amountDueType'));

    const [showInvalidTokenModal, setShowInvalidTokenModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const [ipAddress, setIpAddress] = useState(null);
    const [userAgent, setUserAgent] = useState(null);

    const bankDetails = [
        { procId: "BPIA",
          longName: "BPI Online/Mobile",
          logo: bpiLogo() },
        { procId: "CBDD",
          longName: "China Bank Online Direct Debit",
          logo: cbcLogo() },
        { procId: "RCDD",
          longName: "RCBC Online Direct Debit",
          logo: rcbcLogo() },
        { procId: "UBDD",
          longName: "Unionbank Online Direct Debit",
          logo: ubpLogo() },
        { procId: "GCSH",
          longName: "Globe GCash",
          logo: gcashLogo() },
        { procId: "PYMY",
          longName: "PayMaya",
          logo: mayaLogo() },
        { procId: "CC",
          longName: "Credit Card",
          logo: ccLogo() },
        { procId: "BOG",
          longName: "Test Bank Online",
          logo: bogusLogo() },
        { procId: "BOGX",
          longName: "Test Bank Over-the-Counter",
          logo: bogusLogo() }
    ];

    useEffect(() => {
        getUserIpAddress();
        setUserAgent(getUserAgent);
    }, [policyDetails]);
    
    const proceedPayment = async (e) => {
        let requestBody = {};
        if(policyDetails && contactDetails) {

            const policyNo = policyDetails.line_cd + '-' +
                             policyDetails.subline_cd + '-' +
                             policyDetails.iss_cd + '-' +
                             policyDetails.issue_yy + '-' +
                             lpad(policyDetails.pol_seq_no, 7) + '-' +
                             lpad(policyDetails.renew_no, 2);
            const policyDescription = 'Policy No: ' + policyNo + '; \n' +
                            'Invoice No: ' + policyDetails.invoice_no_formatted + '; \n' +
                            'Assured Name: ' + policyDetails.assd_name;

            if(selectedMethod == 7) {
                requestBody = {
                    PolicyId: policyDetails.policy_id,
                    Amount: policyDetails.balance_amt_due,
                    Currency: "PHP",
                    Description: policyDescription,
                    Email: contactDetails.email,
                    ProcId: "CC",
                    TnxId: policyDetails.invoice_no + '-' + getCurrentDateTime(),
                    BillingDetails: {
                        FirstName: creditDetails.fname,
                        MiddleName: creditDetails.mname,
                        LastName: creditDetails.lname,
                        Address1: creditDetails.street,
                        Address2: creditDetails.brgy,
                        City: creditDetails.city,
                        Province: creditDetails.province,
                        Country: creditDetails.country,
                        ZipCode: (creditDetails.zipcode ? creditDetails.zipcode : null),
                        TelNo: contactDetails.mobileNo,
                        Email: contactDetails.email
                    },
                    IpAddress: ipAddress,
                    UserAgent: userAgent
                };
            } else {
                requestBody = {
                    PolicyId: policyDetails.policy_id,
                    Amount: policyDetails.balance_amt_due,
                    Currency: "PHP",
                    Description: policyDescription,
                    Email: contactDetails.email,
                    ProcId: bankDetails[selectedMethod-1].procId,
                    TnxId: policyDetails.invoice_no + '-' + getCurrentDateTime(),
                    IpAddress: ipAddress,
                    UserAgent: userAgent
                };
            }
            console.log(requestBody);
            processPayment(requestBody);
        }
    }
    const processPayment = async (requestBody) =>  {
        const token = sessionStorage.getItem('token');
        try {
            setLoading(true);
            const response = await fetch(`${endpoint()}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            console.log(data);
            if (data.Status === 'S') {
                window.location.href = data.Url;
            } else if(data.Status === 'invalid_or_expired_token')  {
                setShowInvalidTokenModal(true);
            } else if(data.Status === 'amount_mismatch')  {
                setErrorType('fatal_error');
                setErrorMsg('Payment processing failed due to an amount mismatch.');
                setShowErrorModal(true);
            } else {
                if(data.ErrorType.includes('Invalid procid')) {
                    setErrorType('invalid_procid');
                    setErrorMsg(bankDetails[selectedMethod-1].longName + ' is unavailable right now. Please try another payment method.');
                } else {
                    setErrorType('fatal_error');
                    setErrorMsg('Oops, something went wrong. Please try again later.');
                }
                setShowErrorModal(true);
            }
        } catch (error) {
            setErrorType('fatal_error');
            setErrorMsg('Oops, something went wrong. Please try again later.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };
    const getUserIpAddress = async () => {
        try {
          const response = await fetch('https://api64.ipify.org?format=json');
          const data = await response.json();
          setIpAddress(data.ip)
          return data.ip;
        } catch (error) {
          console.error('Error:', error);
          return 'null';
        }
    };
    const getUserAgent = () => {
        return navigator.userAgent;
    };
      
    return(
        <div className="main-container">

            <Sidebar isContainerVisible={isSidebarVisible} onClose={()=>setSidebarVisible(false)}/>
            <InvalidTokenModal show={showInvalidTokenModal} handleClose={() => setShowInvalidTokenModal(false)} />
            <ErrorModal show={showErrorModal} handleClose={() => setShowErrorModal(false)} errType= {errorType} errMsg={errorMsg}/>
                
            <div className="right-container">
                
                <div className="action-container2">
                    <div className="back-container2" onClick={goBack}>
                        <i className="bi bi-arrow-left-short ico-btn" />
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
                        <button className="step-button done" type="button">2</button>
                        <div className="step-title">Choose Method</div>
                    </div>
                        <div className="step-items">
                        <button className="step-button done" type="button">3</button>
                        <div className="step-title">Review Payment</div>
                    </div>
                </div>

                <div className="card mt-3 mb-0">
                    <span className="card-title">Policy Details</span>
                    <div className="row">
                        <div className="space-between col-md-12">
                            <span className="text-gray">Policy Number:</span>
                            <span className="text-right">
                                {policyDetails.line_cd}-
                                {policyDetails.subline_cd}-
                                {policyDetails.iss_cd}-
                                {policyDetails.issue_yy}-
                                {lpad(policyDetails.pol_seq_no, 7)}-
                                {lpad(policyDetails.renew_no, 2)}
                            </span>
                        </div>
                        <div className="space-between col-md-12 mt-1">
                            <span className="text-gray">Assured Name:</span>
                            <span className="text-right">{policyDetails.assd_name}</span>
                        </div>
                        <div className="space-between col-md-12 mt-1">
                            <span className="text-gray">Invoice Number:</span>
                            <span className="text-right">{policyDetails.invoice_no_formatted}</span>
                        </div>
                        <div className="space-between col-md-12 mt-1">
                            <span className="text-gray">Due Date:</span>
                            <span className="text-right">{policyDetails.due_date}</span>
                        </div>
                    </div>
                </div>
                <div className="divider" />

                <div className="card my-0">
                    <span className="card-title">Contact Details</span>
                    <div className="row">
                        <div className="space-between col-md-12">
                            <span className="text-gray">Email Address:</span>
                            <span className="text-right">{contactDetails.email}</span>
                        </div>
                        <div className="space-between col-md-12 mt-1">
                            <span className="text-gray">Mobile Number:</span>
                            <span className="text-right">{contactDetails.mobileNo}</span>
                        </div>
                    </div>
                </div>

                <div className="divider" />

                {amountDueType === 'Total' ? (
                    <div className="card my-0">
                        <span className="card-title">Amount Breakdown</span>
                        <div className="row">
                            <div className="space-between col-md-12">
                                <span className="text-gray">Premium Amount:</span>
                                <span className="text-right">{currencyFormat(policyDetails.prem_amt)}</span>
                            </div>
                            <div className="space-between col-md-12 mt-1">
                                <span className="text-gray">Tax Amount:</span>
                                <span className="text-right">{currencyFormat(policyDetails.tax_amt)}</span>
                            </div>
                            <div className="space-between col-md-12 mt-1">
                                <span>Total Payable Amount:</span>
                                <span className="text-right fw-bold">Php {currencyFormat(policyDetails.total_amt_due)}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card my-0">
                        <span className="card-title">Amount Breakdown</span>
                        <div className="row">
                            <div className="space-between col-md-12">
                                <span>Payable Amount:</span>
                                <span className="text-right fw-bold">Php {currencyFormat(policyDetails.balance_amt_due)}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="divider" />

                <div className="card my-0">
                    <span className="card-title">Payment Method</span>
                    {selectedMethod == 7 ? (
                        <div className="row">
                            <div className="space-between col-md-12 mt-1">
                            <span className="text-gray mt-1">Source:</span>
                            <div>
                                <span>Credit Card</span>
                                <img className="bank-img ml-2" src={CCLogo} />
                            </div>
                            </div>
                            <div className="space-between col-md-12 mt-1">
                                <span className="text-gray">Full Name:</span>
                                <span className="text-right">{creditDetails.fname} {creditDetails.mname} {creditDetails.lname}</span>
                            </div>
                            <div className="space-between col-md-12 mt-1">
                                <span className="text-gray">Complete Address:</span>
                                <span className="text-right">{creditDetails.street}, {creditDetails.brgy}, {creditDetails.city}, {creditDetails.province}, {creditDetails.country} {creditDetails.zipcode}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="space-between col-md-12">
                            <span className="text-gray">Source:</span>
                            <div className="text-right">
                                <span>{bankDetails[selectedMethod-1].longName}</span>
                                <img className="bank-img ml-2" src={bankDetails[selectedMethod-1].logo} alt="" loading="lazy"/>
                            </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="card">
                    <div className="row mt-4">
                    <div className="col-sm-6 mb-2">
                        <button id="previous-page-btn" type="button" className="btn btn-outline-success btn-w" onClick={goBack}><i className="bi bi-chevron-left fs-12 mr-2" /> Previous</button>
                    </div>
                    <div className="col-sm-6 text-right">
                        <button id="next-page-btn"type="button"className="btn btn-success btn-w" onClick={proceedPayment}>
                            {loading ? <>Loading... <i className="spinner-border spinner-border-sm"></i></> : <>Proceed <i className="bi bi-chevron-right fs-12 ml-2"></i></>}
                        </button>
                        
                    </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Step3