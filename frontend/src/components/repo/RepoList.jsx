import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './repoList.css';

const RepoList = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/repo/all')
      .then(res => {
        console.log('All repositories from API:', res.data);
        console.log('Number of repositories:', res.data.length);
        
        // Log each repository's details
        res.data.forEach((repo, index) => {
          console.log(`Repository ${index + 1}:`, {
            id: repo._id,
            name: repo.name,
            description: repo.description,
            visibility: repo.visibility,
            owner: repo.owner,
            hasName: !!repo.name,
            hasId: !!repo._id
          });
        });
        
        setRepos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching repositories:', err);
        setError('Failed to fetch repositories');
        setLoading(false);
      });
  }, []);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Filtered repositories count:', filteredRepos.length);
  console.log('Search query:', searchQuery);

  if (loading) return <div>Loading repositories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="repo-list-wrapper">
      <h2>Repositories</h2>
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #2c3440',
            background: '#181c24',
            color: '#f1f6fd',
            fontSize: '1rem',
            marginBottom: '8px',
          }}
        />
      </div>
      <div className="repo-list">
        {filteredRepos.length === 0 ? (
          <div style={{ color: '#bfc9d1', textAlign: 'center', width: '100%' }}>No repositories found.</div>
        ) : (
          filteredRepos.map(repo => (
            <Link
              to={`/repos/${repo._id}`}
              key={repo._id}
              style={{
                background: '#23272f',
                borderRadius: '10px',
                padding: '20px 18px',
                width: '320px',
                color: '#f1f6fd',
                cursor: 'pointer',
                border: '2px solid #408ced',
                margin: '10px',
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                e.target.style.boxShadow = '0 6px 24px rgba(64,140,237,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {repo.name}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default RepoList; 