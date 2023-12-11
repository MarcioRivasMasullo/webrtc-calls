'use client'

import styles from './page.module.css'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Peer from 'simple-peer'
import io from 'socket.io-client'
import Chat from '@/components/Chat'

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5001'

const Video = props => {
    const ref = useRef()

    useEffect(() => {
        props.peer.on('stream', stream => {
            ref.current.srcObject = stream
        })
    }, [])

    return <video playsInline autoPlay ref={ref} width="100%" />
}

export default function RoomPage() {
    const { id } = useParams()
    const [peers, setPeers] = useState([])
    const socketRef = useRef()
    const userVideo = useRef()
    const peersRef = useRef([])
    const roomID = id

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io.connect(SERVER_URL)
            navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
                userVideo.current.srcObject = stream

                socketRef.current.emit('join-room', roomID)

                // Listeners
                socketRef.current.on('all-users', users => {
                    console.log('All users', users)
                    const peers = []
                    users.forEach(userID => {
                        if (!peersRef.current.filter(p => p.peerID === userID).length > 0) {
                            const peer = createPeer(userID, socketRef.current.id, stream)
                            peersRef.current.push({
                                peerID: userID,
                                peer,
                            })
                            peers.push(peer)
                        }
                    })
                    setPeers(peers)
                })

                socketRef.current.on('user-joined', payload => {
                    console.log('User joined', peersRef.current, payload)
                    if (!peersRef.current.filter(p => p.peerID === payload.callerID).length > 0) {
                        const peer = addPeer(payload.signal, payload.callerID, stream)
                        peersRef.current.push({
                            peerID: payload.callerID,
                            peer,
                        })
                        setPeers(users => [...users, peer])
                    }
                })

                socketRef.current.on('receiving-returned-signal', payload => {
                    console.log('Receiving returned signal', payload, peersRef.current)
                    const item = peersRef.current.find(p => p.peerID === payload.id)
                    item.peer.signal(payload.signal)
                })
            })
        }
    }, [])

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        })

        peer.on('signal', signal => {
            socketRef.current.emit('sending-signal', { userToSignal, callerID, signal })
        })

        return peer
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on('signal', signal => {
            socketRef.current.emit('returning-signal', { signal, callerID })
        })

        peer.signal(incomingSignal)

        return peer
    }

    return (
        <div className={styles.container}>
            <p>{`Room:  ${id} - Socket: ${socketRef.current?.id}`}</p>
            <div className={styles.videos}>
                <div className={styles['video-wrapper']}>
                    <video ref={userVideo} autoPlay playsInline width="100%" />
                </div>
                {peers.map((peer, index) => (
                    <div className={styles['video-wrapper']}>
                        <Video key={index} peer={peer} />
                    </div>
                ))}
                <Chat socket={socketRef.current} roomId={roomID} />
            </div>
        </div>
    )
}
