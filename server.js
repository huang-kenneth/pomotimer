const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let timer = 25 * 60; // Initial time in seconds (25 minutes)
let is25MinuteInterval = true; // Flag to track the current interval

let interval; // Variable to store the interval

io.on('connection', (socket) => {
    // Send the current timer and interval flag to a new user
    socket.emit('updateTimer', { time: formatTime(timer), is25MinuteInterval });

    // If there's an existing interval, clear it
    if (interval) {
        clearInterval(interval);
    }

    // Update the timer every second
    interval = setInterval(() => {
        timer--;

        if (timer === 0) {
            // Switch the interval
            is25MinuteInterval = !is25MinuteInterval;

            // Set the timer for the next interval
            timer = is25MinuteInterval ? 25 * 60 : 5 * 60;
        }

        io.emit('updateTimer', { time: formatTime(timer), is25MinuteInterval });

        if (timer === 0 && !is25MinuteInterval) {
            clearInterval(interval); // Stop the interval after the 5-minute break
        }
    }, 1000);
});

// Handle disconnection
io.on('disconnect', () => {
    if (interval) {
        clearInterval(interval);
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});