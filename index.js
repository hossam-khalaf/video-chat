// App
const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')

// socket.io
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
		method: ['GET', 'POST'],
	},
})

// Cors
app.use(cors())

// Port
const PORT = process.env.PORT || 8000

// Routs

app.get('/', (req, res) => {
	res.send('Server is running')
})

// socket.io configuration
io.on('connection', (socket) => {
	socket.emit('me', socket.id)

	socket.on('disconnect', () => {
		socket.broadcast.emit('canceled')
	})

	socket.on('calluser', (userToCall, signalData, from, name) => {
		io.to(userToCall.emit('calluser', { signal: signalData, from, name }))
	})

	socket.on('answercall', (data) => {
		io.to(data.to).emit('callaccepted', data.signal)
	})
})

// runing server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
