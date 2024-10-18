import React, { useState } from 'react';
import axios from 'axios';
import styles from './AuthPage.module.css';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm = ({ toggleAuthMode, apiUrl, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.get(`${apiUrl}/api/users/name/${username}`, {
        auth: {
          username: username,
          password: password
        }
      });
      setMessage("Login Successful!");
      onLoginSuccess(response.data);
    }
    catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Check your username or password.');
    }
  };

  return (
    <form className={styles.formContent} onSubmit={handleSubmit}>
        <Input 
                type = "text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
        />
        <Input 
                type = "password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
        />
        <Button type="submit">Login</Button>
        {message && <p className={styles.message}>{message}</p>}
        <p className={styles.text}>
            <span className={styles.link}>Forgot your password?</span>
        </p>
        <p className={styles.text}>
            Don't have an account?{' '}
            <span className={styles.link} onClick={toggleAuthMode}>Sign Up</span>
        </p>
    </form>
  )
}

export default LoginForm;