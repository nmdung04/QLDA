import React, { useState } from 'react';
import styles from './VideoDetail.module.scss';
import Button from '../Button/Button';
import Orb from '../Orb/Orb';

const VideoDetail = ({ video, onBack, onExtract }) => {
  const [loading, setLoading] = useState(false);
  const [resultVideoUrl, setResultVideoUrl] = useState(null);

  const [status, setStatus] = useState(video.statusExtract || 'created');

  const handleExtractClick = async () => {
    const formData = new URLSearchParams();
    formData.append("url", video.url);


    setLoading(true);
    setResultVideoUrl(null);
    setStatus('processing');
    // Cập nhật status project trong DB là processing
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: video.id,
          updateClips: true,
          status: 'processing',
        }),
      });
    } catch (err) {
      // Không cần xử lý lỗi ở đây
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await res.json();
      if (res.ok) {
        setResultVideoUrl(`http://127.0.0.1:8000${data.video_url}`);
        setStatus('success');
        // Nếu backend trả về danh sách clips, lưu vào project và cập nhật status = success
        if (data.video_url) {
          try {
            await fetch('/api/projects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                _id: video.id,
                updateClips: true,
                clips: [data.video_url],
                status: 'success',
              }),
            });
          } catch (err) {
            console.error('Lỗi khi lưu clips vào project:', err);
          }
        }
      } else {
        setStatus('created');
        console.error("Server error", data);
      }
    } catch (err) {
      setStatus('created');
      console.error("Network error", err);
    } finally {
      setLoading(false);
    }
  };
function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

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
                <span>Modified: {formatDateTime(video.dateModified)}</span>
              </div>
            </div>

            {status == 'created' && (
              <Button 
                variant="primary" 
                onClick={handleExtractClick}
                className={styles.extractButton}
              >
                🤖 Extract
              </Button>
            )}
            {status === 'processing' && (
              <Button 
              variant="disable" 
              onClick={handleExtractClick}
              className={styles.disableButton}
            >
               Extract
            </Button>
            )}
            {status === 'success' && (
              <div className={styles.successMsg}> &#10003; Extracted</div>
            )}
          </div>
        </div>

        <div className={styles.rightPanel}>
          {status === 'processing' ? (
            // <div className={styles.loading}>⏳ Processing...</div>
            <div className={styles.orbloading}>
              <Orb
                hoverIntensity={0}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
              />
            </div>
          ) : status === 'success' ? (
            <video
              className={styles.resultVideo}
              src={resultVideoUrl ? resultVideoUrl : "http://127.0.0.1:8000" + video.clip_url}
              controls
              autoPlay
            />
          ) : <div className={styles.loading}>No available clip</div>}
        </div>
      </div>
    </div>
  );
};

// Helper để format ngày giờ đẹp
function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

export default VideoDetail;
