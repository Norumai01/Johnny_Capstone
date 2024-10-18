import React from 'react'
import styles from './Common.module.css'
import logoSrc from '../../assets/images/game_logo.png'

const Logo = ({ alt = 'Logo'}) => {
    // Create a component for logo.
    return (
        <div className={styles.logoContainer}>
            <img src={ logoSrc } alt={alt} className={styles.logo} />
        </div>
    )
}
 
export default Logo;