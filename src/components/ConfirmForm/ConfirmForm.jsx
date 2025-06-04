import React from 'react';
import styles from './ConfirmForm.module.scss';

const ConfirmForm = ({
  message = 'Delete this project?',
  confirmText = 'Yes',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isVisible = true
}) => {
  if (!isVisible) return null;
  
  return (
    <div className={styles.overlay}>
      <div className={styles.confirmForm}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.confirmButton} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button 
            className={styles.cancelButton} 
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmForm;