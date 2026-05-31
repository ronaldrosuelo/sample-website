const SERVER_URL = 'http://localhost:5000'; 
const photoInput = document.getElementById('photoInput');
const choosePhotoBtn = document.getElementById('choosePhotoBtn');
const imagePreview = document.getElementById('imagePreview');
const statusMsg = document.getElementById('statusMsg');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const successMessage = document.getElementById('successMessage');
const heartsContainer = document.getElementById('heartsContainer');

// 💡 CONFIG 1: TARGET RELATIONSHIP STARTING DATE (Set to when you met in 2020!)
// Format: YEAR (2020), MONTH (0-11, e.g., June is 5), DAY, HOUR, MINUTE
const START_DATE = new Date(2020, 5, 1, 0, 0, 0); 

// 💡 CONFIG 2: PERSONALIZED COMFORT MESSAGES FOR YOUR BEST FRIEND
const COMFORT_MESSAGES = [
    "Since 2020, you've always had my back, Janeth. Take a deep breath—I have yours right now. Rest your mind. 🤍",
    "If your day was heavy, remember you don't have to carry it alone. Your best friend is always just one chat away. 🌸",
    "You are the strongest, most resilient person I've known for the last 6 years. Don't let a bad day make you forget that. ✨",
    "Close your eyes, play our background track, and take it easy. You're doing amazing, and I'm incredibly proud of you. 😊❤️"
];

// 💡 CONFIG 1: TARGET RELATIONSHIP STARTING DATE
const START_DATE = new Date(2025, 5, 1, 0, 0, 0); 

// 💡 CONFIG 2: JANETH'S CUSTOM COMFORT MESSAGES
const COMFORT_MESSAGES = [
    "Take a deep breath, Janeth. Whatever is stressing you out right now is only temporary. You're doing great. 🤍",
    "Don't push yourself too hard today. It's perfectly okay to take a break and rest. 🌸",
    "Just a quick reminder: You are highly appreciated, smarter than you think, and I am incredibly proud of you. ✨",
    "Close your eyes for a minute. Everything is going to be fine. I'm right here rooting for you always. 😊❤️"
];

let messageIndex = 0;

// Countdown engine
function updateLoveCounter() {
    const now = new Date();
    const difference = now - START_DATE;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    document.getElementById('loveCounter').innerHTML = `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
}
setInterval(updateLoveCounter, 1000);

// Envelope Logic
document.getElementById('envelope').addEventListener('click', function() {
    this.classList.toggle('open');
});

// Inside Joke Quiz Control
function checkQuiz(currentStep, isCorrect) {
    if(isCorrect) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        const nextStep = currentStep === 1 ? 'step2' : 'quizReward';
        document.getElementById(nextStep).classList.add('active');
    } else {
        alert("Hmm, wrong answer! Try recalling that specific memory again! 😜");
    }
}

// Comfort Safe Space Mode
const comfortBtn = document.getElementById('comfortBtn');
comfortBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const rainOverlay = document.getElementById('rainOverlay');
    const comfortMsg = document.getElementById('comfortMsg');

    if(document.body.classList.contains('dark-mode')) {
        rainOverlay.style.opacity = "1";
        comfortBtn.innerText = "Exit Safe Space";
        comfortBtn.classList.add('active');
        // Cycle Comfort Lines
        comfortMsg.innerText = COMFORT_MESSAGES[messageIndex];
        messageIndex = (messageIndex + 1) % COMFORT_MESSAGES.length;
    } else {
        rainOverlay.style.opacity = "0";
        comfortBtn.innerText = "Activate Safe Space";
        comfortBtn.classList.remove('active');
        comfortMsg.innerText = "";
    }
});

// Flowers engine
function addFlower(emoji) {
    const vase = document.getElementById('vase');
    if(vase.children.length >= 14) return;
    const flowerSpan = document.createElement('span');
    flowerSpan.className = 'flower-item';
    flowerSpan.innerText = emoji;
    vase.appendChild(flowerSpan);
}

// Database image loader hook
choosePhotoBtn.addEventListener('click', () => photoInput.click());

window.addEventListener('DOMContentLoaded', async () => {
    updateLoveCounter();
    try {
        const response = await fetch(`${SERVER_URL}/api/photo`);
        const data = await response.json();
        if (data.url) {
            imagePreview.src = data.url;
            imagePreview.style.display = 'inline-block';
        }
    } catch (err) { console.error(err); }
});

photoInput.addEventListener('change', function() {
    const file = this.files;
    if (!file) return;
    statusMsg.innerText = "Saving our memory to the PostgreSQL database... ⏳";
    const reader = new FileReader();
    reader.onloadend = async function() {
        const base64String = reader.result;
        try {
            const response = await fetch(`${SERVER_URL}/api/photo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64String })
                    });
            const result = await response.json();
            imagePreview.src = base64String;
            imagePreview.style.display = 'inline-block';
            statusMsg.innerText = result.message || result.error;
        } catch (err) { statusMsg.innerText = "Error reaching server."; }
    }
    reader.readAsDataURL(file);
});

// Proposal Runaway UI
noBtn.addEventListener('mouseover', flyAway);
noBtn.addEventListener('click', flyAway);
yesBtn.addEventListener('click', celebrate);

function flyAway() {
    noBtn.style.transform = `translate(${Math.random() * 150 - 75}px, ${Math.random() * 150 - 75}px)`;
}
function celebrate() {
    successMessage.style.display = 'block';
    noBtn.style.display = 'none';
    for (let i = 0; i < 25; i++) { createHeart(); }
}
function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️'; heart.style.position = 'absolute';
    heart.style.left = Math.random() * 100 + 'vw'; heart.style.top = '100vh';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.transition = 'transform 4s linear, top 4s linear, opacity 4s linear';
    heartsContainer.appendChild(heart);
    setTimeout(() => { heart.style.top = '-10vh'; heart.style.transform = `scale(1.5) rotate(${Math.random() * 360}deg)`; heart.style.opacity = '0'; }, 100);
    setTimeout(() => { heart.remove(); }, 4100);
}
setInterval(createHeart, 800);