const socket = io();

socket.on('updateTimer', ({ time, is25MinuteInterval }) => {
    document.getElementById('timer').innerText = time;
    // Handle the interval flag as needed (e.g., update UI, change styles)
    if (is25MinuteInterval) {
        // Handle 25-minute interval
    } else {
        // Handle 5-minute break interval
    }
});
