import React, { useState, useRef, useEffect} from 'react';
import Sidebar from './sidebar';
import { endpoint, goBack} from '../js/utils';
import MiciLogo from '../assets/mici_logo.svg'
import { useNavigate } from 'react-router-dom';


function PrivacyPolicy() {
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    return (
        <div className="main-container">
            
            <Sidebar isContainerVisible={isSidebarVisible} onClose={()=>setSidebarVisible(false)}/>

            <div className="right-container">
                <div className="action-container2">
                    <div className="back-container2">
                        <img src={MiciLogo} alt=""/>
                        <span>MICI Online Payment Facility</span>
                    </div>
                    <i className="bi bi-list ico-btn" onClick={()=>setSidebarVisible(!isSidebarVisible)}/>
                </div>
                <div className="card tac mt-4">
                    
                    <div className="privacy-policy">
                        <p className="title">Privacy Policy</p>
                        
                        <p>Thank you for using The Mercantile Insurance Company, Inc.'s online payment application. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our payment application.</p>

                        <p className="subtitle">1. Information We Collect:</p>
                        <p><b>Insurance Policy Information:</b> We collect certain insurance policy details from our company system necessary for processing payments.</p>
                        <p><b>Additional Information:</b> During the payment process, we may ask for additional information, including contact details such as email address and mobile number.</p>
                        <p><b>Credit Card Information:</b> If you choose to make a payment via credit card, we will collect your full name and complete billing address.</p>
                        <br/>
                        <p className="subtitle">2. How We Use Your Information:</p>
                        <p><b>Payment Processing:</b> We use the collected information to process payments for insurance policies and related services. </p>
                        <p><b>Communication:</b> We may use your contact information to communicate with you about your payment transactions or to provide important updates related to your insurance policies.</p>
                        <p><b>Improvement of Services:</b> Your information helps us to improve our payment application and services to better meet your needs.</p>
                        <br/>
                        <p className="subtitle">3. Disclosure of Information:</p>
                        <p><b>Service Providers:</b> We may disclose your information to trusted third-party service providers, such as Dragonpay, to facilitate payment processing. These service providers are obligated to keep your information confidential and secure.</p>
                        <p><b>Legal Compliance:</b> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p>
                        <br/>
                        <p className="subtitle">4. Data Security:</p>
                        <p> We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is completely secure.</p>

                        <p className="subtitle">5. Data Retention:</p>
                        <p>We retain your information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law.</p>

                        <p className="subtitle">6. Your Rights:</p>
                        <p>You have the right to access, correct, or delete your personal information. If you have any questions or concerns about the information we hold about you, please contact us using the information provided at the end of this Privacy Policy.</p>

                        <p className="subtitle">7. Changes to This Privacy Policy:</p>
                        <p>We reserve the right to update or modify this Privacy Policy at any time. Any changes will be effective immediately upon posting the updated Privacy Policy on our website.</p>

                        <p className="subtitle">8. Contact Us:</p>
                        <p>If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:</p>
                        <p><b>The Mercantile Insurance Company, Inc.</b><br />
                        Mercantile Insurance Building Cor. General Luna & Beaterio Sts., Brgy. 655 Zone 69, Intramuros, Manila <br />
                        (632) 85277701 to 20 <br />
                        gen_info@mici.com.ph <br />
                        www.mercantile.ph
                        </p>

                        <p>By using our online payment application, you consent to the collection and use of your information as described in this Privacy Policy.</p>
                        
                        <p>Last updated: April 26, 2024</p>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy