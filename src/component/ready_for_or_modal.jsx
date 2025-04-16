import React from 'react';
import { useNavigate } from 'react-router-dom';

function Modal({ show, handleClose }) {
    const navigate = useNavigate();
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    const handleCloseModal = () => {
        handleClose();
    }

    return (
        <div className={showHideClassName}>
            <div className="modal show">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-success text-white">
                            <h5 className="modal-title">Payment Successful</h5>
                            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"/>
                        </div>
                        <div className="modal-body">
                            <p>This policy has been paid and is now ready for OR.</p>
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

export default Modal