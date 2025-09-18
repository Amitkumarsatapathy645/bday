// Advanced Audio Visualizer
class AudioVisualizer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = 0;
        this.isPlaying = false;
        this.animationId = null;
        this.init();
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupAnalyser();
        } catch (error) {
            console.log('Web Audio API not supported:', error);
        }
    }

    setupAnalyser() {
        if (!this.audioContext) return;

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        // Try to connect to background music
        const audio = document.getElementById('backgroundMusic');
        if (audio) {
            try {
                const source = this.audioContext.createMediaElementSource(audio);
                source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
            } catch (error) {
                console.log('Error connecting audio source:', error);
            }
        }
    }

    startVisualizer() {
        if (!this.analyser) {
            this.createFakeVisualizer();
            return;
        }

        this.isPlaying = true;
        this.animate();
    }

    stopVisualizer() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    animate() {
        if (!this.isPlaying) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.analyser && this.dataArray) {
            this.analyser.getByteFrequencyData(this.dataArray);
            this.updateVisualizerBars();
            this.createAudioParticles();
        }
    }

    updateVisualizerBars() {
        const bars = document.querySelectorAll('.visualizer-bar');
        if (!bars.length) return;

        bars.forEach((bar, index) => {
            const dataIndex = Math.floor((index / bars.length) * this.bufferLength);
            const value = this.dataArray[dataIndex] || 0;
            const height = Math.max(20, (value / 255) * 80);
            
            bar.style.height = height + 'px';
            bar.style.background = `linear-gradient(to top, 
                hsl(${(value / 255) * 60}, 100%, 50%), 
                hsl(${(value / 255) * 60 + 60}, 100%, 70%))`;
            bar.style.boxShadow = `0 0 ${height / 4}px hsl(${(value / 255) * 60}, 100%, 50%)`;
        });
    }

    createFakeVisualizer() {
        // Fallback visualizer with fake audio data
        this.isPlaying = true;
        
        const fakeBeat = () => {
            if (!this.isPlaying) return;

            const bars = document.querySelectorAll('.visualizer-bar');
            bars.forEach((bar, index) => {
                const height = Math.random() * 60 + 20;
                const hue = Math.random() * 360;
                
                bar.style.height = height + 'px';
                bar.style.background = `linear-gradient(to top, hsl(${hue}, 100%, 50%), hsl(${hue + 60}, 100%, 70%))`;
                bar.style.boxShadow = `0 0 ${height / 4}px hsl(${hue}, 100%, 50%)`;
            });

            // Create beat particles
            if (Math.random() < 0.3) {
                this.createBeatParticle();
            }

            setTimeout(fakeBeat, 100 + Math.random() * 200);
        };

        fakeBeat();
    }

    createAudioParticles() {
        const avgFrequency = this.dataArray.reduce((a, b) => a + b) / this.bufferLength;
        
        if (avgFrequency > 50 && Math.random() < 0.1) {
            this.createBeatParticle();
        }
    }

    createBeatParticle() {
        const particle = document.createElement('div');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            width: 12px;
            height: 12px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight}px;
            pointer-events: none;
            z-index: 999;
            box-shadow: 0 0 20px ${color};
            animation: beatParticleRise 3s ease-out forwards;
        `;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 3000);
    }

    createVisualWave(centerX, centerY) {
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 3px solid #4ecdc4;
            border-radius: 50%;
            left: ${centerX - 10}px;
            top: ${centerY - 10}px;
            pointer-events: none;
            z-index: 1000;
            animation: visualWaveExpand 2s ease-out forwards;
        `;

        document.body.appendChild(wave);
        setTimeout(() => wave.remove(), 2000);
    }
}

// Initialize audio visualizer
let audioVisualizer;
document.addEventListener('DOMContentLoaded', () => {
    audioVisualizer = new AudioVisualizer();
});

// Audio visualizer CSS
const audioVisualizerStyles = `
    @keyframes beatParticleRise {
        0% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
        }
        100% { 
            opacity: 0; 
            transform: translateY(-200px) scale(0);
        }
    }
    
    @keyframes visualWaveExpand {
        0% { 
            opacity: 1; 
            transform: scale(1);
        }
        100% { 
            opacity: 0; 
            transform: scale(10);
        }
    }
`;

const audioStyleSheet = document.createElement('style');
audioStyleSheet.textContent = audioVisualizerStyles;
document.head.appendChild(audioStyleSheet);

// Global function to start audio visualizer
window.startAudioVisualizer = () => {
    if (audioVisualizer) {
        audioVisualizer.startVisualizer();
    }
};

window.stopAudioVisualizer = () => {
    if (audioVisualizer) {
        audioVisualizer.stopVisualizer();
    }
};

// Helper to resume the audio context after a user gesture
window.resumeAudioContext = () => {
    try {
        if (audioVisualizer && audioVisualizer.audioContext && audioVisualizer.audioContext.state === 'suspended') {
            return audioVisualizer.audioContext.resume();
        }
    } catch (e) {}
    return Promise.resolve();
};

window.createVisualWave = (x, y) => {
    if (audioVisualizer) {
        audioVisualizer.createVisualWave(x, y);
    }
};