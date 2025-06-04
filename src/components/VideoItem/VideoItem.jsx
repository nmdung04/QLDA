import React from 'react';
import styles from './VideoItem.module.scss';

const VideoItem = ({ video, onDeleteClick, onVideoClick }) => {
  const handleVideoClick = () => {
    onVideoClick?.(video);
  };

  return (
    <div className={styles.videoItem} onClick={handleVideoClick}>
      <div className={styles.videoColumn}>
        <div className={styles.videoInfo}>
          <div className={styles.thumbnailContainer}>
            <div className={styles.thumbnail}>
              <span>OP</span>
            </div>
          </div>
          <div className={styles.title}>{video.title}</div>
        </div>
      </div>
      <div className={styles.statusColumn}>
        <span className={`${styles.status} ${styles[video.status.toLowerCase()]}`}>
          {video.status}
        </span>
      </div>
      <div className={styles.clipsColumn}>{video.clips}</div>
      <div className={styles.dateColumn}>{video.dateModified}</div>
      <div className={styles.actionColumn}>
        <button 
          className={styles.deleteButton} 
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick();
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoItem;