import React, { useState } from 'react';
import "./modal.css"
import Button from '../button/button';

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className='modal-header'>
                    <h3>{title}</h3>
                    <i class="fa fa-remove" style={{fontSize:"24px", cursor: "pointer"}} onClick={onClose}></i>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
