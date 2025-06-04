import React, { useState, useRef } from 'react';
import styles from './VideoList.module.scss';
import Button from '../Button/Button';
import VideoItem from '../VideoItem/VideoItem';
import ConfirmForm from '../ConfirmForm/ConfirmForm';
import VideoUploadForm from '../VideoUploadForm/VideoUploadForm';
import VideoDetail from '../VideoDetail/VideoDetail';

const VideoList = ({ 
  projectName = 'Name Project', 
  isNewProject = false, 
  onBackToProjects, 
  onAddFirstVideo 
}) => {
  // State để quản lý danh sách videos - khởi tạo rỗng nếu là project mới
  const [videos, setVideos] = useState(isNewProject ? [] : [
    {
      id: 1,
      title: 'One Piece Egghead Part 2 | Official Trailer (English Subtitles)',
      status: 'Available',
      clips: 10,
      dateModified: '22/03/2025 14:30',
      thumbnail: '/placeholder.jpg'
    },
    {
      id: 2,
      title: 'One Piece Egghead Part 2 | Official Trailer (English Subtitles)',
      status: 'Pending',
      clips: 0,
      dateModified: '22/03/2025 14:31',
      thumbnail: '/placeholder.jpg'
    },
    {
      id: 3,
      title: 'One Piece Egghead Part 2 | Official Trailer (English Subtitles)',
      status: 'Pending',
      clips: 0,
      dateModified: '22/03/2025 14:32',
      thumbnail: '/placeholder.jpg'
    }
  ]);

  // State để quản lý confirm form
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // State để quản lý form upload video
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Xử lý khi nhấn nút xóa video
  const handleDeleteClick = (videoId) => {
    setVideoToDelete(videoId);
    setShowConfirmForm(true);
  };

  // Xử lý khi xác nhận xóa video
  const handleConfirmDelete = () => {
    if (videoToDelete) {
      setVideos(videos.filter(video => video.id !== videoToDelete));
      setShowConfirmForm(false);
      setVideoToDelete(null);
    }
  };

  // Xử lý khi hủy xóa video
  const handleCancelDelete = () => {
    setShowConfirmForm(false);
    setVideoToDelete(null);
  };

  // Xử lý khi nhấn nút Add Video
  const handleAddVideoClick = () => {
    setShowUploadForm(true);
  };

  // Xử lý khi thêm video
  const handleAddVideo = (videoData) => {
    const newVideo = {
      id: Date.now(),
      title: videoData.title || videoData.file?.name || 'Untitled Video',
      status: 'Pending',
      clips: 0,
      dateModified: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      thumbnail: '/placeholder.jpg'
    };
    
    if (isNewProject && videos.length === 0) {
      // Nếu là project mới và đây là video đầu tiên
      onAddFirstVideo?.(videoData);
    } else {
      // Thêm video bình thường
      setVideos([...videos, newVideo]);
      setShowUploadForm(false);
    }
  };

  // Xử lý khi hủy thêm video
  const handleCancelUpload = () => {
    setShowUploadForm(false);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };
  
  const handleBackToVideoList = () => {
    setSelectedVideo(null);
  };
  
  const handleExtractVideo = (video) => {
    // Placeholder cho chức năng AI extract
    console.log('Starting AI extraction for:', video.title);
    // Có thể cập nhật status của video thành "Processing"
  };

  // Nếu đang xem chi tiết video
  if (selectedVideo) {
    return (
      <VideoDetail 
        video={selectedVideo}
        onBack={handleBackToVideoList}
        onExtract={handleExtractVideo}
      />
    );
  }

  return (
    <section className={styles.videoList}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {(isNewProject || onBackToProjects) && (
            <button 
              className={styles.backButton} 
              onClick={onBackToProjects}
            >
              ←  Projects
            </button>
          )}
          <h1 className={styles.truncateText}>{projectName}</h1>
        </div>
        <Button variant="primary" onClick={handleAddVideoClick}>
          <span className={styles.plusIcon}>+ </span> Add Video
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.videoColumn}>Videos</div>
          <div className={styles.statusColumn}>Status</div>
          <div className={styles.clipsColumn}>Clips</div>
          <div className={styles.dateColumn}>Date modified</div>
          <div className={styles.actionColumn}>Action</div>
        </div>

        <div className={styles.tableBody}>
          {videos.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No videos yet. Click "Add Video" to get started.</p>
            </div>
          ) : (
            // Trong phần map videos, thêm onVideoClick prop:
            videos.map(video => (
              <VideoItem 
                key={video.id}
                video={video}
                onDeleteClick={() => handleDeleteClick(video.id)}
                onVideoClick={handleVideoClick}
              />
            ))
          )}
        </div>
      </div>

      {showConfirmForm && (
        <ConfirmForm 
          message="Delete this video?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isVisible={showConfirmForm}
        />
      )}

      {showUploadForm && (
        <VideoUploadForm
          onAdd={handleAddVideo}
          onCancel={handleCancelUpload}
          isVisible={showUploadForm}
        />
      )}
    </section>
  );
};

export default VideoList;