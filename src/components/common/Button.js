import React from "react";
import styles from './Common.module.css'

const Button = ({ children, onClick, type = 'button', ...props }) => {
    // Create a component for button.
    return (
        <button className={styles.button} onClick={onClick} type={type} {...props}>
            {children}
        </button>
    ) 
}

export default Button;