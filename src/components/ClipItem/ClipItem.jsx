import React from 'react';
import styles from './ClipItem.module.scss';
import tiktok from '../../../public/assets/about/tiktok.svg'
import facebook from '../../../public/assets/about/facebook.svg'
import Image from 'next/image';

const ClipItem = ({ clip, onDeleteClick }) => {
  return (
    <div className={styles.clipItem}>
      <div className={styles.thumbnailContainer}>
        <div className={styles.thumbnail}>
          {/* Placeholder thumbnail - có thể thay bằng img nếu có src */}
          <div style={{ 
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            OP
          </div>
        </div>
        <span className={styles.duration}>{clip.duration}</span>
      </div>
      
      <div className={styles.clipInfo}>
        <h4 className={styles.clipTitle}>{clip.title || `Clip ${clip.id}`}</h4>
      </div>
      
      <div className={styles.actions}>
        <button className={styles.socialButton} title="Share to Facebook">
          <Image src={facebook} width="24"></Image>
        </button>
        
        <button className={styles.socialButton} title="Share to TikTok">
          <Image src={tiktok} width="24"></Image>
        </button>
        
        <button className={styles.deleteButton} onClick={onDeleteClick} title="Delete clip">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ClipItem;