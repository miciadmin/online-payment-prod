import React from 'react';
import { useNavigate } from 'react-router-dom';

function ErrorModal({ show, handleClose }) {
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
                            <h5 className="modal-title">Error</h5>
                            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"/>
                        </div>
                        <div className="modal-body">
                            <p>Oops, something went wrong. Please try again later.</p>
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

export default ErrorModal