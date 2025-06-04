import React, { useState, useRef } from 'react';
import styles from './ProjectList.module.scss';
import Button from '../Button/Button';
import ProjectItem from '../ProjectItem/ProjectItem';
import ConfirmForm from '../ConfirmForm/ConfirmForm';
import VideoDetail from '../VideoDetail/VideoDetail';

const ProjectList = () => {
  // State để quản lý danh sách projects
  const [projects, setProjects] = useState([
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

  // State để quản lý confirm form
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  // State để quản lý project đang được xem
  const [selectedProject, setSelectedProject] = useState(null);
  
  // State để quản lý project mới đang được tạo
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState(null);

  // Xử lý khi nhấn nút xóa project
  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setShowConfirmForm(true);
  };

  // Xử lý khi xác nhận xóa project
  const handleConfirmDelete = () => {
    if (projectToDelete) {
      setProjects(projects.filter(project => project.id !== projectToDelete));
      setShowConfirmForm(false);
      setProjectToDelete(null);
    }
  };

  // Xử lý khi hủy xóa project
  const handleCancelDelete = () => {
    setShowConfirmForm(false);
    setProjectToDelete(null);
  };

  // Xử lý khi nhấn nút New Project
  const handleNewProjectClick = () => {
    const defaultName = `New Project ${projects.length + 1}`;
    setNewProjectName(defaultName);
    setIsCreatingNewProject(true);
    setYoutubeUrl('');
    setError('');
    setVideoData(null);
  };

  // Xử lý khi click vào một project
  const handleProjectClick = (project) => {
    // Tạo mock video data cho project đã có
    const mockVideo = {
      id: 1,
      title: project.title,
      thumbnail: project.thumbnail,
      status: 'Available',
      clips: project.videoCount,
      dateModified: project.dateModified,
      generatedClips: []
    };
    setVideoData(mockVideo);
    setSelectedProject(project);
  };

  // Quay lại danh sách projects
  const handleBackToProjects = () => {
    setSelectedProject(null);
    setIsCreatingNewProject(false);
    setNewProjectName('');
    setYoutubeUrl('');
    setError('');
    setVideoData(null);
  };

  // Xử lý khi fetch thông tin video từ YouTube
  const handleFetchVideoInfo = async () => {
    if (!youtubeUrl.trim()) {
      setError('Vui lòng nhập URL YouTube');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/youtube/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể lấy thông tin video');
      }

      // Tạo project mới với thông tin video
      const newProject = {
        id: Date.now(),
        title: data.title,
        videoCount: 1,
        dateModified: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        thumbnail: data.thumbnail
      };
      
      // Thêm project vào danh sách
      setProjects([...projects, newProject]);
      
      // Tạo video data để hiển thị trong VideoDetail
      const videoDetailData = {
        id: 1,
        title: data.title,
        thumbnail: data.thumbnail,
        status: 'Available',
        clips: 0,
        dateModified: newProject.dateModified,
        generatedClips: [],
        author: data.author || 'Unknown'
      };
      
      // Chuyển sang VideoDetail
      setVideoData(videoDetailData);
      setSelectedProject(newProject);
      setIsCreatingNewProject(false);
    } catch (error) {
      console.error('Error fetching video info:', error);
      setError(error.message || 'Không thể lấy thông tin video');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi hủy tạo project mới
  const handleCancelNewProject = () => {
    setIsCreatingNewProject(false);
    setNewProjectName('');
    setYoutubeUrl('');
    setError('');
  };

  // Form tạo project mới
  if (isCreatingNewProject) {
    return (
      <section className={styles.projectList}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleCancelNewProject}>
            ← Back to Projects
          </button>
          <h1>New Project</h1>
        </div>

        <div className={styles.newProjectForm}>
          <div className={styles.formGroup}>
            <label>Project Name:</label>
            <input 
              type="text" 
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>YouTube URL:</label>
            <div className={styles.urlInputGroup}>
              <input 
                type="text" 
                placeholder="Paste YouTube video URL here"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className={styles.input}
                disabled={loading}
              />
              <Button 
                variant="primary" 
                onClick={handleFetchVideoInfo}
                disabled={loading || !youtubeUrl.trim()}
              >
                {loading ? 'Loading...' : 'Add Video'}
              </Button>
            </div>
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
        </div>
      </section>
    );
  }

  // Nếu đang xem chi tiết project
  if (selectedProject && videoData) {
    return (
      <VideoDetail 
        video={videoData}
        onBack={handleBackToProjects}
        onExtract={(video) => {
          console.log('Extracting clips from:', video.title);
        }}
      />
    );
  }

  return (
    <section className={styles.projectList}>
      <div className={styles.header}>
        <h1>Projects</h1>
        <Button variant="primary" onClick={handleNewProjectClick}>
          <span className={styles.plusIcon}>+</span> New Project
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.projectColumn}>Projects</div>
          <div className={styles.videosColumn}>Videos</div>
          <div className={styles.dateColumn}>Date modified</div>
          <div className={styles.actionColumn}>Action</div>
        </div>

        <div className={styles.tableBody}>
          {projects.map(project => (
            <ProjectItem 
              key={project.id}
              project={project}
              onDeleteClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(project.id);
              }}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      </div>

      {showConfirmForm && (
        <ConfirmForm 
          message="Delete this project?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isVisible={showConfirmForm}
        />
      )}
    </section>
  );
};

export default ProjectList;