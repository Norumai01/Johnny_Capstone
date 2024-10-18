import React, { useState } from 'react';
import axios from 'axios';
import styles from './AuthPage.module.css';
import Button from '../common/Button';
import Input from '../common/Input';

const RegisterForm = ({ toggleAuthMode, apiUrl }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (password !== confirmPassword) {
            setMessage("Password don't match.");
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/users/createUser`, {
                username,
                email,
                password
            });
            setMessage('Registeration successful!');
            //console.log(response.data);
            toggleAuthMode();
        }
        catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    }
    
    
    return (
        <form className={styles.formContent} onSubmit={handleSubmit}>
            <Input 
                type = "email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
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
            <Input 
                type = "password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPsername(e.target.value)}
                required
            />
            <Button type="submit">Register</Button>
            {message && <p className={styles.message}>{message}</p>}
            <p className={styles.text}>
                Already have an account?{' '}
                <span className={styles.link} onClick={toggleAuthMode}>Login here</span>
            </p>
        </form>
    )
}

export default RegisterForm;