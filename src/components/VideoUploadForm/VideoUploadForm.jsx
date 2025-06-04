import React, { useState, useRef } from 'react';
import styles from './VideoUploadForm.module.scss';

const VideoUploadForm = ({ onAdd, onCancel, isVisible = true }) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('Title Video');
  const fileInputRef = useRef(null);

  if (!isVisible) return null;

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewTitle(selectedFile.name);
    }
  };

  const handleSubmit = () => {
    if (url) {
      onAdd({ url, title: url });
    } else if (file) {
      onAdd({ file, title: file.name });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.uploadForm}>
        <div className={styles.urlInput}>
          <input 
            type="text" 
            placeholder="Upload from URL" 
            value={url}
            onChange={handleUrlChange}
          />
          <button className={styles.urlButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <button className={styles.deviceButton} onClick={handleFileUpload}>
          Upload from this device
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="video/*" 
          multiple={false}
          style={{ display: 'none' }} 
        />

        <div className={styles.previewSection}>
          <h3>Preview</h3>
          <div className={styles.previewContainer}>
            <div className={styles.previewPlaceholder}></div>
            <p className={styles.previewTitle}>{previewTitle}</p>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button 
            className={styles.addButton} 
            onClick={handleSubmit}
            disabled={!url && !file}
          >
            Add
          </button>
          <button 
            className={styles.cancelButton} 
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadForm;