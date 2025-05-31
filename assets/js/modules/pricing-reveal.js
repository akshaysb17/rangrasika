class PricingManager {
    constructor() {
        this.pricingSection = document.querySelector('.pricing');
        this.pricingCards = this.pricingSection.querySelectorAll('.pricing-card');
        this.bookingModal = document.getElementById('bookingModal');
        this.bookingForm = document.getElementById('bookingForm');
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.bindEvents();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealPricingCards();
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        observer.observe(this.pricingSection);
    }

    revealPricingCards() {
        this.pricingCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('revealed');
            }, index * 200);
        });
    }

    bindEvents() {
        // Book Now buttons
        this.pricingCards.forEach(card => {
            const bookButton = card.querySelector('.pricing-cta');
            bookButton.addEventListener('click', () => {
                this.openBookingModal(bookButton.dataset.package);
            });
        });

        // Modal close button
        const closeButton = this.bookingModal.querySelector('.modal-close');
        closeButton.addEventListener('click', () => this.closeBookingModal());

        // Close modal on background click
        this.bookingModal.addEventListener('click', (e) => {
            if (e.target === this.bookingModal) {
                this.closeBookingModal();
            }
        });

        // Form submission
        this.bookingForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.bookingModal.classList.contains('active')) {
                this.closeBookingModal();
            }
        });
    }

    openBookingModal(packageType) {
        // Set the package type in the form
        const packageInput = this.bookingForm.querySelector('#package');
        packageInput.value = this.formatPackageName(packageType);

        // Set minimum date to today
        const dateInput = this.bookingForm.querySelector('#date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        // Show modal
        this.bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus first input
        this.bookingForm.querySelector('#name').focus();
    }

    closeBookingModal() {
        this.bookingModal.classList.remove('active');
        document.body.style.overflow = '';
        this.bookingForm.reset();
    }

    formatPackageName(packageType) {
        const names = {
            'basic': 'Basic Beauty',
            'premium': 'Premium Bridal',
            'luxury': 'Luxury Complete'
        };
        return names[packageType] || packageType;
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.bookingForm);
        const bookingData = Object.fromEntries(formData.entries());

        try {
            // Show loading state
            const submitBtn = this.bookingForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            // Prepare WhatsApp message
            const message = this.formatWhatsAppMessage(bookingData);
            const whatsappUrl = `https://wa.me/+919876543210?text=${encodeURIComponent(message)}`;

            // Reset form and close modal
            this.closeBookingModal();

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

        } catch (error) {
            console.error('Booking error:', error);
            alert('There was an error processing your booking. Please try again.');
        } finally {
            // Reset button state
            const submitBtn = this.bookingForm.querySelector('.submit-btn');
            submitBtn.textContent = 'Confirm Booking';
            submitBtn.disabled = false;
        }
    }

    formatWhatsAppMessage(data) {
        return `
*New Booking Request*
------------------
Package: ${data.package}
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Date: ${data.date}
${data.message ? `\nSpecial Requirements:\n${data.message}` : ''}
------------------
Please confirm my booking request.
        `.trim();
    }
}

// Initialize pricing manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PricingManager();
}); 