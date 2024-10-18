import React, { useState, useEffect, useCallback } from "react";
import styles from "./hub.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Header from "../common/Header";
import Card from "../PostCards/Card";
import Footer from "../common/Footer";

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const apiUrl = 'http://localhost:8080';

    const fetchPosts = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const password = "password";
            const token = btoa(`${user.username}:${password}`);

            const response = await axios.get(`${apiUrl}/api/posts/user/${user.id}`, {
                headers: {
                    'Authorization': `Basic ${token}`
                }
            });
            setPosts(response.data);
            
            // Update user in localStorage with new posts, but don't update the state
            const updatedUser = { ...user, posts: response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            //setUser(updatedUser);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate("/")
        } else {
            fetchPosts();
        }
    }, [user, navigate, fetchPosts]);

    useEffect(() => {
        if (location.state?.refresh) {
            fetchPosts();
            // Clear the state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate, fetchPosts]);

    const handlePostDelete = useCallback((deletedPostId) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
        
        // Update user in localStorage
        const updatedUser = { 
            ...user, 
            posts: user.posts.filter(post => post.id !== deletedPostId) 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    }, [user]);

    const handlePostUpdate = useCallback((updatedPost) => {
        setPosts(prevPosts => prevPosts.map(post => 
            post.id === updatedPost.id ? updatedPost : post
        ));
        
        // Update user in localStorage
        const updatedUser = { 
            ...user, 
            posts: user.posts.map(post => 
                post.id === updatedPost.id ? updatedPost : post
            ) 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    }, [user]);

    // Prevent rendering content if no user.
    if (!user) return null; 
    
    return (
        <div className={styles.dashboard}>
            <Header className={styles.header} />

            {/* Posts */}
            <main className={styles.main}>
                {loading ? (
                    <h1 style={{ textAlign: 'center', color: '#333333' }}>Loading posts...</h1>
                ) : (
                    <div className={styles.postsContainer}>
                        {posts.map(post => (
                            <Card key={post.id} post={post} user={user}  onPostDelete={handlePostDelete} onPostUpdate={handlePostUpdate}/>
                        ))}
                    </div>
                )}
            </main>

            {!loading && posts.length === 0 && <h2>No posts to display</h2>}
            {!loading && posts.length > 0 && <h2>No more posts to load...</h2>}

            <Footer className={styles.footer} />
        </div>
    );
}

export default Dashboard;