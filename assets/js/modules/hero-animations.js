class HeroAnimationController {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.heroContent = this.hero.querySelector('.hero-content');
        this.init();
    }

    init() {
        this.setupParallax();
        this.loadHeroImage();
        this.setupIntersectionObserver();
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            if (window.innerWidth > 768) {
                const scrolled = window.pageYOffset;
                this.heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                this.hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
            }
        });
    }

    loadHeroImage() {
        const imageUrl = '../../images/hero/hero-bg.jpg';
        const img = new Image();

        this.hero.classList.add('loading');

        img.onload = () => {
            this.hero.style.backgroundImage = `url(${imageUrl})`;
            this.hero.classList.remove('loading');
            this.animateHeroElements();
        };

        img.src = imageUrl;
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateHeroElements();
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        observer.observe(this.hero);
    }

    animateHeroElements() {
        const elements = [
            { selector: '.hero-title', delay: 0 },
            { selector: '.hero-tagline', delay: 200 },
            { selector: '.hero-services', delay: 400 },
            { selector: '.hero-cta', delay: 600 }
        ];

        elements.forEach(({ selector, delay }) => {
            const element = this.hero.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.classList.add('animate-fadeInUp');
                    element.style.animationDelay = `${delay}ms`;
                }, delay);
            }
        });
    }
}

// Initialize hero animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimationController();
}); 