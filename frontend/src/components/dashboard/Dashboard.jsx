import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";
import api from "../../services/api";

const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        const fetchRepositories = async () => {
            try {
                const response = await api.get(`/repo/user/${userId}`);
                console.log('User repositories response:', response.data);
                console.log('Number of user repositories:', response.data.repositories?.length || 0);
                setRepositories(response.data.repositories);
            } catch (err) {
                console.error("Error while fetching repositories: ", err);
            }
        };

        const fetchSuggestedRepositories = async () => {
            try {
                const response = await api.get(`/repo/all`);
                console.log('All repositories for suggestions:', response.data);
                console.log('Number of suggested repositories:', response.data.length);
                setSuggestedRepositories(response.data);
            } catch (err) {
                console.error("Error while fetching repositories: ", err);
            }
        };

        fetchRepositories();
        fetchSuggestedRepositories();
    }, []);

    useEffect(() => {
        if (searchQuery === "") {
            setSearchResults(repositories);
        } else {
            const filteredRepo = repositories.filter((repo) =>
                repo.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filteredRepo);
        }
    }, [searchQuery, repositories]);

    const handleDeleteRepo = async (repoId) => {
        if (window.confirm("Are you sure you want to delete this repository?")) {
            try {
                await api.delete(`/repo/delete/${repoId}`);
                // Refresh the repositories list
                const userId = localStorage.getItem("userId");
                const response = await api.get(`/repo/user/${userId}`);
                setRepositories(response.data.repositories);
            } catch (err) {
                console.error("Error deleting repository: ", err);
                alert("Failed to delete repository");
            }
        }
    };

    const handleToggleVisibility = async (repoId) => {
        try {
            await api.patch(`/repo/toggle/${repoId}`);
            // Refresh the repositories list
            const userId = localStorage.getItem("userId");
            const response = await api.get(`/repo/user/${userId}`);
            setRepositories(response.data.repositories);
        } catch (err) {
            console.error("Error toggling visibility: ", err);
            alert("Failed to toggle repository visibility");
        }
    };

    return (
        <>
            <Navbar />
            <section id="dashboard">
                <aside>
                    <h3>Suggested Repositories</h3>
                    {suggestedRepositories.map((repo) => (
                        <div key={repo._id} className="suggested-repo">
                            <h4>{repo.name}</h4>
                        </div>
                    ))}
                </aside>
                <main>
                    <h2>Your Repositories</h2>
                    <div id="search">
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search your repositories..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="user-repos">
                        {searchResults.length === 0 ? (
                            <div className="no-repos">No repositories found</div>
                        ) : (
                            searchResults.map((repo) => (
                                <div key={repo._id} className="repo-item">
                                    <Link 
                                        to={`/repos/${repo._id}`}
                                        className="repo-name-link"
                                    >
                                        {repo.name}
                                    </Link>
                                    <div className="repo-actions">
                                        <Link 
                                            to={`/repos/${repo._id}/edit`}
                                            className="action-btn edit-btn"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleToggleVisibility(repo._id)}
                                            className="action-btn toggle-btn"
                                        >
                                            {repo.visibility ? 'Make Public' : 'Make Private'}
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteRepo(repo._id)}
                                            className="action-btn delete-btn"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
                <aside>
                    <h3>Upcoming Events</h3>
                    <ul>
                        <li>
                            <p>Tech Conference </p>
                        </li>
                        <li>
                            <p>Developer Meetup </p>
                        </li>
                        <li>
                            <p>React Summit </p>
                        </li>
                    </ul>
                </aside>
            </section>
        </>
    );
};

export default Dashboard;