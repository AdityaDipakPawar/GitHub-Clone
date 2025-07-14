import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const RepoDetail = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/repo/${id}`)
      .then(res => {
        // Backend returns an array, so we take the first item
        setRepo(res.data[0]);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch repository');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading repository...</div>;
  if (error) return <div>{error}</div>;
  if (!repo) return <div>No repository found.</div>;

  return (
    <div>
      <h2>{repo.name}</h2>
      <p>{repo.description}</p>
      <p>Visibility: {repo.visibility ? 'Private' : 'Public'}</p>
      {/* Add more repo details as needed */}
    </div>
  );
};

export default RepoDetail; 