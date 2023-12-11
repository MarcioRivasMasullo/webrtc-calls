const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const server = http.createServer(app)
const socketIo = require('socket.io')

app.use(
    cors({
        origin: '*',
    })
)

const users = {}
const socketToRoom = {}

const io = socketIo(server, {
    cors: {
        origin: '*',
    },
})

io.on('connection', socket => {
    const socketId = socket.id

    console.log('New user connected with socketId:', socketId)

    socket.on('join-room', roomID => {
        if (users[roomID]) {
            console.log(
                'New user trying to join:',
                roomID,
                ' where are ',
                users[roomID].length,
                ' people'
            )
            if (users[roomID].length === 2) {
                socket.emit('room-full')
                return
            }
            users[roomID].push(socketId)
        } else {
            console.log('New user created room:', roomID)
            users[roomID] = [socketId]
        }
        socketToRoom[socketId] = roomID
        const otherUsersInThisRoom = users[roomID].filter(id => id !== socketId)

        console.log('Users on the room: ', users[roomID])

        socket.emit('all-users', otherUsersInThisRoom)
    })

    socket.on('sending-signal', payload => {
        console.log(
            'User with socket id ',
            payload.callerID,
            ' is sending signal to ',
            payload.userToSignal
        )

        io.to(payload.userToSignal).emit('user-joined', {
            signal: payload.signal,
            callerID: payload.callerID,
        })
    })

    socket.on('returning-signal', payload => {
        console.log('User with socket id ', socketId, ' is returning signal to ', payload.callerID)

        io.to(payload.callerID).emit('receiving-returned-signal', {
            signal: payload.signal,
            id: socketId,
        })
    })

    socket.on('send-message', data => {
        const { message, roomId } = data
        console.log(users[roomId])
        // We only send the message to the users that joined the room
        users[roomId].forEach(userSocket => {
            if (userSocket !== socketId) {
                socket.to(userSocket).emit('message', { message, id: socket.id })
                console.log(`${socket.id} sended a message to ${userSocket}. Message: ${message}`)
            }
        })
    })

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socketId]
        let room = users[roomID]
        if (room) {
            room = room.filter(id => id !== socketId)
            users[roomID] = room
        }

        console.log('User disconnected with socketId:', socketId)
    })
})

const PORT = process.env.PORT || 5001

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
