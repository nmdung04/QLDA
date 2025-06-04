import React from 'react';
import styles from './ProjectItem.module.scss';

const ProjectItem = ({ project, onDeleteClick, onClick }) => {
  return (
    <div className={styles.projectItem} onClick={onClick}>
      <div className={styles.projectColumn}>
        <div className={styles.projectInfo}>
          <div className={styles.thumbnailContainer}>
            {/* Placeholder cho ảnh thumbnail */}
            <div className={styles.thumbnail}>
              <span>OP</span>
            </div>
          </div>
          <div className={styles.title}>{project.title}</div>
        </div>
      </div>
      <div className={styles.videosColumn}>{project.videoCount}</div>
      <div className={styles.dateColumn}>{project.dateModified}</div>
      <div className={styles.actionColumn} onClick={(e) => e.stopPropagation()}>
        <button className={styles.deleteButton} onClick={onDeleteClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectItem;