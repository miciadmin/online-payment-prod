import React from 'react';
import MiciLogo from '../assets/mici_logo.svg'
import { useNavigate } from 'react-router-dom';

function Sidebar({ isContainerVisible, isBackVisible, onClose }) {
    const navigate = useNavigate();

    const createPayment = () => {
        removeCookies();
        navigate('/search-policy');
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
                <b>MICI Online Payment</b>
            </div>
            <div className="menus">
                <div className="menu-item" onClick={() => createPayment()}>
                    <span>Create Payment</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
                <div className="menu-item" onClick={() => navigate('/search-refno')}>
                    <span>Check Reference No.</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
                <div className="menu-item" onClick={() => navigate('/terms-and-condition')}>
                    <span>Terms and Conditions</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
                <div className="menu-item" onClick={() => navigate('/privacy-policy')}>
                    <span>Privacy Policy</span>
                    <i className="bi bi-chevron-right fs-12 mr-2"></i>
                </div>
            </div>
            <span className="copyright-text">Copyright © The Mercantile Insurance Company, Inc. 2024</span>
        </div>
    )
}

export default Sidebar