'use client'

import styles from './page.module.css'
import { useRouter } from 'next/navigation'
import { uuid } from 'uuidv4'

export default function HomePage() {
    const { push } = useRouter()

    const handleCreateRoom = () => {
        const id = uuid()
        push(`/room/${id}`)
    }

    return (
        <div className={styles.container}>
            <h1>WELCOME!</h1>
            <button onClick={handleCreateRoom}>Create room</button>
        </div>
    )
}
