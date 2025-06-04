import { useState } from 'react';
import styles from './Downloader.module.scss';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Button from '../Button/Button';

const Downloader = () => {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProjectList, setShowProjectList] = useState(false);

  // Fetch video information
  const handleFetchInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setError('');
    setVideoInfo(null);
    setLoading(true);

    try {
      const response = await fetch('/api/youtube/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video info');
      }

      setVideoInfo(data);
    } catch (error) {
      console.error('Error fetching video info:', error);
      setError(error.message || 'Failed to fetch video information');
    } finally {
      setLoading(false);
    }
  };

  // Download video
  // Download video function - cập nhật để sử dụng API download.js thống nhất
  const handleDownload = async (quality) => {
    try {
      setError('');
      
      const requestBody = {
        url,
        itag: quality.itag,
        needsFFmpeg: quality.needsFFmpeg,
        quality: quality.quality
      };
      
      // Thêm audioItag nếu cần ffmpeg
      if (quality.needsFFmpeg && quality.audioItag) {
        requestBody.audioItag = quality.audioItag;
      }
  
      const response = await fetch('/api/youtube/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }
  
      // Create download link
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality.quality}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading video:', error);
      setError(error.message || 'Failed to download video');
    }
  };

  // Handler upload to short platform
  const handleUpload = () => {
    setShowProjectList(true);
  };

  // Handler when selecting project
  const handleProjectSelect = (project) => {
    alert(`Video sẽ được thêm vào project: ${project.title}`);
    router.push('/projects');
  };

  // Show project list
  if (showProjectList) {
    return (
      <div>
        <div className={styles.centerWrap}>
          <div className={styles.projectSelectHeader}>
            <h2>Chọn Project để thêm video</h2>
            <button 
              onClick={() => setShowProjectList(false)}
              className={styles.backBtn}
            >
              ← Quay lại
            </button>
          </div>
          <ProjectListForSelection 
            onProjectSelect={handleProjectSelect}
            videoInfo={videoInfo}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.centerWrap}>
        <div className={styles.inputWrap}>
          <input
            type="text"
            placeholder="Paste the YouTube video link here"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className={styles.input}
            disabled={loading}
          />
          <button 
            onClick={handleFetchInfo} 
            className={styles.startBtn}
            disabled={loading || !url.trim()}
          >
            {loading ? 'Loading...' : 'Start'}
          </button>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        {videoInfo && (
          <div className={styles.card}>
            <div className={styles.left}>
              <Image 
                src={videoInfo.thumbnail} 
                alt="thumbnail" 
                className={styles.thumbnail} 
                width={500} 
                height={250} 
              />
              <div className={styles.title}>{videoInfo.title}</div>
              <div className={styles.author}>By: {videoInfo.author}</div>
              <button onClick={handleUpload} className={styles.uploadBtn}>
                Upload to Short Platform
              </button>
            </div>
            <div className={styles.right}>
              <table className={styles.qualityTable}>
                <thead>
                  <tr>
                    <th>Quality</th>
                    <th>Size</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {videoInfo.qualities.map(quality => (
                    <tr key={quality.itag}>
                      <td>{quality.quality}</td>
                      <td>{quality.size}</td>
                      <td>
                        <Button 
                          onClick={() => handleDownload(quality)} 
                          className={styles.downloadBtn}
                          variant='secondary'
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for project selection
const ProjectListForSelection = ({ onProjectSelect, videoInfo }) => {
  const [projects] = useState([
    {
      id: 1,
      title: 'One Piece Egghead Part 2 | Official Trailer (English Subtitles)',
      videoCount: 10,
      dateModified: '22/03/2025 14:30',
      thumbnail: '/placeholder.jpg'
    },
    {
      id: 2,
      title: 'One Piece Egghead Part 2 | Official Trailer (English Subtitles)',
      videoCount: 1,
      dateModified: '22/03/2025 14:31',
      thumbnail: '/placeholder.jpg'
    },
    {
      id: 3,
      title: 'One Piece Egghead Part 2 | Official Trailer (English Subtitles)',
      videoCount: 5,
      dateModified: '22/03/2025 14:32',
      thumbnail: '/placeholder.jpg'
    }
  ]);

  return (
    <div className={styles.projectSelection}>
      <div className={styles.videoPreview}>
        <Image 
          src={videoInfo.thumbnail} 
          alt="Video thumbnail" 
          className={styles.previewThumbnail} 
          width={80} 
          height={60} 
        />
        <span className={styles.previewTitle}>{videoInfo.title}</span>
      </div>
      
      <div className={styles.projectGrid}>
        {projects.map(project => (
          <div 
            key={project.id} 
            className={styles.projectCard}
            onClick={() => onProjectSelect(project)}
          >
            <Image 
              src={project.thumbnail} 
              alt={project.title} 
              className={styles.projectThumbnail} 
              width={280} 
              height={120} 
            />
            <div className={styles.projectInfo}>
              <h3>{project.title}</h3>
              <p>{project.videoCount} videos</p>
              <p>{project.dateModified}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Downloader;