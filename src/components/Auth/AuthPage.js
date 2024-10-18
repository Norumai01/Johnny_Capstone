import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from './AuthPage.module.css';
import Logo from '../common/Logo';
import Footer from '../common/Footer';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleAuthMode = () => setIsLogin(!isLogin);
  const navigate = useNavigate();
  // TODO: Probably put the apiURL in the app.js in the future.
  const apiUrl = 'http://localhost:8080';

  const handleLoginSuccess = (userData) => {
    // Stores userdata in localStorage. User data will still persists for days unless browser data is deleted.
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard');
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.formBox}>
          <Logo />
          <hr className={styles.divider}/>
          {/* Changes based on the state whether the user wants to login or sign up. */}
          {isLogin ? <LoginForm toggleAuthMode={toggleAuthMode} apiUrl={apiUrl} onLoginSuccess={handleLoginSuccess} /> : <RegisterForm toggleAuthMode={toggleAuthMode} apiUrl={apiUrl} />}
        </div>
      </div>
      <Footer />
    </div>
  )
};

export default AuthPage;