const DEFAULT_SETTINGS = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4
};

let settings = { ...DEFAULT_SETTINGS };
let currentMode = 'work'; // 'work', 'break', 'longbreak'
let timeRemaining = 25 * 60; // seconds
let totalTime = 25 * 60;
let isRunning = false;
let timerInterval = null;
let sessionCount = 0;
let wakeLock = null;

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const modeLabelEl = document.getElementById('modeLabel');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const sessionCountEl = document.getElementById('sessionCount');
const timerDisplayEl = document.getElementById('timerDisplay');

const workDurationInput = document.getElementById('workDuration');
const shortBreakDurationInput = document.getElementById('shortBreakDuration');
const longBreakDurationInput = document.getElementById('longBreakDuration');
const longBreakIntervalInput = document.getElementById('longBreakInterval');

// Audio context for sound
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound() {
    try {
        initAudio();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Ignore audio errors
    }
}

function vibrate() {
    if ('vibrate' in navigator) {
        try {
            navigator.vibrate([200, 100, 200]);
        } catch (e) {
            // Ignore vibration errors
        }
    }
}

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
        }
    } catch (e) {
        // Ignore wake lock errors
    }
}

async function releaseWakeLock() {
    if (wakeLock) {
        try {
            await wakeLock.release();
            wakeLock = null;
        } catch (e) {
            // Ignore wake lock errors
        }
    }
}

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            settings = { ...DEFAULT_SETTINGS, ...parsed };
        }
    } catch (e) {
        settings = { ...DEFAULT_SETTINGS };
    }
    
    workDurationInput.value = settings.workDuration;
    shortBreakDurationInput.value = settings.shortBreakDuration;
    longBreakDurationInput.value = settings.longBreakDuration;
    longBreakIntervalInput.value = settings.longBreakInterval;
}

function saveSettings() {
    try {
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    } catch (e) {
        // Ignore localStorage errors
    }
}

function loadState() {
    try {
        const savedState = localStorage.getItem('pomodoroState');
        if (savedState) {
            const state = JSON.parse(savedState);
            currentMode = state.currentMode || 'work';
            sessionCount = state.sessionCount || 0;
            isRunning = state.isRunning || false;
            
            if (state.endTime && isRunning) {
                const now = Date.now();
                const remaining = Math.max(0, Math.ceil((state.endTime - now) / 1000));
                timeRemaining = remaining;
                totalTime = state.totalTime || getDurationForMode(currentMode) * 60;
                if (timeRemaining === 0) {
                    handleTimerComplete();
                }
            } else {
                timeRemaining = state.timeRemaining || getDurationForMode(currentMode) * 60;
                totalTime = state.totalTime || getDurationForMode(currentMode) * 60;
                isRunning = false;
            }
        } else {
            timeRemaining = settings.workDuration * 60;
            totalTime = settings.workDuration * 60;
        }
    } catch (e) {
        timeRemaining = settings.workDuration * 60;
        totalTime = settings.workDuration * 60;
        currentMode = 'work';
        sessionCount = 0;
        isRunning = false;
    }
    
    sessionCountEl.textContent = sessionCount;
    updateDisplay();
    updateUI();
}

function saveState() {
    try {
        const state = {
            currentMode,
            timeRemaining,
            totalTime,
            isRunning,
            sessionCount,
            endTime: isRunning ? Date.now() + timeRemaining * 1000 : null
        };
        localStorage.setItem('pomodoroState', JSON.stringify(state));
    } catch (e) {
        // Ignore localStorage errors
    }
}

function getDurationForMode(mode) {
    if (mode === 'work') return settings.workDuration;
    if (mode === 'longbreak') return settings.longBreakDuration;
    return settings.shortBreakDuration;
}

function updateDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    minutesEl.textContent = String(mins).padStart(2, '0');
    secondsEl.textContent = String(secs).padStart(2, '0');
    
    // Update mode label
    if (currentMode === 'work') {
        modeLabelEl.textContent = 'Work';
    } else if (currentMode === 'longbreak') {
        modeLabelEl.textContent = 'Long Break';
    } else {
        modeLabelEl.textContent = 'Break';
    }
    
    // Update body classes for styling
    document.body.className = '';
    if (isRunning) {
        if (currentMode === 'work') {
            document.body.classList.add('state-work');
        } else if (currentMode === 'longbreak') {
            document.body.classList.add('state-longbreak');
        } else {
            document.body.classList.add('state-break');
        }
    } else {
        document.body.classList.add('state-paused');
    }
}

