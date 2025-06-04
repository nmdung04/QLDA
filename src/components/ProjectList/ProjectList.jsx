import React, { useState, useRef, useEffect } from 'react';
import styles from './ProjectList.module.scss';
import Button from '../Button/Button';
import ProjectItem from '../ProjectItem/ProjectItem';
import ConfirmForm from '../ConfirmForm/ConfirmForm';
import VideoDetail from '../VideoDetail/VideoDetail';

const ProjectList = () => {
  // State để quản lý danh sách projects
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState(null);
  // Lấy userId từ localStorage khi mount
  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      setUserId(session);
    }
  }, []);

  // Fetch projects của user khi userId thay đổi
  useEffect(() => {
    if (!userId) return;
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/projects?userId=${userId}`);
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setProjects([]);
      }
    };
    fetchProjects();
  }, [userId]);

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
  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      try {
        const res = await fetch(`/api/projects?id=${projectToDelete}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setProjects(projects.filter(project => (project._id || project.id) !== projectToDelete));
        } else {
          const data = await res.json();
          alert(data.error || 'Delete failed');
        }
      } catch (err) {
        alert('Delete failed');
      }
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
  const formatDateTime = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };

  const handleProjectClick = (project) => {
    // Hiển thị video với clip_url nếu có, format lại dateModified
    const videoData = {
      id: project._id || project.id,
      title: project.title,
      url: project.url,
      thumbnail: project.thumbnail,
      status: 'Available',
      statusExtract: project.status || 'created',
      clips: project.videoCount || (project.clips ? project.clips.length : 0),
      dateModified: formatDateTime(project.dateModified),
      generatedClips: project.clips || [],
      clip_url: project.clips && project.clips.length > 0 ? project.clips[0] : '',
    };
    setVideoData(videoData);
    setSelectedProject({ ...project, dateModified: formatDateTime(project.dateModified) });
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
      // Lấy metadata video từ YouTube
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

      // Format date to dd/MM/yyyy HH:mm
      const formattedDate = formatDateTime(new Date());

      // Gửi thông tin project lên database
      const projectRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: data.title,
          videoCount: 1,
          url: youtubeUrl,
          dateModified: formattedDate,
          thumbnail: data.thumbnail,
          clips: [],
          status: 'created',
        }),
      });
      const savedProject = await projectRes.json();
      if (!projectRes.ok) throw new Error(savedProject.error || 'Không thể lưu project');

      // Cập nhật danh sách project
      setProjects((prev) => [...prev, { ...savedProject, dateModified: formattedDate }]);

      // Tạo video data để hiển thị trong VideoDetail
      const videoDetailData = {
        id: savedProject._id,
        title: data.title,
        url: youtubeUrl,
        thumbnail: data.thumbnail,
        status: 'Available',
        statusExtract: 'created',
        clips: 0,
        dateModified: formattedDate,
        generatedClips: [],
        author: data.author || 'Unknown',
        clip_url: savedProject.clips[0] || '',
      };

      setVideoData(videoDetailData);
      setSelectedProject({ ...savedProject, dateModified: formattedDate });
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
              key={project._id || project.id}
              project={{ ...project, dateModified: formatDateTime(project.dateModified) }}
              onDeleteClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(project._id || project.id);
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