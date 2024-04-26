import React from 'react';
import { goHome } from '../js/utils';
import MiciLogo from '../assets/mici_logo.svg'

function Sidebar({ isVisible, onClose }) {

    const handleCreatePaymentMenuClick = () => {
    removeCookies();
    window.location.href = 'payment-step1';
    };
    const handleCheckPaymentStatMenuClick = () => {
    removeCookies();
    window.location.href = 'payment-step1';
    };
    const handleCancelPaymentMenuClick = () => {
    removeCookies();
    window.location.href = 'payment-step1';
    };
    const handleTACMenuClick = () => {
    removeCookies();
    window.location.href = 'payment-step1';
    };
    const handlePPMenuClick = () => {
    removeCookies();
    window.location.href = 'payment-step1';
    };

    const removeCookies = () => {
    sessionStorage.removeItem('policyDtls');
    sessionStorage.removeItem('contactDtls');
    sessionStorage.removeItem('bankDtls');
    sessionStorage.removeItem('creditDtls');
    sessionStorage.removeItem('paymentType');
    };

    return(
        <div className={`left-container ${isVisible ? 'slide-toggle' : ''}`}>
            <div className="action-container1">
                <div className="back-container1" onClick={goHome}>
                    <i className="bi bi-arrow-left-short ico-btn mr-2"></i>
                    <span className="cursor-pointer">Back to home</span>
                </div>
                <i className="bi bi-x ico-btn close-menu" onClick={onClose}></i>
            </div>
            <div className="company-header">
                <img src={MiciLogo} alt=""/>
                <span>MICI Policy Online Payment</span>
            </div>
            <div className="menus">
                <div className="menu-item" onClick={handleCreatePaymentMenuClick}>
                    <span>Create Payment</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
                <div className="menu-item" onClick={handleCheckPaymentStatMenuClick}>
                    <span>Check Payment Status</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
                <div className="menu-item" onClick={handleCancelPaymentMenuClick}>
                    <span>Cancel Payment</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
                <div className="menu-item" onClick={handleTACMenuClick}>
                    <span>Terms and Conditions</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
                <div className="menu-item" onClick={handlePPMenuClick}>
                    <span>Privacy Policy</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
            </div>
        </div>
    )
}

export default Sidebar