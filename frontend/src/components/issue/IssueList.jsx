import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IssueList = ({ repoId }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/issue/all')
      .then(res => {
        setIssues(res.data.filter(issue => issue.repoId === repoId));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch issues');
        setLoading(false);
      });
  }, [repoId]);

  if (loading) return <div>Loading issues...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>Issues</h3>
      <ul>
        {issues.map(issue => (
          <li key={issue._id}>{issue.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default IssueList; 