import React, { useState, useRef, useEffect} from 'react';
import Sidebar from './sidebar';
import DragonPayLogo from '../assets/dragonpay.png'
import { endpoint, currencyFormat, goBack } from '../js/utils';
import { useNavigate } from 'react-router-dom';

function Step2() {
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const [policyDetails, setPolicyDetails] = useState(JSON.parse(sessionStorage.getItem('policyDtls')));
    const [bankDetails, setBankDetails] = useState(JSON.parse(sessionStorage.getItem('bankDtls')));
    const [creditDetails, setCreditDetails] = useState(JSON.parse(sessionStorage.getItem('creditDtls')));
    const [selectedMethod, setSelectedMethod] = useState(sessionStorage.getItem('paymentMethod'));

    const [processorData, setProcessorData] = useState(null);
    const [optionMenuActive, setOptionMenuActive] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [errorBank, setErrorBank] = useState(null);
    const [errorCredit, setErrorCredit] = useState(null);
    const methods = ['Online Banking / E-Wallet', 'Credit Card', 'Over-The-Counter / ATM Banking', 'Over-The-Counter Others'];

    useEffect(() => {
        selectRadioCard(selectedMethod ? selectedMethod : 1);
        if(bankDetails || creditDetails) {
            if (selectedMethod == 2) {
                setSelectedMethod(2);
                setCreditFormData({...creditDetails});
            } else {
                setSelectedOption({procId:bankDetails.procId, longName:bankDetails.longName, logo:bankDetails.logo});
            }
        }
    }, [policyDetails]);

    const [creditFormData, setCreditFormData] = useState({
        fname: '',
        mname: '',
        lname: '',
        street: '',
        brgy: '',
        city: '',
        province: '',
        country: 'PH',
        zipcode: ''
    });
    const handleCreditFormDataChange = (e) => {
        const { name, value } = e.target;
        setCreditFormData({
            ...creditFormData,
            [name]: value.toUpperCase()
        });
        setErrorCredit(null);
    };
    const selectRadioCard = (cardNum) => {
        setSelectedOption(null);
        setSelectedMethod(cardNum);
        if (cardNum == 1 || cardNum == 3 || cardNum == 4) {
            let source = (cardNum == 1) ? 'getOB&EWallet' : (cardNum == 3) ? 'getOTC&ATMBanking' : 'getOTC&Others';
            getProcessor(source);
        } 
    };
    const getProcessor = async (src) =>  {
        try {
            //setLoading(true);
            console.log(src);
            const response = await fetch(`${endpoint()}/processors/${src}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setProcessorData(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            //setLoading(false);
        }
    };
    const handleSelectedOption = ({ procId, longName, logo }) => {
        setSelectedOption({ procId, longName, logo });
        setOptionMenuActive(false);
    };
    const goNextPage = (e) => {
        if(selectedMethod === 2) {
            if (creditFormData.fname
            && creditFormData.mname
            && creditFormData.lname
            && creditFormData.street
            && creditFormData.brgy
            && creditFormData.city
            && creditFormData.province
            && creditFormData.country) {
                sessionStorage.setItem('paymentMethod', selectedMethod);
                sessionStorage.setItem('creditDtls', JSON.stringify(creditFormData));
                navigate('/review-payment');
            } else {
                setErrorCredit('(Fill empty fields first)');
            }
        } else {
            if(selectedOption) {
                sessionStorage.setItem('paymentMethod', selectedMethod);
                sessionStorage.setItem('bankDtls', JSON.stringify({
                    procId: selectedOption.procId,
                    longName: selectedOption.longName,
                    logo: selectedOption.logo
                }));
                navigate('/review-payment');
            } else {
                setErrorBank('(Select payment method first)');
            }
        }
    };
    
    return(
        <div className="main-container">

            <Sidebar isVisible={isSidebarVisible}  onClose={()=>setSidebarVisible(false)}/>

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
                    <div className="premium-container">
                    <p>Php {currencyFormat(policyDetails.total_amount_due)}</p> 
                    <p className="text-gray">Total amount due</p>
                    </div>
                </div>

                <div className="payment-method-container">
                    <span className="card-title">Choose a payment method</span>
                    <div className="row">
                    <div className="col-xl-6 my-2">
                        <div className={`radio-card radio-card-1 ${selectedMethod == 1 ? 'selected' : ''}`} onClick={() => selectRadioCard(1)}>
                        <div className="radio-card-check">
                            <i className="fa-solid fa-check-circle" />
                        </div>
                        <div>
                            <i className="bi bi-bank2 mr-2" />
                            <span>Online Banking / E-Wallet</span>
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-6 my-2">
                        <div className={`radio-card radio-card-2 ${selectedMethod == 2 ? 'selected' : ''}`} onClick={() => selectRadioCard(2)}>
                        <div className="radio-card-check">
                            <i className="fa-solid fa-check-circle" />
                        </div>
                        <div>
                            <i className="bi bi-credit-card-2-back mr-2" />
                            <span>Credit Card</span>
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-6 my-2">
                        <div className={`radio-card radio-card-3 ${selectedMethod == 3 ? 'selected' : ''}`} onClick={() => selectRadioCard(3)}>
                        <div className="radio-card-check">
                            <i className="fa-solid fa-check-circle" />
                        </div>
                        <div>
                            <i className="bi bi-shop-window mr-2" />
                            <span>Over-The-Counter / ATM Banking</span>
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-6 my-2">
                        <div className={`radio-card radio-card-4 ${selectedMethod == 4 ? 'selected' : ''}`} onClick={() => selectRadioCard(4)}>
                        <div className="radio-card-check">
                            <i className="fa-solid fa-check-circle" />
                        </div>
                        <div>
                            <i className="bi bi-x-diamond mr-2" />
                            <span>Over-The-Counter Others</span>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="text-center mt-3">
                    <span className="text-gray">powered by</span>
                    <img src={DragonPayLogo} alt="" width="120px" />
                </div>

                <div className="divider" />

                {selectedMethod === 2 ? (
                    <div id="credit-card-dtls" className="card">
                        <span className="card-title">{methods[selectedMethod - 1]}</span>
                        <div className="row">
                            <div className="col-xl-4 my-2">
                                <label htmlFor="inputPassword5" className="form-label text-gray">FirstName*</label>
                                <input type="text" className="form-control" name="fname" value={creditFormData.fname} onChange={handleCreditFormDataChange} required/>
                            </div>
                            <div className="col-xl-4 my-2">
                                <label htmlFor="inputAddress5" className="form-label text-gray">MiddleName*</label>
                                <input type="text" className="form-control" name="mname" value={creditFormData.mname} onChange={handleCreditFormDataChange} required/>
                            </div>
                            <div className="col-xl-4 my-2">
                                <label htmlFor="inputAddress5" className="form-label text-gray">LastName*</label>
                                <input type="text" className="form-control" name="lname" value={creditFormData.lname} onChange={handleCreditFormDataChange} required/>
                            </div>
                            <div className="col-xl-6 my-2">
                                <label htmlFor="inputAddress5" className="form-label text-gray">Street*</label>
                                <input type="text" className="form-control" name="street" value={creditFormData.street} onChange={handleCreditFormDataChange} required/>
                            </div>
                            <div className="col-xl-6 my-2">
                                <label htmlFor="inputAddress5" className="form-label text-gray">Barangay*</label>
                                <input type="text" className="form-control" name="brgy" value={creditFormData.brgy} onChange={handleCreditFormDataChange} required/>
                            </div>
                            <div className="col-xl-6 my-2">
                                <label htmlFor="inputAddress5" className="form-label text-gray">City*</label>
                                <input type="text" className="form-control" name="city" value={creditFormData.city} onChange={handleCreditFormDataChange} required/>
                            </div>
                            <div className="col-xl-6 my-2">
                                <label htmlFor="inputAddress5" className="form-label text-gray">Province*</label>
                                <input type="text" className="form-control" name="province" value={creditFormData.province} onChange={handleCreditFormDataChange} required/>
                            </div>
                            <div className="col-xl-6 my-2">
                                <label htmlFor="inputAddress5" className="form-label text-gray">Country*</label>
                                <select className="form-select" name="country" value={creditFormData ? creditFormData.country : 'PH'} onChange={handleCreditFormDataChange}>
                                    <option value="PH">Philippines</option>
                                    <option value="US">USA</option>
                                    <option value="CA">Canada</option>
                                </select>
                            </div>
                            <div className="col-xl-6 my-2">
                                <label htmlFor="inputAddress5" className="form-label text-gray">Zipcode (Optional)</label>
                                <input type="text" className="form-control" name="zipcode" value={creditFormData.zipcode} onChange={handleCreditFormDataChange}/>
                            </div>
                        </div>
                        {errorCredit &&(
                            <span className="text-error" style={{display: 'block'}}>{errorCredit}</span>
                        )}
                    </div>
                ) : (
                    
                    <div id="other-method-dtls" className="card">
                        <span className="card-title">{methods[selectedMethod - 1]}</span>
                        
                        <div className={`select-menu ${optionMenuActive ? 'active' : ''}`}>
                            <div className="select-btn" onClick={()=> setOptionMenuActive(!optionMenuActive)}>
                                {selectedOption ? <img className="selected-img" src={selectedOption.logo} alt="" /> : <img className="selected-img d-none" alt="" />}
                                <span className="selected-text">{selectedOption ? selectedOption.longName : 'Select a payment option'}</span>
                                <span className="selected-code d-none">{selectedOption ? selectedOption.procId : null}</span>
                                <i className="bx bx-chevron-down" />
                            </div>
                            <ul className="options">
                                {processorData && processorData.map((value, index) => (
                                    <li key={index} className="option" onClick={() => handleSelectedOption({ procId: value.procId, longName: value.longName, logo: value.logo })}>
                                        <img className="option-img" src={value.logo} alt="" />
                                        <span className="option-text">{value.longName}</span>
                                        <span className="option-code">{value.procId}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="gridCheck" />
                            <label className="form-check-label text-gray" htmlFor="gridCheck">I agree to the Terms and Conditions</label>
                        </div>
                        {errorBank &&(
                            <span className="text-error" style={{display: 'block'}}>{errorBank}</span>
                        )}
                    </div>
                )}

                <div className="card">
                    <div className="row mt-4">
                    <div className="col-sm-6 mb-2">
                        <button id="previous-page-btn" type="button" className="btn btn-outline-success btn-w" onClick={goBack}><i className="bi bi-chevron-left fs-12 mr-2" /> Previous</button>
                    </div>
                    <div className="col-sm-6 text-right">
                        <button id="next-page-btn"type="button"className="btn btn-success btn-w" onClick={goNextPage}>Next <i className="bi bi-chevron-right fs-12 ml-2" /></button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step2