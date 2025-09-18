// Advanced Particle System
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d', '#ff8e8e'];
        this.init();
    }

    init() {
        // Initialize particles.js
        if (window.particlesJS) {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 800 } },
                    color: { value: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'] },
                    shape: {
                        type: ['circle', 'triangle'],
                        stroke: { width: 0, color: '#000000' },
                        polygon: { nb_sides: 5 }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#ffffff',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: { enable: false, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 400, line_linked: { opacity: 1 } },
                        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                        repulse: { distance: 200, duration: 0.4 },
                        push: { particles_nb: 4 },
                        remove: { particles_nb: 2 }
                    }
                },
                retina_detect: true
            });
        }

        this.setupMouseTracking();
        this.createHeartParticles();
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Create trail particles on mouse move
            if (Math.random() < 0.3) {
                this.createTrailParticle(this.mouse.x, this.mouse.y);
            }
        });
    }

    createTrailParticle(x, y) {
        const particle = document.createElement('div');
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9998;
            box-shadow: 0 0 10px ${color};
            animation: trailParticle 2s ease-out forwards;
        `;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
    }

    createHeartParticles() {
        setInterval(() => {
            this.createFloatingHeart();
        }, 3000);
    }

    createFloatingHeart() {
        const hearts = ['💕', '💖', '💗', '💓', '💞', '💘', '❤️', '💙', '💜', '💚'];
        const heart = document.createElement('div');
        const heartIcon = hearts[Math.floor(Math.random() * hearts.length)];
        
        heart.innerHTML = heartIcon;
        heart.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 2 + 1}rem;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight + 50}px;
            pointer-events: none;
            z-index: 1;
            opacity: ${Math.random() * 0.7 + 0.3};
            animation: floatHeart ${Math.random() * 5 + 10}s linear forwards;
        `;

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 15000);
    }

    createLoveExplosion(x, y) {
        const words = ['LOVE', 'BEAUTIFUL', 'AMAZING', 'PERFECT', 'ANGEL', 'SWEET', 'GORGEOUS'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const word = document.createElement('div');
                word.innerHTML = words[Math.floor(Math.random() * words.length)];
                word.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    color: ${this.colors[Math.floor(Math.random() * this.colors.length)]};
                    font-weight: bold;
                    font-size: 1.2rem;
                    pointer-events: none;
                    z-index: 1000;
                    text-shadow: 0 0 10px currentColor;
                    animation: loveWordExplode${i} 3s ease-out forwards;
                `;

                const angle = (i / 8) * Math.PI * 2;
                const distance = 150;
                const keyframes = `
                    @keyframes loveWordExplode${i} {
                        0% { 
                            transform: translate(-50%, -50%) scale(0) rotate(0deg);
                            opacity: 1;
                        }
                        50% { 
                            opacity: 1;
                        }
                        100% { 
                            transform: translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) 
                                       scale(1.5) rotate(360deg);
                            opacity: 0;
                        }
                    }
                `;

                const style = document.createElement('style');
                style.textContent = keyframes;
                document.head.appendChild(style);
                
                document.body.appendChild(word);
                
                setTimeout(() => {
                    word.remove();
                    style.remove();
                }, 3000);
            }, i * 100);
        }
    }

    createNameParticles(name = "BEAUTIFUL") {
        const letters = name.split('');
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        letters.forEach((letter, index) => {
            setTimeout(() => {
                const letterEl = document.createElement('div');
                letterEl.innerHTML = letter;
                letterEl.style.cssText = `
                    position: fixed;
                    left: ${centerX + (index - letters.length/2) * 50}px;
                    top: ${centerY}px;
                    color: #ff6b6b;
                    font-size: 4rem;
                    font-weight: bold;
                    pointer-events: none;
                    z-index: 1000;
                    text-shadow: 0 0 20px #ff6b6b;
                    animation: letterDance 4s ease-in-out forwards;
                `;

                document.body.appendChild(letterEl);
                setTimeout(() => letterEl.remove(), 4000);
            }, index * 200);
        });
    }
}

// Initialize particle system
let particleSystem;
document.addEventListener('DOMContentLoaded', () => {
    particleSystem = new ParticleSystem();
});

// Particle-related CSS animations
const particleStyles = `
    @keyframes trailParticle {
        0% { 
            opacity: 1; 
            transform: scale(1) translate(0, 0);
        }
        100% { 
            opacity: 0; 
            transform: scale(0) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
        }
    }
    
    @keyframes floatHeart {
        0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
        }
        50% {
            opacity: 1;
        }
        100% { 
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes letterDance {
        0% { 
            transform: translate(-50%, -50%) scale(0) rotateY(0deg);
            opacity: 0;
        }
        25% { 
            transform: translate(-50%, -50%) scale(1.2) rotateY(90deg);
            opacity: 1;
        }
        50% { 
            transform: translate(-50%, -50%) scale(1) rotateY(180deg);
            opacity: 1;
        }
        75% { 
            transform: translate(-50%, -50%) scale(1.1) rotateY(270deg);
            opacity: 1;
        }
        100% { 
            transform: translate(-50%, -50%) scale(1) rotateY(360deg);
            opacity: 0;
        }
    }
`;

const particleStyleSheet = document.createElement('style');
particleStyleSheet.textContent = particleStyles;
document.head.appendChild(particleStyleSheet);

// Export functions for global use
window.createLoveExplosion = (x, y) => {
    if (particleSystem) {
        particleSystem.createLoveExplosion(x, y);
    }
};

window.createNameParticles = (name) => {
    if (particleSystem) {
        particleSystem.createNameParticles(name);
    }
};