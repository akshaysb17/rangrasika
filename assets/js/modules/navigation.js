class NavigationController {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.navToggle = this.nav.querySelector('.nav-toggle');
        this.navLinks = this.nav.querySelector('.nav-links');
        this.scrollProgress = this.nav.querySelector('.scroll-progress');
        this.sections = document.querySelectorAll('section');
        this.isMenuOpen = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateScrollProgress();
        this.checkScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMenu());

        // Close menu on link click
        this.navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.toggleMenu();
                }
            });
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.checkScroll();
            this.updateScrollProgress();
            this.updateActiveSection();
        });

        // Resize event
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.toggleMenu();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navToggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    checkScroll() {
        const scrolled = window.pageYOffset > 50;
        this.nav.classList.toggle('scrolled', scrolled);
    }

    updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        this.scrollProgress.style.width = `${scrolled}%`;
    }

    updateActiveSection() {
        const fromTop = window.scrollY + 100;

        this.sections.forEach(section => {
            const link = this.nav.querySelector(`a[href="#${section.id}"]`);
            if (!link) return;

            const scrollFromTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
                fromTop >= scrollFromTop &&
                fromTop <= scrollFromTop + sectionHeight
            ) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationController();
}); 