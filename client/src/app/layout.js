'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import styles from './layout.module.css'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
    const { push } = useRouter()

    const handleLogoClick = () => {
        push('/')
    }

    return (
        <html lang="en">
            <body className={inter.className}>
                <div className={styles['app-bar']}>
                    <span onClick={handleLogoClick}>QUBIKA P2P</span>
                </div>
                {children}
            </body>
        </html>
    )
}
