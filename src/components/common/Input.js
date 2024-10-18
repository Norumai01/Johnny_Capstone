import React from 'react';
import styles from './Common.module.css';

const Input = ({ type = 'text', placeholder, ...props }) => {
  // Create a component for input.
  return (
    <input type={type} placeholder={placeholder} className={styles.input} {...props} />
  )
}

export default Input;