import React, { useState, useRef, useEffect} from 'react';
import Sidebar from './sidebar';
import DragonPayLogo from '../assets/dragonpay.png'
import { currencyFormat, goBack, textInputOnly, addressInput, numInputOnly, 
        bpiLogo, cbcLogo, rcbcLogo, ubpLogo, gcashLogo, mayaLogo, ccLogo, bogusLogo} from '../js/utils';
import { useNavigate } from 'react-router-dom';

function Step2() {
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const [policyDetails, setPolicyDetails] = useState(JSON.parse(sessionStorage.getItem('policyDtls')));
    const [creditDetails, setCreditDetails] = useState(JSON.parse(sessionStorage.getItem('creditDtls')));
    const [selectedMethod, setSelectedMethod] = useState(sessionStorage.getItem('paymentMethod'));
    const [errorCredit, setErrorCredit] = useState(null);

    useEffect(() => {
        selectRadioCard(selectedMethod ? selectedMethod : 1);
        if(creditDetails && selectedMethod == 7) {
            setSelectedMethod(7);
            setCreditFormData({...creditDetails});
        }
    }, [selectedMethod]);

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
        setSelectedMethod(cardNum);
    };
    const goNextPage = (e) => {
        if(selectedMethod === 7) {
            if (creditFormData.fname
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
            sessionStorage.setItem('paymentMethod', selectedMethod);
            navigate('/review-payment');
        }
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
                        <button className="step-button done" type="button">2</button>
                        <div className="step-title">Choose Method</div>
                    </div>
                        <div className="step-items">
                        <button className="step-button" type="button">3</button>
                        <div className="step-title">Review Payment</div>
                    </div>
                </div>

                <div className="card">
                    <div className="premium-container">
                    <span>Php {currencyFormat(policyDetails.balance_amt_due)}</span> 
                    <span className="text-gray">Payable Amount</span>
                    </div>
                </div>

                <div className="payment-method-container">
                    <span className="card-title">Online Banking</span>
                    <div className="row mb-3">
                        <div className="col-xl-6 my-1">
                            <div className={`radio-card radio-card-1 ${selectedMethod == 1 ? 'selected' : ''}`} onClick={() => selectRadioCard(1)}>
                                <img className="bank-img mr-4" src={bpiLogo()}/>
                                <span>BPI Online/Mobile</span>
                            </div>
                        </div>
                        <div className="col-xl-6 my-1">
                            <div className={`radio-card radio-card-2 ${selectedMethod == 2 ? 'selected' : ''}`} onClick={() => selectRadioCard(2)}>
                                <img className="bank-img mr-4" src={cbcLogo()}/>
                                <span>China Bank Online Direct Debit</span>
                            </div>
                        </div>
                        <div className="col-xl-6 my-1">
                            <div className={`radio-card radio-card-3 ${selectedMethod == 3 ? 'selected' : ''}`} onClick={() => selectRadioCard(3)}>
                                <img className="bank-img mr-4" src={rcbcLogo()}/>
                                <span>RCBC Online Direct Debit</span>
                            </div>
                        </div>
                        <div className="col-xl-6 my-1">
                            <div className={`radio-card radio-card-4 ${selectedMethod == 4 ? 'selected' : ''}`} onClick={() => selectRadioCard(4)}>
                                <img className="bank-img mr-4" src={ubpLogo()}/>
                                <span>Unionbank Online Direct Debit</span>
                            </div>
                        </div>
                    </div>
                    
                    <span className="card-title">E-Wallet</span>
                    <div className="row mb-3">
                        <div className="col-xl-6 my-1">
                            <div className={`radio-card radio-card-5 ${selectedMethod == 5 ? 'selected' : ''}`} onClick={() => selectRadioCard(5)}>
                                <img className="bank-img mr-4" src={gcashLogo()}/>
                                <span>Globe GCash</span>
                            </div>
                        </div>
                        <div className="col-xl-6 my-1">
                            <div className={`radio-card radio-card-6 ${selectedMethod == 6 ? 'selected' : ''}`} onClick={() => selectRadioCard(6)}>
                                <img className="bank-img mr-4" src={mayaLogo()}/>
                                <span>PayMaya</span>
                            </div>
                        </div>
                    </div>

                    <span className="card-title">Credit Card</span>
                    <div className="row">
                        <div className="col-xl-6 my-1">
                            <div className={`radio-card radio-card-7 ${selectedMethod == 7 ? 'selected' : ''}`} onClick={() => selectRadioCard(7)}>
                                <img className="bank-img mr-4" src={ccLogo()}/>
                                <span>Credit Card</span>
                            </div>
                        </div>
                        <div className="col-xl-6 my-1">
                            <div className={`radio-card radio-card-8 ${selectedMethod == 8 ? 'selected' : ''}`} onClick={() => selectRadioCard(8)}>
                                <img className="bank-img mr-4" src={bogusLogo()}/>
                                <span>Test Bank Online</span>
                            </div>
                        </div>
                        <div className="col-xl-6 my-1">
                            <div className={`radio-card radio-card-9 ${selectedMethod == 9 ? 'selected' : ''}`} onClick={() => selectRadioCard(9)}>
                                <img className="bank-img mr-4" src={bogusLogo()}/>
                                <span>Test Bank Over-the-Counter</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center my-3">
                    <span className="text-gray">powered by</span>
                    <img src={DragonPayLogo} alt="" width="120px" />
                </div>

                {selectedMethod === 7 ? (
                    <div>
                        <div className="divider" />

                        <div id="credit-card-dtls" className="card">
                            <span className="card-title">Credit Card Details</span>
                            <div className="row">
                                <div className="col-xl-4 mt-1">
                                    <label htmlFor="inputPassword5" className="form-label text-gray">FirstName*</label>
                                    <input type="text" className="form-control" name="fname" value={creditFormData.fname} onChange={handleCreditFormDataChange} onInput={addressInput} required/>
                                </div>
                                <div className="col-xl-4 mt-1">
                                    <label htmlFor="inputAddress5" className="form-label text-gray">MiddleName</label>
                                    <input type="text" className="form-control" name="mname" value={creditFormData.mname} onChange={handleCreditFormDataChange} onInput={addressInput} required/>
                                </div>
                                <div className="col-xl-4 mt-1">
                                    <label htmlFor="inputAddress5" className="form-label text-gray">LastName*</label>
                                    <input type="text" className="form-control" name="lname" value={creditFormData.lname} onChange={handleCreditFormDataChange} onInput={addressInput} required/>
                                </div>
                                <div className="col-xl-6 mt-1">
                                    <label htmlFor="inputAddress5" className="form-label text-gray">Street*</label>
                                    <input type="text" className="form-control" name="street" value={creditFormData.street} onChange={handleCreditFormDataChange} onInput={addressInput} required/>
                                </div>
                                <div className="col-xl-6 mt-1">
                                    <label htmlFor="inputAddress5" className="form-label text-gray">Barangay*</label>
                                    <input type="text" className="form-control" name="brgy" value={creditFormData.brgy} onChange={handleCreditFormDataChange} onInput={addressInput} required/>
                                </div>
                                <div className="col-xl-6 mt-1">
                                    <label htmlFor="inputAddress5" className="form-label text-gray">City*</label>
                                    <input type="text" className="form-control" name="city" value={creditFormData.city} onChange={handleCreditFormDataChange} onInput={addressInput} required/>
                                </div>
                                <div className="col-xl-6 mt-1">
                                    <label htmlFor="inputAddress5" className="form-label text-gray">Province*</label>
                                    <input type="text" className="form-control" name="province" value={creditFormData.province} onChange={handleCreditFormDataChange} onInput={addressInput} required/>
                                </div>
                                <div className="col-xl-6 mt-1">
                                    <label htmlFor="inputAddress5" className="form-label text-gray">Country*</label>
                                    <select className="form-select" name="country" value={creditFormData ? creditFormData.country : 'PH'} onChange={handleCreditFormDataChange}>
                                        <option value="PH">Philippines</option>
                                        <option value="US">USA</option>
                                        <option value="CA">Canada</option>
                                    </select>
                                </div>
                                <div className="col-xl-6 mt-1">
                                    <label htmlFor="inputAddress5" className="form-label text-gray">Zipcode (Optional)</label>
                                    <input type="text" className="form-control" name="zipcode" value={creditFormData.zipcode} onChange={handleCreditFormDataChange} onInput={numInputOnly}/>
                                </div>
                            </div>
                            {errorCredit &&(
                                <span className="text-error" style={{display: 'block'}}>{errorCredit}</span>
                            )}
                        </div>
                    </div>
                ) : (<></>)}

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