function updateUI() {
    if (isRunning) {
        startPauseBtn.textContent = 'Pause';
    } else {
        startPauseBtn.textContent = 'Start';
    }
}

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    requestWakeLock();
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        saveState();
        updateDisplay();
        
        if (timeRemaining <= 0) {
            handleTimerComplete();
        }
    }, 1000);
    
    saveState();
    updateUI();
    updateDisplay();
}

function pauseTimer() {
    if (!isRunning) return;
    
    isRunning = false;
    releaseWakeLock();
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    saveState();
    updateUI();
    updateDisplay();
}

function handleTimerComplete() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isRunning = false;
    releaseWakeLock();
    
    playSound();
    vibrate();
    
    if (currentMode === 'work') {
        sessionCount++;
        sessionCountEl.textContent = sessionCount;
        
        // Check if it's time for long break
        if (sessionCount % settings.longBreakInterval === 0) {
            currentMode = 'longbreak';
            timeRemaining = settings.longBreakDuration * 60;
            totalTime = settings.longBreakDuration * 60;
        } else {
            currentMode = 'break';
            timeRemaining = settings.shortBreakDuration * 60;
            totalTime = settings.shortBreakDuration * 60;
        }
    } else {
        // Break finished, go to work
        currentMode = 'work';
        timeRemaining = settings.workDuration * 60;
        totalTime = settings.workDuration * 60;
    }
    
    saveState();
    updateUI();
    updateDisplay();
    document.body.classList.add('state-finished');
    setTimeout(() => {
        document.body.classList.remove('state-finished');
    }, 2000);
}

function resetTimer() {
    isRunning = false;
    releaseWakeLock();
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    currentMode = 'work';
    timeRemaining = settings.workDuration * 60;
    totalTime = settings.workDuration * 60;
    
    saveState();
    updateUI();
    updateDisplay();
}

startPauseBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', () => {
    resetTimer();
});

// Settings change handlers
workDurationInput.addEventListener('change', () => {
    const val = parseInt(workDurationInput.value);
    if (val >= 1 && val <= 60) {
        settings.workDuration = val;
        saveSettings();
        if (currentMode === 'work' && !isRunning) {
            timeRemaining = settings.workDuration * 60;
            totalTime = settings.workDuration * 60;
            updateDisplay();
            saveState();
        }
    } else {
        workDurationInput.value = settings.workDuration;
    }
});

shortBreakDurationInput.addEventListener('change', () => {
    const val = parseInt(shortBreakDurationInput.value);
    if (val >= 1 && val <= 30) {
        settings.shortBreakDuration = val;
        saveSettings();
        if (currentMode === 'break' && !isRunning) {
            timeRemaining = settings.shortBreakDuration * 60;
            totalTime = settings.shortBreakDuration * 60;
            updateDisplay();
            saveState();
        }
    } else {
        shortBreakDurationInput.value = settings.shortBreakDuration;
    }
});

longBreakDurationInput.addEventListener('change', () => {
    const val = parseInt(longBreakDurationInput.value);
    if (val >= 1 && val <= 60) {
        settings.longBreakDuration = val;
        saveSettings();
        if (currentMode === 'longbreak' && !isRunning) {
            timeRemaining = settings.longBreakDuration * 60;
            totalTime = settings.longBreakDuration * 60;
            updateDisplay();
            saveState();
        }
    } else {
        longBreakDurationInput.value = settings.longBreakDuration;
    }
});

longBreakIntervalInput.addEventListener('change', () => {
    const val = parseInt(longBreakIntervalInput.value);
    if (val >= 2 && val <= 10) {
        settings.longBreakInterval = val;
        saveSettings();
    } else {
        longBreakIntervalInput.value = settings.longBreakInterval;
    }
});

// Handle visibility change for iOS Safari (resume timer if needed)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isRunning) {
        // Recalculate time based on wall clock
        try {
            const savedState = localStorage.getItem('pomodoroState');
            if (savedState) {
                const state = JSON.parse(savedState);
                if (state.endTime && state.isRunning) {
                    const now = Date.now();
                    const remaining = Math.max(0, Math.ceil((state.endTime - now) / 1000));
                    if (remaining !== timeRemaining) {
                        timeRemaining = remaining;
                        updateDisplay();
                        if (timeRemaining <= 0) {
                            handleTimerComplete();
                        }
                    }
                }
            }
        } catch (e) {
            // Ignore
        }
    }
});

// Initialize
loadSettings();
loadState();

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}
