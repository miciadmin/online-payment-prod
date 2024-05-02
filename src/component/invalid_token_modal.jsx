import React from 'react';
import { useNavigate } from 'react-router-dom';

function InvalidTokenModal({ show, handleClose }) {
    const navigate = useNavigate();
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    const handleCloseModal = () => {
        handleClose();
        sessionStorage.clear();     
        window.history.pushState({}, '', '/');
        navigate('/search-policy');
    }

    return (
        <div className={showHideClassName}>
            <div className="modal show">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header error-modal">
                            <h5 className="modal-title">Invalid or Expired Token</h5>
                            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"/>
                        </div>
                        <div className="modal-body">
                            <p>Sorry, the token provided is invalid or expired.</p>
                            <p>Please try again with a valid token. If the problem persists, contact support for assistance.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-sm btn-w-sm" type="button" onClick={() => handleCloseModal()}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvalidTokenModal