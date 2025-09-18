// Advanced Typewriter Effect
class TypewriterEffect {
    constructor() {
        this.speed = 50;
        this.deleteSpeed = 30;
        this.pauseTime = 1000;
        this.currentText = '';
        this.isDeleting = false;
        this.textIndex = 0;
        this.charIndex = 0;
    }

    type(element, texts, callback = null) {
        if (typeof texts === 'string') {
            texts = [texts];
        }

        const typeChar = () => {
            const currentFullText = texts[this.textIndex];
            
            if (this.isDeleting) {
                this.currentText = currentFullText.substring(0, this.charIndex - 1);
                this.charIndex--;
            } else {
                this.currentText = currentFullText.substring(0, this.charIndex + 1);
                this.charIndex++;
            }

            element.innerHTML = this.currentText + '<span class="typewriter-cursor">|</span>';

            let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

            if (!this.isDeleting && this.charIndex === currentFullText.length) {
                typeSpeed = this.pauseTime;
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.textIndex++;
                typeSpeed = 500;

                if (this.textIndex >= texts.length) {
                    if (callback) callback();
                    return;
                }
            }

            setTimeout(typeChar, typeSpeed);
        };

        typeChar();
    }

    typeOnce(element, text, callback = null, customSpeed = null) {
        const speed = customSpeed || this.speed;
        let i = 0;

        const typeChar = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            } else {
                if (callback) callback();
            }
        };

        element.innerHTML = '';
        typeChar();
    }

    typeLetter(element, text, callback = null) {
        element.innerHTML = '';
        let i = 0;

        const typeLetter = () => {
            if (i < text.length) {
                const span = document.createElement('span');
                span.textContent = text.charAt(i);
                span.style.opacity = '0';
                span.style.animation = `letterAppear 0.1s ease-out ${i * 0.05}s forwards`;
                element.appendChild(span);
                i++;
                setTimeout(typeLetter, 50);
            } else {
                if (callback) callback();
            }
        };

        typeLetter();
    }
}

// Love Letter Content
const loveLetterContent = [
    "My Dearest Beautiful,\n\n",
    "As I sit here thinking about you, my heart fills with so much joy and love that I can barely contain it. ",
    "You are the most incredible person I have ever met, and every day with you feels like a beautiful dream.\n\n",
    "Your smile lights up my entire world, and your laugh is like music to my soul. ",
    "The way you care for others, your kindness, your intelligence, and your beautiful heart make me fall in love with you more each day.\n\n",
    "You make me want to be the best version of myself. ",
    "With you, I've discovered what true love really means. ",
    "You are my best friend, my partner, my everything.\n\n",
    "On this special day, I want you to know that you deserve all the happiness in the world. ",
    "You are amazing, you are loved, and you are cherished more than words can express.\n\n",
    "Happy Birthday, my love! Here's to another year of adventures, laughter, and endless love together.\n\n",
    "With all my heart,\nYour Forever Person 💕"
];

function startTypewriter() {
    const typewriter = new TypewriterEffect();
    const contentElement = document.getElementById('loveLetterContent');
    const signatureElement = document.getElementById('signature');
    const buttonElement = document.getElementById('letterBtn');
    
    let currentIndex = 0;

    const typeNextSection = () => {
        if (currentIndex < loveLetterContent.length) {
            const currentParagraph = document.createElement('p');
            currentParagraph.style.marginBottom = '20px';
            currentParagraph.style.lineHeight = '1.8';
            contentElement.appendChild(currentParagraph);

            typewriter.typeOnce(currentParagraph, loveLetterContent[currentIndex], () => {
                currentIndex++;
                setTimeout(typeNextSection, 500);
            }, 30);
        } else {
            // Show signature after all content is typed
            setTimeout(() => {
                signatureElement.style.display = 'block';
                signatureElement.style.animation = 'fadeInUp 1s ease-out';
                
                setTimeout(() => {
                    buttonElement.classList.remove('hidden');
                    buttonElement.style.animation = 'fadeInUp 1s ease-out';
                }, 1000);
            }, 1000);
        }
    };

    typeNextSection();
}

// Initialize typewriter
let typewriterEffect;
document.addEventListener('DOMContentLoaded', () => {
    typewriterEffect = new TypewriterEffect();
});

// Typewriter CSS
const typewriterStyles = `
    .typewriter-cursor {
        color: #ff6b6b;
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    @keyframes letterAppear {
        0% { 
            opacity: 0; 
            transform: translateY(20px) rotateX(-90deg);
        }
        100% { 
            opacity: 1; 
            transform: translateY(0) rotateX(0deg);
        }
    }
    
    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const typewriterStyleSheet = document.createElement('style');
typewriterStyleSheet.textContent = typewriterStyles;
document.head.appendChild(typewriterStyleSheet);

// Global functions
window.startTypewriter = startTypewriter;
window.TypewriterEffect = TypewriterEffect;