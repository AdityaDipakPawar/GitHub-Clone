import React, { useEffect } from "react";
import {useNavigate, useRoutes} from 'react-router-dom'

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import RepoList from "./components/repo/RepoList";
import RepoDetail from "./components/repo/RepoDetail";
import RepoForm from "./components/repo/RepoForm";
import IssueList from "./components/issue/IssueList";
import IssueDetail from "./components/issue/IssueDetail";
import IssueForm from "./components/issue/IssueForm";

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        if(!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname))
        {
            navigate("/auth");
        }

        if(userIdFromStorage && window.location.pathname=='/auth'){
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path: "/repos",
            element: <RepoList />
        },
        {
            path: "/repos/new",
            element: <RepoForm />
        },
        {
            path: "/repos/:id",
            element: <RepoDetail />
        },
        {
            path: "/repos/:id/edit",
            element: <RepoForm />
        },
        {
            path: "/repos/:repoId/issues",
            element: <IssueList />
        },
        {
            path: "/issues/new",
            element: <IssueForm />
        },
        {
            path: "/issues/:id",
            element: <IssueDetail />
        },
        {
            path: "/issues/:id/edit",
            element: <IssueForm />
        }
    ]);

    return element;
}

export default ProjectRoutes;