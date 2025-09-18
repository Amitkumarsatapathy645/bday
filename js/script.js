// Global Variables
let currentStage = 1;
let currentPhotoIndex = 0;
let timelineActiveIndex = 0;
let isAudioPlaying = false;
let particles = [];
let audioContext = null;
let analyser = null;

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMagicCursor();
    initializeParticles();
    startCountdown();
    setupAudioContext();
    createGalaxyStars();
    setupAudioToggle();
});
// Add to beginning of script.js
function detectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            // Show romantic message based on her location
            if (isNearSpecialPlace(lat, lon)) {
                addLocationSurprise();
            }
        });
    }
}
// Add face detection for extra surprise
async function startCameraEffects() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        // Add heart overlay on her face
        detectFaceAndAddHearts(video);
    } catch(e) {
        console.log('Camera not available');
    }
}

// Hidden message that appears only on birthday
function revealSecretMessage() {
    const now = new Date();
    const birthday = new Date('2025-09-19');
    
    if (now.toDateString() === birthday.toDateString()) {
        const secret = "I've been planning this for weeks because you mean the world to me 💕";
        createSecretMessageReveal(secret);
    }
}

// Setup Audio Toggle
function setupAudioToggle() {
    document.getElementById('audioToggle').addEventListener('click', () => {
        const audio = document.getElementById('backgroundMusic');
        if (isAudioPlaying) {
            audio.pause();
            stopAudioVisualizer();
            document.getElementById('audioToggle').textContent = 'Unmute Audio';
        } else {
            audio.play().catch(e => console.log('Audio play failed:', e));
            startAudioVisualizer();
            document.getElementById('audioToggle').textContent = 'Mute Audio';
        }
        isAudioPlaying = !isAudioPlaying;
    });
}

// Magic Cursor Implementation
function initializeMagicCursor() {
    const cursor = document.getElementById('magicCursor');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Create trailing particles
        if (Math.random() < 0.1) {
            createCursorTrail(cursorX, cursorY);
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: radial-gradient(circle, #ff6b6b, transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        left: ${x}px;
        top: ${y}px;
        animation: trailFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 1000);
}

// Countdown Timer
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    const birthdayDate = new Date(countdownElement.dataset.birthday).getTime();
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = birthdayDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = "🎉 IT'S YOUR BIRTHDAY! 🎉";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Stage Management
function nextStage(stage) {
    document.getElementById(`stage${currentStage}`).classList.remove('active');
    
    setTimeout(() => {
        document.getElementById(`stage${stage}`).classList.add('active');
        currentStage = stage;
        
        // Special actions for each stage
        switch(stage) {
            case 2:
                setTimeout(create3DHeartExplosion, 500);
                break;
            case 3:
                setTimeout(startTypewriter, 1000);
                break;
            case 4:
                setTimeout(initializeHolographicGallery, 500);
                break;
            case 5:
                setTimeout(animateTimeline, 500);
                break;
            case 6:
                setTimeout(startBirthdayFinale, 1000);
                break;
        }
    }, 300);
}

function startJourney() {
    playSound('heartBeat');
    createParticleBurst(window.innerWidth / 2, window.innerHeight / 2);
    nextStage(2);
}

// Stage 2: 3D Heart Explosion
function create3DHeartExplosion() {
    const container = document.getElementById('heart3D');
    const hearts = ['💕', '💖', '💗', '💓', '💞', '💘'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: absolute;
                font-size: 2rem;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                animation: heartExplode${i} 3s ease-out forwards;
                z-index: ${100 - i};
            `;
            
            // Create unique animation for each heart
            const keyframes = `
                @keyframes heartExplode${i} {
                    0% { 
                        transform: translate(-50%, -50%) scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% { 
                        transform: translate(${(Math.random() - 0.5) * 800}px, ${(Math.random() - 0.5) * 600}px) 
                                   scale(1.5) rotate(${Math.random() * 720}deg);
                        opacity: 0;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);
            
            container.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
                style.remove();
            }, 3000);
        }, i * 100);
    }
    
    setTimeout(() => nextStage(3), 4000);
}

// Stage 4: Holographic Photo Gallery
function initializeHolographicGallery() {
    updatePhotoDisplay();
    startHologramEffect();
}

