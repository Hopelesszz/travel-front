import React from 'react';
import "./Modal.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Modal = ({action, setAction, itemName, showModal, setShowModal, item, additionalItem, deleteItem}) => {
    const onClose = () => {
        setShowModal(false);
    }
    return (
        showModal && (
            <div className="background">
                <div className='modal'>
                    <FontAwesomeIcon onClick={onClose} className='closeIcon' icon={faXmark} />
                    <h1>Do you want to delete this {itemName}?</h1>
                    <div className='modal__buttons'>
                        {additionalItem ? (
                            <button onClick={() => {deleteItem(item, additionalItem); setShowModal(false);}} className='modal__buttons__yes'>Yes</button>
                        ) : (
                            <button onClick={() => {deleteItem(item); setShowModal(false);}} className='modal__buttons__yes'>Yes</button>
                        )}
                        <button onClick={() => {setShowModal(false); setAction(null);}}  className='modal__buttons__no'>No</button>
                    </div>
                </div>
            </div>
        )
    )
}

export default Modal;