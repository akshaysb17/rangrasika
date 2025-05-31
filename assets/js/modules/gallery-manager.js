class GalleryManager {
    constructor() {
        this.gallery = document.querySelector('.gallery');
        this.tabs = this.gallery.querySelectorAll('.gallery-tab');
        this.items = this.gallery.querySelectorAll('.gallery-item');
        this.activeCategory = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupIntersectionObserver();
        this.loadImages();
    }

    bindEvents() {
        // Tab click events
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                this.filterGallery(category);
                this.updateActiveTab(tab);
            });
        });

        // Image click events for lightbox
        this.items.forEach(item => {
            item.addEventListener('click', () => this.openLightbox(item));
        });
    }

    filterGallery(category) {
        this.activeCategory = category;

        this.items.forEach(item => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || category === itemCategory;

            if (shouldShow) {
                item.classList.remove('hidden');
                setTimeout(() => item.classList.add('visible'), 10);
            } else {
                item.classList.remove('visible');
                item.classList.add('hidden');
            }
        });
    }

    updateActiveTab(clickedTab) {
        this.tabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
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
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.items.forEach(item => observer.observe(item));
    }

    loadImages() {
        this.items.forEach(item => {
            const img = item.querySelector('img');
            const actualSrc = img.src;
            
            // Set loading state
            item.classList.add('loading');
            img.src = '';

            // Create new image to preload
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = actualSrc;
                item.classList.remove('loading');
            };
            tempImg.src = actualSrc;
        });
    }

    openLightbox(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;

        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${img.src}" alt="${img.alt}">
                <div class="lightbox-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            </div>
        `;

        // Add lightbox to page
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Add close functionality
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        });

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
            }
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
            }
        });
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
}); 