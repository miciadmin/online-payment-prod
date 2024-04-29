import React, { useState, useEffect} from 'react';
import Sidebar from './sidebar';
import CCLogo from '../assets/credit_card_icon.png'
import { endpoint, currencyFormat, lpad, goBack, getCurrentDateTime } from '../js/utils';
import { useNavigate } from 'react-router-dom';

function Step3() {
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const [policyDetails, setPolicyDetails] = useState(JSON.parse(sessionStorage.getItem('policyDtls')));
    const [contactDetails, setContactDetails] = useState(JSON.parse(sessionStorage.getItem('contactDtls')));
    const [creditDetails, setCreditDetails] = useState(JSON.parse(sessionStorage.getItem('creditDtls')));
    const [selectedMethod, setSelectedMethod] = useState(sessionStorage.getItem('paymentMethod'));

    const [ipAddress, setIpAddress] = useState(null);
    const [userAgent, setUserAgent] = useState(null);

    const bankDetails = [
        { procId: "BPIA",
          longName: "BPI Online/Mobile",
          logo: "https://test.dragonpay.ph/Bank/images/bpilogo.jpg" },
        { procId: "CBDD",
          longName: "China Bank Online Direct Debit",
          logo: "https://test.dragonpay.ph/Bank/images/cbclogo.jpg" },
        { procId: "RCDD",
          longName: "RCBC Online Direct Debit",
          logo: "https://test.dragonpay.ph/Bank/images/rcbclogo.jpg" },
        { procId: "UBDD",
          longName: "Unionbank Online Direct Debit",
          logo: "https://test.dragonpay.ph/Bank/images/ubplogo.jpg" },
        { procId: "GCSH",
          longName: "Globe GCash",
          logo: "https://test.dragonpay.ph/Bank/images/gcashlogo.jpg" },
        { procId: "PYMY",
          longName: "PayMaya",
          logo: "https://test.dragonpay.ph/Bank/images/paymayalogo.jpg" }
    ];

    useEffect(() => {
        getUserIpAddress();
        setUserAgent(getUserAgent);
    }, []);
    
    const proceedPayment = async (e) => {
        let requestBody = {};
        if(policyDetails && contactDetails) {

            const policyNo = policyDetails.line_cd + '-' +
                             policyDetails.subline_cd + '-' +
                             policyDetails.iss_cd + '-' +
                             policyDetails.issue_yy + '-' +
                             policyDetails.pol_seq_no + '-' +
                             policyDetails.renew_no;
            const policyDescription = 'Policy No: ' + policyNo + '\n' +
                            'Invoice No: ' + policyDetails.invoice_no + '\n' +
                            'Due Date: ' + policyDetails.due_date + '\n' +
                            'Total Amount Due: ' + currencyFormat(policyDetails.total_amount_due);

            if(selectedMethod == 7) {
                requestBody = {
                    Amount: policyDetails.total_amount_due,
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
                    Amount: policyDetails.total_amount_due,
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
        try {
            const response = await fetch(`${endpoint()}/payment`, {
                method: 'POST',
                headers: {  
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            console.log(data);
            if(data.Status === 'S') {
                gotoResultPage(data);
            } else {
                console.log('error!!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const gotoResultPage = (res) => {

        //if(selectedMethod == 7) {
            const tendoPayUrl = res.Url;
            window.location.href = tendoPayUrl;
        /*} else {
            sessionStorage.setItem('resultDtls', JSON.stringify(res));
            navigate('/payment-result');
        }*/
    }
    const getUserIpAddress = async () => {
        try {
          const response = await fetch('https://api64.ipify.org?format=json');
          const data = await response.json();
          setIpAddress(data.ip)
          return data.ip;
        } catch (error) {
          console.error('Error:', error);
          return null;
        }
    };
    const getUserAgent = () => {
        return navigator.userAgent;
    };
      

    return(
        <div className="main-container">

            <Sidebar isContainerVisible={isSidebarVisible} onClose={()=>setSidebarVisible(false)}/>

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
                        <button className="step-button" type="button">2</button>
                        <div className="step-title">Choose Method</div>
                    </div>
                        <div className="step-items">
                        <button className="step-button" type="button">3</button>
                        <div className="step-title">Review Payment</div>
                    </div>
                </div>

                <div className="card">
                    <div className="row">
                        <div className="space-between col-md-12">
                            <span className="text-gray">Premium Amount:</span>
                            <span>{currencyFormat(policyDetails.prem_amt)}</span>
                        </div>
                        <div className="space-between col-md-12 my-1">
                            <span className="text-gray">Tax Amount:</span>
                            <span>{currencyFormat(policyDetails.tax_amt)}</span>
                        </div>
                        <div className="space-between col-md-12 mt-2 align-center">
                            <span>Total Amount Due:</span>
                            <span className="text-medium">Php {currencyFormat(policyDetails.total_amount_due)}</span>
                        </div>
                    </div>
                </div>

                <div className="divider" />
                <div className="card mt-0">
                    <span className="card-title">Policy Details</span>
                    <div className="row">
                        <div className="space-between col-md-12 my-1">
                            <span className="text-gray">Policy No.:</span>
                            <span>
                                {policyDetails.line_cd}-
                                {policyDetails.subline_cd}-
                                {policyDetails.iss_cd}-
                                {policyDetails.issue_yy}-
                                {lpad(policyDetails.pol_seq_no, 7)}-
                                {lpad(policyDetails.renew_no, 2)}
                            </span>
                        </div>
                        <div className="space-between col-md-12 my-1">
                            <span className="text-gray">Assured:</span>
                            <span>{policyDetails.assd_name}</span>
                        </div>
                        <div className="space-between col-md-12 my-1">
                            <span className="text-gray">Invoice No.:</span>
                            <span>{policyDetails.invoice_no}</span>
                        </div>
                        <div className="space-between col-md-12 my-1">
                            <span className="text-gray">Due Date:</span>
                            <span>{policyDetails.due_date}</span>
                        </div>
                    </div>
                </div>
                <div className="divider" />

                <div className="card mt-0">
                    <span className="card-title">Contact Details</span>
                    <div className="row">
                        <div className="space-between col-md-12 my-1">
                            <span className="text-gray">Email:</span>
                            <span>{contactDetails.email}</span>
                        </div>
                        <div className="space-between col-md-12 my-1">
                            <span className="text-gray">Mobile No:</span>
                            <span>{contactDetails.mobileNo}</span>
                        </div>
                    </div>
                </div>

                <div className="divider" />

                <div className="card mt-0">
                    <span className="card-title">Payment Method</span>
                    {selectedMethod == 7 ? (
                        <div className="row">
                            <div className="space-between col-md-12 my-1">
                            <span className="text-gray mt-1">Source:</span>
                            <div>
                                <span>Credit Card</span>
                                <img className="bank-img ml-2" src={CCLogo} />
                            </div>
                            </div>
                            <div className="space-between col-md-12 my-1">
                                <span className="text-gray">Full Name:</span>
                                <span>{creditDetails.fname} {creditDetails.mname} {creditDetails.lname}</span>
                            </div>
                            <div className="space-between col-md-12 my-1">
                                <span className="text-gray">Complete Address:</span>
                                <span>{creditDetails.street}, {creditDetails.brgy}, {creditDetails.city}, {creditDetails.province}, {creditDetails.country} {creditDetails.zipcode}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="space-between col-md-12">
                            <span className="text-gray mt-1">Source:</span>
                            <div>
                                <span>{bankDetails[selectedMethod-1].longName}</span>
                                <img className="bank-img ml-2" src={bankDetails[selectedMethod-1].logo} alt="" />
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
                        <button id="next-page-btn"type="button"className="btn btn-success btn-w" onClick={proceedPayment}>Proceed <i className="bi bi-chevron-right fs-12 ml-2" /></button>
                    </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Step3