function changePhoto(direction) {
    const photos = document.querySelectorAll('.photo-card');
    const indicators = document.querySelectorAll('.indicator');
    
    photos[currentPhotoIndex].classList.remove('active');
    indicators[currentPhotoIndex].classList.remove('active');
    
    currentPhotoIndex += direction;
    
    if (currentPhotoIndex >= photos.length) {
        currentPhotoIndex = 0;
    } else if (currentPhotoIndex < 0) {
        currentPhotoIndex = photos.length - 1;
    }
    
    photos[currentPhotoIndex].classList.add('active');
    indicators[currentPhotoIndex].classList.add('active');
    
    createPhotoTransitionEffect();
}

function updatePhotoDisplay() {
    const photos = document.querySelectorAll('.photo-card');
    const indicators = document.querySelectorAll('.indicator');
    
    photos.forEach((photo, index) => {
        photo.classList.toggle('active', index === currentPhotoIndex);
    });
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentPhotoIndex);
        indicator.addEventListener('click', () => {
            changePhotoTo(index);
        });
    });
}

function changePhotoTo(index) {
    if (index !== currentPhotoIndex) {
        const direction = index > currentPhotoIndex ? 1 : -1;
        currentPhotoIndex = index - direction;
        changePhoto(direction);
    }
}

function startHologramEffect() {
    const frames = document.querySelectorAll('.photo-frame');
    frames.forEach(frame => {
        const hologram = frame.querySelector('.hologram-effect');
        if (hologram) {
            hologram.style.animation = 'hologramScan 2s ease-in-out infinite';
        }
    });
}

function createPhotoTransitionEffect() {
    const activePhoto = document.querySelector('.photo-card.active');
    const sparkles = document.createElement('div');
    sparkles.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
    `;
    
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            font-size: 1rem;
            animation: sparkleFloat 1s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        sparkles.appendChild(sparkle);
    }
    
    activePhoto.appendChild(sparkles);
    setTimeout(() => sparkles.remove(), 1500);
}

// Stage 5: Interactive Timeline
function animateTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(100px)';
            item.style.transition = 'all 0.8s ease-out';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100);
        }, index * 300);
    });
}

function activateTimelineItem(index) {
    const items = document.querySelectorAll('.timeline-item');
    const dots = document.querySelectorAll('.timeline-dot');
    
    // Remove active state from all items
    items.forEach(item => item.classList.remove('timeline-active'));
    dots.forEach(dot => dot.classList.remove('dot-active'));
    
    // Add active state to clicked item
    items[index].classList.add('timeline-active');
    dots[index].classList.add('dot-active');
    
    // Create ripple effect
    createTimelineRipple(dots[index]);
    
    timelineActiveIndex = index;
}

function createTimelineRipple(dot) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 107, 107, 0.3);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        animation: rippleExpand 1s ease-out forwards;
        pointer-events: none;
    `;
    
    dot.style.position = 'relative';
    dot.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
}

// Stage 6: Ultimate Birthday Finale
function startBirthdayFinale() {
    startAudioVisualizer();
    animatePoem();
    create3DCake();
    setTimeout(() => {
        document.querySelector('.celebration-mega-btn').classList.add('pulse-glow');
    }, 3000);
}

function animatePoem() {
    const lines = document.querySelectorAll('.poem-line');
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            createTextSparkle(line);
        }, index * 1000);
    });
}

function createTextSparkle(element) {
    const rect = element.getBoundingClientRect();
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.cssText = `
        position: fixed;
        left: ${rect.right + 10}px;
        top: ${rect.top + rect.height/2}px;
        font-size: 1.2rem;
        animation: sparkle 2s ease-out forwards;
        pointer-events: none;
        z-index: 1000;
    `;
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 2000);
}

