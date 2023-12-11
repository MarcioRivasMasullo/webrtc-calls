import React from 'react'
import styles from './index.module.css'

const Message = ({ text, isUserSender }) => {
    return (
        <div className={`${styles.container} ${isUserSender ? styles.colored : ''}`}>
            <span className={styles.text}>{text}</span>
        </div>
    )
}

export default Message
