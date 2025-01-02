// UI Updates
function updateUI() {
    if (!userData) return;

    // Update aura display with animation
    const auraDisplay = document.getElementById('totalAura');
    const currentAura = parseInt(auraDisplay.textContent || '0');
    animateNumber(currentAura, userData.aura, auraDisplay);

    // Update aura circle glow effect
    updateAuraGlow();

    // Update user name
    document.getElementById('userName').textContent = userData.name || 'Guest User';
}

// Animate number counting
function animateNumber(start, end, element) {
    if (!element) return;
    
    const duration = 1000;
    const steps = 60;
    const step = (end - start) / steps;
    let current = start;
    
    const animate = setInterval(() => {
        current += step;
        if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
            clearInterval(animate);
            current = end;
        }
        element.textContent = Math.round(current);
    }, duration / steps);
}

// Update aura glow effect
function updateAuraGlow() {
    if (!userData) return;

    const auraCircle = document.getElementById('auraDisplay');
    if (!auraCircle) return;

    const intensity = Math.min(Math.abs(userData.aura) / 10000, 1); // Max intensity at 10000 points
    const color = userData.aura >= 0 ? '255, 215, 0' : '255, 67, 54'; // Gold for positive, Red for negative
    auraCircle.style.boxShadow = `0 0 ${20 + intensity * 30}px rgba(${color}, ${0.3 + intensity * 0.4})`;
    
    // Update circle class based on aura value
    if (userData.aura < 0) {
        auraCircle.classList.add('negative');
    } else {
        auraCircle.classList.remove('negative');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Local Storage Functions
function saveUserData() {
    if (!userData) return;
    localStorage.setItem('islamicLifestyleApp', JSON.stringify(userData));
}

// Navigation
function navigateToPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(`${pageId}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
        if (pageId === 'stats') {
            updateStats();
        }
    }
} 