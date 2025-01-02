// Constants for point values
const POINTS = {
    SALAH: 1000,
    SALAH_BONUS: 5000,
    FAST: 2000,
    HELP: 1500,
    QURAN: 3000,
    CHARITY: 2500,
    DHIKR: 500,
    DUA: 1200,
    OTHER_GOOD: 1000,
    MISSED_SALAH: -1000,
    NEGATIVE_SPEECH: -1500,
    NEGLECT: -2000,
    OTHER_BAD: -1000
};

// Action handlers
function handleAction(action) {
    const today = new Date().toDateString();
    
    // Reset daily actions if it's a new day
    if (userData.lastUpdate !== today) {
        resetDailyActions();
    }

    let pointsEarned = 0;
    let message = '';

    switch (action) {
        case 'salah':
            pointsEarned = POINTS.SALAH;
            message = `+${POINTS.SALAH} Aura Points for Salah! 🕌`;
            userData.dailyActions.salah.push(new Date().toISOString());
            
            // Check for 5 daily prayers bonus
            if (userData.dailyActions.salah.length === 5) {
                pointsEarned += POINTS.SALAH_BONUS;
                message = `Mashallah! +${POINTS.SALAH + POINTS.SALAH_BONUS} Points for completing all prayers! 🌟`;
            }
            userData.stats.totalPrayers++;
            break;

        case 'quran':
            pointsEarned = POINTS.QURAN;
            message = `+${POINTS.QURAN} Aura Points for reading Qur'an! 📖`;
            userData.dailyActions.quran++;
            userData.stats.totalQuranSessions++;
            break;

        case 'charity':
            pointsEarned = POINTS.CHARITY;
            message = `+${POINTS.CHARITY} Aura Points for giving charity! 💝`;
            userData.dailyActions.charity++;
            break;

        case 'help':
            pointsEarned = POINTS.HELP;
            message = `+${POINTS.HELP} Aura Points for helping others! 🤝`;
            userData.dailyActions.help++;
            break;

        case 'dhikr':
            pointsEarned = POINTS.DHIKR;
            message = `+${POINTS.DHIKR} Aura Points for Dhikr! 🤲`;
            userData.dailyActions.dhikr++;
            break;

        case 'fast':
            if (!userData.dailyActions.fast) {
                pointsEarned = POINTS.FAST;
                message = `+${POINTS.FAST} Aura Points for fasting! 🌙`;
                userData.dailyActions.fast = true;
            }
            break;

        case 'dua':
            pointsEarned = POINTS.DUA;
            message = `+${POINTS.DUA} Aura Points for making Du'a! 💫`;
            break;

        case 'other_good':
            pointsEarned = POINTS.OTHER_GOOD;
            message = `+${POINTS.OTHER_GOOD} Aura Points for good deed! ⭐`;
            break;

        // Negative actions
        case 'missed_salah':
            pointsEarned = POINTS.MISSED_SALAH;
            message = `${POINTS.MISSED_SALAH} Aura Points for missing Salah 😢`;
            break;

        case 'negative_speech':
            pointsEarned = POINTS.NEGATIVE_SPEECH;
            message = `${POINTS.NEGATIVE_SPEECH} Aura Points for negative speech 😔`;
            break;

        case 'neglect':
            pointsEarned = POINTS.NEGLECT;
            message = `${POINTS.NEGLECT} Aura Points for neglecting duties 😕`;
            break;

        case 'other_bad':
            pointsEarned = POINTS.OTHER_BAD;
            message = `${POINTS.OTHER_BAD} Aura Points for mistake 😔`;
            break;
    }

    if (pointsEarned !== 0) {
        userData.aura += pointsEarned;
        userData.lastUpdate = today;
        showNotification(message);
        saveUserData();
        updateUI();
    }
}

// Show reset confirmation modal
function showResetConfirmation() {
    const overlay = document.createElement('div');
    overlay.className = 'reset-modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'reset-modal';
    modal.innerHTML = `
        <h3>Reset Aura Points</h3>
        <p>Are you sure you want to reset your Aura Points to 1000?</p>
        <div class="reset-modal-buttons">
            <button class="reset-modal-btn confirm">Yes, Reset</button>
            <button class="reset-modal-btn cancel">Cancel</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const closeModal = () => {
        overlay.remove();
        modal.remove();
    };

    modal.querySelector('.confirm').addEventListener('click', () => {
        userData.aura = 1000;
        saveUserData();
        updateUI();
        showNotification('Aura Points reset to 1000 ✨');
        closeModal();
    });

    modal.querySelector('.cancel').addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
}

function resetDailyActions() {
    userData.dailyActions = {
        salah: [],
        quran: 0,
        charity: 0,
        help: 0,
        dhikr: 0,
        fast: false
    };
    userData.lastUpdate = new Date().toDateString();
}

function updateWeeklyActivity(points) {
    const today = new Date().getDay();
    userData.stats.weeklyActivity[today] += points;
}

function updateStreak() {
    const today = new Date().toDateString();
    
    if (userData.streaks.lastActive === today) {
        return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    if (userData.streaks.lastActive === yesterdayString) {
        userData.streaks.current++;
        if (userData.streaks.current > userData.streaks.best) {
            userData.streaks.best = userData.streaks.current;
        }
    } else {
        userData.streaks.current = 1;
    }

    userData.streaks.lastActive = today;
} 