// 3D Cake with Three.js
function create3DCake() {
    const container = document.querySelector('.cake-3d-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create cake layers
    const geometry1 = new THREE.CylinderGeometry(50, 50, 20, 32);
    const material1 = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const layer1 = new THREE.Mesh(geometry1, material1);
    layer1.position.y = -20;
    scene.add(layer1);

    const geometry2 = new THREE.CylinderGeometry(40, 40, 15, 32);
    const material2 = new THREE.MeshPhongMaterial({ color: 0xFF69B4 });
    const layer2 = new THREE.Mesh(geometry2, material2);
    layer2.position.y = 0;
    scene.add(layer2);

    const geometry3 = new THREE.CylinderGeometry(30, 30, 10, 32);
    const material3 = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
    const layer3 = new THREE.Mesh(geometry3, material3);
    layer3.position.y = 15;
    scene.add(layer3);

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(50, 50, 50);
    scene.add(light);

    camera.position.z = 100;

    function animate() {
        requestAnimationFrame(animate);
        layer1.rotation.y += 0.01;
        layer2.rotation.y += 0.01;
        layer3.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}

// Mega Celebration Function
function megaCelebration() {
    playSound('surpriseSound');
    startFireworks();
    createMassiveConfetti();
    blowOutCandles();
    startAudioVisualizer();
    
    // Change button text
    const btn = document.querySelector('.celebration-mega-btn');
    btn.innerHTML = '🎉 HAPPY BIRTHDAY MY LOVE! 🎉';
    btn.onclick = () => createMoreCelebration();
}

function blowOutCandles() {
    const flames = document.querySelectorAll('.flame');
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.style.animation = 'flameBlowOut 0.5s ease-out forwards';
            flame.style.opacity = '0';
        }, index * 200);
    });
}

// Audio Functions
function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

function setupAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audio = document.getElementById('backgroundMusic');
        if (audio && audioContext) {
            const source = audioContext.createMediaElementSource(audio);
            analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
        }
    } catch (e) {
        console.log('Web Audio API not supported:', e);
    }
}

// Utility Functions
function createParticleBurst(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1000;
            animation: particleBurst${i} 1.5s ease-out forwards;
        `;
        
        const angle = (i / 15) * Math.PI * 2;
        const velocity = 100 + Math.random() * 100;
        const keyframes = `
            @keyframes particleBurst${i} {
                0% { 
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% { 
                    transform: translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0);
                    opacity: 0;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
            style.remove();
        }, 1500);
    }
}

function createGalaxyStars() {
    const galaxy = document.getElementById('galaxy-container');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: starTwinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            opacity: ${Math.random() * 0.8 + 0.2};
        `;
        galaxy.appendChild(star);
    }
}

// Massive Fireworks System
function startFireworks() {
    const fireworksContainer = document.getElementById('fireworks-container');
    if (!fireworksContainer) {
        const container = document.createElement('div');
        container.id = 'fireworks-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(container);
    }

    // Create multiple fireworks
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFirework(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight * 0.6 + 100
            );
        }, i * 300);
    }

    // Continue fireworks for 10 seconds
    const fireworkInterval = setInterval(() => {
        createFirework(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight * 0.6 + 100
        );
    }, 800);

    setTimeout(() => clearInterval(fireworkInterval), 10000);
}

function createFirework(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d', '#ff8e8e', '#a8e6cf'];
    const particleCount = 25;
    const container = document.getElementById('fireworks-container') || document.body;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (i / particleCount) * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const size = Math.random() * 8 + 4;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            box-shadow: 0 0 ${size * 2}px ${color};
            animation: fireworkParticle${i} 2s ease-out forwards;
        `;

        const keyframes = `
            @keyframes fireworkParticle${i} {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity + 50}px) scale(0);
                    opacity: 0;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);

        container.appendChild(particle);

        setTimeout(() => {
            particle.remove();
            style.remove();
        }, 2000);
    }

    // Create central burst
    const burst = document.createElement('div');
    burst.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #ffffff, transparent);
        border-radius: 50%;
        left: ${x - 10}px;
        top: ${y - 10}px;
        animation: fireworkBurst 0.5s ease-out forwards;
    `;

    container.appendChild(burst);
    setTimeout(() => burst.remove(), 500);
}

