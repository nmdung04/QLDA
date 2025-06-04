import React, { useState } from 'react';
import styles from './ClipList.module.scss';
import ClipItem from '../ClipItem/ClipItem';
import ConfirmForm from '../ConfirmForm/ConfirmForm';

const ClipList = ({ clips: initialClips = [] }) => {
  const [clips, setClips] = useState(initialClips.length > 0 ? initialClips : [
    {
      id: 1,
      title: 'Clip 1',
      duration: '2 mins',
      thumbnail: '/placeholder.jpg'
    },
    {
      id: 2,
      title: 'Clip 2', 
      duration: '35 seconds',
      thumbnail: '/placeholder.jpg'
    },
    {
      id: 3,
      title: 'Clip 3',
      duration: '1 min',
      thumbnail: '/placeholder.jpg'
    }
  ]);
  
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [clipToDelete, setClipToDelete] = useState(null);

  const handleDeleteClick = (clipId) => {
    setClipToDelete(clipId);
    setShowConfirmForm(true);
  };

  const handleConfirmDelete = () => {
    if (clipToDelete) {
      setClips(clips.filter(clip => clip.id !== clipToDelete));
      setShowConfirmForm(false);
      setClipToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmForm(false);
    setClipToDelete(null);
  };

  return (
    <div className={styles.clipList}>
      <h3 className={styles.title}>Generated Clips</h3>
      
      {clips.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No clips generated yet. Click "Extract" to create clips using AI.</p>
        </div>
      ) : (
        <div className={styles.clipsGrid}>
          {clips.map(clip => (
            <ClipItem 
              key={clip.id}
              clip={clip}
              onDeleteClick={() => handleDeleteClick(clip.id)}
            />
          ))}
        </div>
      )}
      
      {showConfirmForm && (
        <ConfirmForm 
          message="Delete this clip?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isVisible={showConfirmForm}
        />
      )}
    </div>
  );
};

export default ClipList;