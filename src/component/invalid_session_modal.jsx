import React from 'react';
import { useNavigate } from 'react-router-dom';

function InvalidTokenModal({ show, handleClose }) {
    const navigate = useNavigate();
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    const handleCloseModal = () => {
        handleClose();
        sessionStorage.clear();     
        navigate('/');
    }

    return (
        <div className={showHideClassName}>
            <div className="modal show">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header m-error">
                            <h5 className="modal-title">Invalid or Expired Session</h5>
                            <button type="button" className="btn-close" onClick={() => handleCloseModal()} aria-label="Close"/>
                        </div>
                        <div className="modal-body">
                            <p>Your session has expired and you need to start over. Please click the button below to proceed.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success btn-sm btn-w-sm" type="button" onClick={() => handleCloseModal()}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvalidTokenModal