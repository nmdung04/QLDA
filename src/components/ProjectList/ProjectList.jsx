import React, { useState, useRef } from 'react';
import styles from './ProjectList.module.scss';
import Button from '../Button/Button';
import ProjectItem from '../ProjectItem/ProjectItem';
import ConfirmForm from '../ConfirmForm/ConfirmForm';
import VideoList from '../VideoList/VideoList';

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

  // Xử lý khi nhấn nút New Project - thay đổi logic ở đây
  const handleNewProjectClick = () => {
    // Tạo project mới với tên mặc định
    const defaultName = `New Project ${projects.length + 1}`;
    setNewProjectName(defaultName);
    setIsCreatingNewProject(true);
  };

  // Xử lý khi click vào một project
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  // Quay lại danh sách projects
  const handleBackToProjects = () => {
    setSelectedProject(null);
    setIsCreatingNewProject(false);
    setNewProjectName('');
  };

  // Xử lý khi thêm video vào project mới
  const handleAddVideoToNewProject = (videoData) => {
    // Tạo project mới với video đầu tiên
    const newProject = {
      id: Date.now(),
      title: newProjectName,
      videoCount: 1,
      dateModified: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      thumbnail: '/placeholder.jpg'
    };
    
    // Thêm project vào danh sách
    setProjects([...projects, newProject]);
    
    // Chuyển sang chế độ xem project với video đã thêm
    setSelectedProject(newProject);
    setIsCreatingNewProject(false);
  };

  // Nếu đang tạo project mới
  if (isCreatingNewProject) {
    return (
      <VideoList 
        projectName={newProjectName}
        isNewProject={true}
        onBackToProjects={handleBackToProjects}
        onAddFirstVideo={handleAddVideoToNewProject}
      />
    );
  }

  // Nếu đang xem chi tiết project
  if (selectedProject) {
    return (
      <VideoList 
        projectName={selectedProject.title} 
        onBackToProjects={handleBackToProjects}
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