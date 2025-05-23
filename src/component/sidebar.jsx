import React from 'react';
import MiciLogo from '../assets/mici_logo_s.png'
import { useNavigate } from 'react-router-dom';

function Sidebar({ isContainerVisible, isBackVisible, onClose }) {
    const navigate = useNavigate();

    const createPayment = () => {
        removeCookies();
        navigate('/');
    }

    const removeCookies = () => {
        sessionStorage.clear();
    };

    return(
        <div className={`left-container ${isContainerVisible ? 'slide-toggle' : ''}`}>
            <div className="close-menu">
                <i className="bi bi-x ico-btn" onClick={onClose}></i>
            </div>

            <div className="company-header">
                <img src={MiciLogo} alt=""/>
                <b>Online Payment Facility</b>
            </div>
            <div className="menus">
                <div className="menu-item" onClick={() => createPayment()}>
                    <span><i className="bi bi-credit-card mr-2"></i>Create Payment</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
                <div className="menu-item" onClick={() => navigate('/search-refno')}>
                    <span><i className="bi bi-receipt-cutoff mr-2"></i>Check Reference No.</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
                <div className="menu-item" onClick={() => navigate('/terms-and-condition')}>
                    <span><i className="bi bi-file-earmark-text mr-2"></i>Terms and Conditions</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
                <div className="menu-item" onClick={() => navigate('/privacy-policy')}>
                    <span><i className="bi bi-shield-exclamation mr-2"></i>Privacy Policy</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
            </div>
            <span className="copyright-text">Copyright © MICI {new Date().getFullYear()}</span>
        </div>
    )
}

export default Sidebar