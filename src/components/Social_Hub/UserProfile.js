import React from "react";
import styles from "./hub.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { User } from 'lucide-react';
import Card from "../PostCards/Card";
import Footer from "../common/Footer";

const UserProfile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate("/")
        }
    }, [user, navigate]);

    // Prevent rendering content if no user.
    if (!user) return null; 
    
    return (  
        <div className={styles.userprofile}>
            <Header />

            {/* Profile Box */}
            <div className={styles.profileBox}>
                <div className={styles.profilePictureBox}>
                    <h2>{ user?.username }</h2>
                    <div className={styles.profilePicture}>
                        {user.profilePictureURL ? (
                            <img src={user?.profilePictureURL} alt={`${user?.username}'s profile`} />
                            ) : (
                            <User size={90} />
                        )}
                    </div>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>{user?.postsCount}</span>
                            <span className={styles.statLabel}>Posts</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>43</span>
                            <span className={styles.statLabel}>Followers</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>106</span>
                            <span className={styles.statLabel}>Following</span>
                        </div>
                    </div>
                    {user.bio && <p className={styles.bio}>{user.bio}</p>}
                </div>
            </div>

            {/* Line Sepertator */}
            <hr className={styles.divider}/>

            {/* Posts */}
            <div className={styles.postsContainer}>
                {user.posts.map(post => (
                    <Card post={post} user={user} />
                ))}
            </div>

            <Footer />
        </div>
    );
}
 
export default UserProfile;