import React from 'react';
import { useNavigate } from 'react-router-dom';

function FatalErrorModal({ show, handleClose, errType, errMsg }) {
    const navigate = useNavigate();
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    const handleCloseModal = () => {
        handleClose();
        if(errType == 'fatal_error') {
            sessionStorage.clear();     
            navigate('/');
        }
    }

    return (
        <div className={showHideClassName}>
            <div className="modal show">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header m-error">
                            <h5 className="modal-title">Error</h5>
                            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"/>
                        </div>
                        <div className="modal-body">
                            <p>{errMsg}</p>
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

export default FatalErrorModal