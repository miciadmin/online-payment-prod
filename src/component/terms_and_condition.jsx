import React, { useState, useRef, useEffect} from 'react';
import Sidebar from './sidebar';
import MiciLogo from '../assets/mici_logo.svg'
import { useNavigate } from 'react-router-dom';


function TermsAndCondition() {
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    return (
        <div className="main-container">
            
            <Sidebar isContainerVisible={isSidebarVisible} onClose={()=>setSidebarVisible(false)}/>

            <div className="right-container">
                <div className="action-container2">
                    <div className="back-container2">
                        <img src={MiciLogo} alt=""/>
                        <span>MICI Online Payment</span>
                    </div>
                    <i className="bi bi-list ico-btn" onClick={()=>setSidebarVisible(!isSidebarVisible)}/>
                </div>
                <div className="card tac mt-4">
                    <p className='title'>Terms and Conditions</p>

                    <p>Welcome to MICI Online Payment Facility, provided by The Mercantile Insurance Company, Inc. (hereinafter referred to as "MICI"). MICI Online Payment Facility is an online payment platform that allows you to conveniently pay for your non-life insurance policies issued by The Mercantile Insurance Company, Inc.</p>

                    <p className='subtitle'>1. Acceptance of Terms</p>
                    <p>By using MICI Online Payment Facility, you agree to be bound by these Terms and Conditions, our Privacy Policy, and all other guidelines or policies referenced herein. If you do not agree with any part of these terms, please do not use MICI Online Payment Facility.</p>

                    <p className='subtitle'>2. Payment Process</p>
                    <p>MICI Online Payment Facility uses a third-party payment gateway provided by Dragonpay. All payments made through MICI Online Payment Facility are subject to the terms and conditions of Dragonpay.</p>

                    <p className='subtitle'>3. Payment Confirmation</p>
                    <p>Once payment is made through MICI Online Payment Facility, you will receive a confirmation email from MICI confirming the receipt of your payment. Please retain this confirmation for your records.</p>
                    
                    <p className='subtitle'>4. Official Receipt</p>
                    <p>The Mercantile Insurance Company, Inc. will email the official receipt to the email address provided within 3-5 business days after the successful processing of your payment.</p>

                    <p className='subtitle'>5. Refund Policy</p>
                    <p>All payments made through MICI Online Payment Facility are non-refundable.</p>

                    <p className='subtitle'>6. Privacy</p>
                    <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and disclose information about you.</p>

                    <p className='subtitle'>7. Modification of Terms</p>
                    <p>MICI reserves the right to modify these Terms and Conditions at any time. Changes will become effective immediately upon posting to the MICI website. Your continued use of MICI Online Payment Facility after any such changes constitutes your acceptance of the new Terms and Conditions.</p>

                    <p className='subtitle'>8. Contact Us</p>
                    <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
                    <p><b>The Mercantile Insurance Company, Inc.</b><br />
                    Mercantile Insurance Building Cor. General Luna & Beaterio Sts., Brgy. 655 Zone 69, Intramuros, Manila <br />
                    (632) 85277701 to 20 <br />
                    gen_info@mici.com.ph <br />
                    www.mercantile.ph
                    </p>

                    <p>By using our online payment application, you agree to the Terms and Conditions stated above.</p>

                    <p>Last updated: April 26, 2024</p>
                </div>
            </div>
        </div>
    )
}

export default TermsAndCondition