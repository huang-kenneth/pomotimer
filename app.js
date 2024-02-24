const socket = io();

socket.on('updateTimer', ({ time, is25MinuteInterval }) => {
    const bodyElement = document.body;
    const timerElement = document.getElementById('timer');
    const activityElement = document.getElementById('activity'); // New element for displaying activity
    
    timerElement.innerText = time;

    // Toggle between light and dark modes based on is25MinuteInterval
    if (is25MinuteInterval) {
        bodyElement.classList.remove('light-mode');
        bodyElement.classList.add('dark-mode');
        activityElement.innerText = "(study)"; // Set activity text
    } else {
        bodyElement.classList.remove('dark-mode');
        bodyElement.classList.add('light-mode');
        activityElement.innerText = "(break)"; // Set activity text
    }
});

socket.on('user-count-change', function (userCount) {
    document.getElementById('userCount').innerText = userCount;
});

