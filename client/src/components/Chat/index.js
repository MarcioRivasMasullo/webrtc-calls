'use client'

import styles from './index.module.css'
import { useState, useEffect } from 'react'
import Message from '../Message'

export default function Chat(props) {
    const [messages, setMessages] = useState([])
    const [messageText, setMessageText] = useState('')

    useEffect(() => {
        // When new message arrive, we add it to the chat
        console.log(props.socket)
        props.socket?.on('message', message => {
            console.log('Message arrived', message)
            setMessages([...messages, message])
        })
    }, [messages, props.socket])

    const sendMessage = () => {
        // We emit the message so the socket will broadcast it to the rest of the users
        props.socket?.emit('send-message', { message: messageText, roomId: props.roomId })
        setMessages([...messages, { message: messageText, id: props.socket.id }])
        setMessageText('')
    }

    console.log(messages)

    return (
        <div className={styles.container}>
            <div className={styles.messages}>
                {messages.map((message, index) => (
                    <Message
                        key={`${index}-${message.id}`}
                        text={message.message}
                        isUserSender={message.id === props.socket.id}
                    />
                ))}
            </div>
            <div className={styles['input-box']}>
                <textarea
                    type="text"
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}
