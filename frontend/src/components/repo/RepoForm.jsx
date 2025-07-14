import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './repoForm.css';

const RepoForm = ({ onSuccess, repo: initialRepo }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(initialRepo);
  const [name, setName] = useState(initialRepo ? initialRepo.name : '');
  const [description, setDescription] = useState(initialRepo ? initialRepo.description : '');
  const [isPrivate, setIsPrivate] = useState(initialRepo ? initialRepo.visibility : false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch repository data if we're in edit mode and don't have the repo data
  useEffect(() => {
    if (id && !initialRepo) {
      const fetchRepo = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/repo/${id}`);
          const repoData = response.data[0]; // Backend returns array
          setRepo(repoData);
          setName(repoData.name);
          setDescription(repoData.description || '');
          setIsPrivate(repoData.visibility);
        } catch (err) {
          setError('Failed to fetch repository');
        } finally {
          setLoading(false);
        }
      };
      fetchRepo();
    }
  }, [id, initialRepo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (repo) {
        console.log('Updating repo:', repo._id, { name, description, visibility: isPrivate });
        await api.put(`/repo/update/${repo._id}`, { name, description, visibility: isPrivate });
      } else {
        const owner = localStorage.getItem('userId');
        console.log('Creating repo:', { name, description, visibility: isPrivate, owner });
        
        // Validate required fields
        if (!name.trim()) {
          setError('Repository name is required');
          return;
        }
        
        if (!owner) {
          setError('User ID not found. Please log in again.');
          return;
        }
        
        // Check if owner ID is a valid MongoDB ObjectId format (24 character hex string)
        if (!/^[0-9a-fA-F]{24}$/.test(owner)) {
          setError('Invalid user ID format. Please log in again.');
          return;
        }
        
        await api.post('/repo/create', { name, description, visibility: isPrivate, owner });
      }
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate back to dashboard if no onSuccess callback
        navigate('/');
      }
    } catch (err) {
      console.error('Repository save error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
      setError(`Failed to save repository: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="repo-form-wrapper">Loading repository...</div>;
  }

  return (
    <form className="repo-form-wrapper" onSubmit={handleSubmit}>
      <h2>{repo ? 'Edit' : 'Create'} Repository</h2>
      {error && <div className="error">{error}</div>}
      <div>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="checkbox-label">
        <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
        Private
      </div>
      <button type="submit">{repo ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default RepoForm; 