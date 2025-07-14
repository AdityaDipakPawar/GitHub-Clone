import React, { useState } from 'react';
import axios from 'axios';

const IssueForm = ({ onSuccess, issue, repoId }) => {
  const [title, setTitle] = useState(issue ? issue.title : '');
  const [description, setDescription] = useState(issue ? issue.description : '');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (issue) {
        await axios.put(`/issue/update/${issue._id}`, { title, description });
      } else {
        await axios.post('/issue/create', { title, description, repoId });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to save issue');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{issue ? 'Edit' : 'Create'} Issue</h2>
      {error && <div>{error}</div>}
      <div>
        <label>Title:</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <button type="submit">{issue ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default IssueForm; 