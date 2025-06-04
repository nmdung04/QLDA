import React from 'react';
import styles from './VideoDetail.module.scss';
import Button from '../Button/Button';
import ClipList from '../ClipList/ClipList';

const VideoDetail = ({ video, onBack, onExtract }) => {
  const handleExtractClick = () => {
    // Placeholder cho chức năng AI extract
    console.log('Extracting clips from video:', video.title);
    onExtract?.(video);
  };

  return (
    <div className={styles.videoDetail}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Videos
        </button>
        <h1 className={styles.pageTitle}>Extract from Video</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <div className={styles.videoInfo}>
            <div className={styles.thumbnailContainer}>
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className={styles.thumbnail}
              />
            </div>
            
            <div className={styles.videoMeta}>
              <h2 className={styles.videoTitle}>{video.title}</h2>
              <div className={styles.videoStats}>
                <span>Status: <span className={`${styles.status} ${styles[video.status?.toLowerCase()]}`}>{video.status}</span></span>
                <span>Clips: {video.clips}</span>
                <span>Modified: {video.dateModified}</span>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              onClick={handleExtractClick}
              className={styles.extractButton}
            >
              🤖 Extract
            </Button>
          </div>
        </div>
        
        <div className={styles.rightPanel}>
          <ClipList clips={video.generatedClips} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;