// Massive Confetti System
function createMassiveConfetti() {
    const confettiContainer = document.getElementById('confetti-canvas');
    if (!confettiContainer) {
        const container = document.createElement('div');
        container.id = 'confetti-canvas';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(container);
    }

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d', '#ff8e8e', '#a8e6cf', '#f38ba8', '#fab387'];
    const shapes = ['square', 'circle', 'triangle'];

    // Create 200 confetti pieces
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            createConfettiPiece(colors, shapes);
        }, i * 20);
    }

    // Continue confetti for 8 seconds
    const confettiInterval = setInterval(() => {
        for (let i = 0; i < 10; i++) {
            createConfettiPiece(colors, shapes);
        }
    }, 300);

    setTimeout(() => clearInterval(confettiInterval), 8000);
}

function createConfettiPiece(colors, shapes) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.random() * 15 + 5;
    const startX = Math.random() * window.innerWidth;
    const endX = startX + (Math.random() - 0.5) * 200;
    const rotation = Math.random() * 720;
    const duration = Math.random() * 3 + 2;

    let shapeCSS = '';
    switch (shape) {
        case 'circle':
            shapeCSS = 'border-radius: 50%;';
            break;
        case 'triangle':
            shapeCSS = `
                width: 0;
                height: 0;
                border-left: ${size/2}px solid transparent;
                border-right: ${size/2}px solid transparent;
                border-bottom: ${size}px solid ${color};
                background: none;
            `;
            break;
        default:
            shapeCSS = '';
    }

    confetti.style.cssText = `
        position: absolute;
        width: ${shape === 'triangle' ? 0 : size}px;
        height: ${shape === 'triangle' ? 0 : size}px;
        background: ${shape === 'triangle' ? 'none' : color};
        left: ${startX}px;
        top: -20px;
        ${shapeCSS}
        animation: confettiFall${Math.random().toString(36).substr(2, 9)} ${duration}s linear forwards;
    `;

    const keyframes = `
        @keyframes confettiFall${Math.random().toString(36).substr(2, 9)} {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(${window.innerHeight + 100}px) translateX(${endX - startX}px) rotate(${rotation}deg);
                opacity: 0;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    const container = document.getElementById('confetti-canvas');
    container.appendChild(confetti);

    setTimeout(() => {
        confetti.remove();
        style.remove();
    }, duration * 1000);
}

function createMoreCelebration() {
    startFireworks();
    createMassiveConfetti();
    createNameParticles("HAPPY BIRTHDAY");
    
    // Play celebration sounds
    playSound('surpriseSound');
    
    // Create rainbow effect
    createRainbowEffect();
}

function createRainbowEffect() {
    const rainbow = document.createElement('div');
    rainbow.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(45deg, 
            rgba(255, 0, 0, 0.1),
            rgba(255, 165, 0, 0.1),
            rgba(255, 255, 0, 0.1),
            rgba(0, 255, 0, 0.1),
            rgba(0, 0, 255, 0.1),
            rgba(75, 0, 130, 0.1),
            rgba(238, 130, 238, 0.1)
        );
        pointer-events: none;
        z-index: 9998;
        animation: rainbowPulse 3s ease-in-out;
    `;

    document.body.appendChild(rainbow);
    setTimeout(() => rainbow.remove(), 3000);
}

// Add CSS for dynamic animations
const dynamicStyles = `
    @keyframes trailFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
    
    @keyframes sparkle {
        0% { opacity: 1; transform: scale(1) rotate(0deg); }
        50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
        100% { opacity: 0; transform: scale(0) rotate(360deg); }
    }
    
    @keyframes sparkleFloat {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-50px) scale(0); }
    }
    
    @keyframes rippleExpand {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
        100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
    
    @keyframes flameBlowOut {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.2) translateX(10px); }
        100% { opacity: 0; transform: scale(0); }
    }
    
    @keyframes starTwinkle {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
    }
    
    .timeline-active .timeline-content {
        transform: translateY(-10px) scale(1.05);
        box-shadow: 0 30px 60px rgba(255, 107, 107, 0.4);
        border-color: rgba(255, 107, 107, 0.5);
    }
    
    .dot-active {
        animation: dotPulse 1s ease-in-out infinite;
    }
    
    @keyframes dotPulse {
        0%, 100% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.3); }
    }

    @keyframes fireworkBurst {
        0% { 
            transform: scale(1); 
            opacity: 1; 
        }
        100% { 
            transform: scale(10); 
            opacity: 0; 
        }
    }
    
    @keyframes rainbowPulse {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);