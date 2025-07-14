import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const IssueDetail = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/issue/${id}`)
      .then(res => {
        setIssue(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch issue');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading issue...</div>;
  if (error) return <div>{error}</div>;
  if (!issue) return <div>No issue found.</div>;

  return (
    <div>
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
      {/* Add more issue details as needed */}
    </div>
  );
};

export default IssueDetail; 