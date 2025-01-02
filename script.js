// Initial user data structure
const initialUserData = {
    name: '',
    aura: 1000,
    dailyActions: {
        salah: [],
        quran: 0,
        charity: 0,
        help: 0,
        dhikr: 0,
        fast: false
    },
    stats: {
        totalPrayers: 0,
        totalQuranSessions: 0,
        weeklyActivity: Array(7).fill(0)
    },
    lastUpdate: new Date().toDateString()
};

// Islamic Quotes
const islamicQuotes = [
    {
        text: "The best among you are those who have the best character.",
        author: "Prophet Muhammad ﷺ"
    },
    {
        text: "Verily, with hardship comes ease.",
        author: "Quran 94:6"
    },
    {
        text: "Speak good or remain silent.",
        author: "Prophet Muhammad ﷺ"
    },
    {
        text: "Paradise lies beneath the feet of your mother.",
        author: "Prophet Muhammad ﷺ"
    },
    {
        text: "The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.",
        author: "Prophet Muhammad ﷺ"
    },
    {
        text: "Be in this world as if you were a stranger or a traveler along a path.",
        author: "Prophet Muhammad ﷺ"
    },
    {
        text: "He who has been given wisdom has been given a great good.",
        author: "Quran 2:269"
    },
    {
        text: "The most beloved actions to Allah are those performed consistently, even if they are small.",
        author: "Prophet Muhammad ﷺ"
    },
    {
        text: "Make things easier, do not make things more difficult. Spread the glad tidings, do not hate.",
        author: "Prophet Muhammad ﷺ"
    },
    {
        text: "Every act of kindness is charity.",
        author: "Prophet Muhammad ﷺ"
    }
];

// Global user data
let userData = { ...initialUserData };

// Show welcome modal for first-time users
function showWelcomeModal() {
    const modal = document.createElement('div');
    modal.className = 'welcome-modal';
    modal.innerHTML = `
        <div class="welcome-content">
            <div class="app-logo">
                <i class="fas fa-mosque"></i>
            </div>
            <h2>Welcome to MuslimAura</h2>
            <p>Track your spiritual journey</p>
            <div class="welcome-form">
                <input type="text" id="welcomeName" placeholder="Enter your name" class="welcome-input" maxlength="20">
                <button id="startJourney" class="welcome-btn">Start Journey</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const nameInput = modal.querySelector('#welcomeName');
    const startButton = modal.querySelector('#startJourney');

    nameInput.focus();
    
    const startJourney = () => {
        const name = nameInput.value.trim();
        if (name) {
            userData = { ...initialUserData, name: name };
            saveUserData();
            updateUI();
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        } else {
            nameInput.classList.add('shake');
            setTimeout(() => nameInput.classList.remove('shake'), 500);
        }
    };

    startButton.addEventListener('click', startJourney);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startJourney();
        }
    });
}

// Update daily quote
function updateDailyQuote() {
    const quoteElement = document.getElementById('dailyQuote');
    const randomQuote = islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)];
    quoteElement.innerHTML = `
        "${randomQuote.text}"
        <footer>- ${randomQuote.author}</footer>
    `;
}

// Reset aura function
function resetAura() {
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

// Show share modal
async function showShareModal() {
    try {
        // Create a temporary container for the progress card
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-9999px';
        tempContainer.style.background = '#1e1e1e';
        tempContainer.style.padding = '1.5rem';
        tempContainer.style.borderRadius = '12px';
        tempContainer.style.width = '300px';
        tempContainer.innerHTML = `
            <div class="share-preview" id="sharePreview" style="text-align: center;">
                <div style="font-size: 1.3rem; color: #ffd700; margin-bottom: 0.5rem;">
                    <i class="fas fa-mosque" style="margin-right: 8px;"></i>MuslimAura
                </div>
                <div style="font-size: 1.1rem; color: #ffd700;">${userData.name}'s Progress</div>
                <div style="font-size: 2rem; color: #ffffff; margin: 0.5rem 0;">
                    ✨ ${userData.aura} Aura Points
                </div>
                <div style="color: #888; font-size: 0.8rem;">
                    Track on iezyverse.online
                </div>
            </div>
        `;
        document.body.appendChild(tempContainer);

        // Use html2canvas to create an image
        const canvas = await html2canvas(tempContainer.querySelector('#sharePreview'), {
            backgroundColor: '#1e1e1e',
            scale: 2,
            logging: false
        });

        // Clean up temporary container
        tempContainer.remove();

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');

        // Create download link
        const link = document.createElement('a');
        link.download = 'muslim-aura-progress.png';
        link.href = dataUrl;
        link.click();

        showNotification('Progress image saved! ✨');
    } catch (error) {
        console.error('Error saving progress:', error);
        showNotification('Could not save progress. Please try again.');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('islamicLifestyleApp');
    
    if (!savedData) {
        showWelcomeModal();
    } else {
        userData = JSON.parse(savedData);
        updateUI();
    }

    // Update daily quote on load
    updateDailyQuote();

    // Add event listeners to action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            const rect = button.getBoundingClientRect();
            ripple.style.left = `${rect.width / 2}px`;
            ripple.style.top = `${rect.height / 2}px`;
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1000);

            // Add active state
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 200);

            // Handle the action
            handleAction(action);
        });
    });

    // Add event listener for reset button
    document.getElementById('resetAura').addEventListener('click', resetAura);

    // Add event listener for share button
    document.getElementById('shareAura').addEventListener('click', showShareModal);

    // Update share button text and style
    const shareButton = document.getElementById('shareAura');
    const resetButton = document.getElementById('resetAura');
    if (shareButton && resetButton) {
        shareButton.innerHTML = '<i class="fas fa-download"></i> Save Progress';
        resetButton.innerHTML = '<i class="fas fa-redo"></i> Reset Aura';
        // Remove inline styles and let CSS handle the width
        shareButton.style.removeProperty('width');
        resetButton.style.removeProperty('width');
    }
}); 