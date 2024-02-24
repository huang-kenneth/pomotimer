const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let timer = 25 * 60; // Initial time in seconds (25 minutes)
let is25MinuteInterval = true; // Flag to track the current interval
let interval; // Variable to store the interval

let userCount = 0; // Initialize number of users (0 when server starts)
const userCountUpdateDelay = 10000; // Initialize delay (ms) for updating number of users

// Function to update the timer every second
function updateTimer() {
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
}

// Function to format time as "mm:ss"
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Function to show number of active users currently
function activeUsers() {
    io.on('connection', socket => {
        userCount++;
        socket.on('disconnect', () => { userCount--; });
      
        socket.emit('user-count-change', userCount);
      });
      
      setInterval(() => {
        io.emit('user-count-change', userCount);
      }, userCountUpdateDelay);
}

// Start the timer when the server starts
updateTimer();
// Show number of activate users
activeUsers();


// Handle disconnection
io.on('disconnect', () => {
    if (interval) {
        clearInterval(interval);
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
