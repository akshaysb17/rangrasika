class ContactManager {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.mapElement = document.getElementById('map');
        this.init();
    }

    init() {
        this.bindEvents();
        this.initMap();
    }

    bindEvents() {
        this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Prepare email content
            const emailContent = this.formatEmailContent(data);

            // For demonstration, we'll use mailto link
            // In production, you would send this to your server
            const mailtoLink = `mailto:info@rangrasika.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(emailContent)}`;
            window.location.href = mailtoLink;

            // Show success message
            this.showMessage('success', 'Thank you for your message! We will get back to you soon.');
            form.reset();

        } catch (error) {
            console.error('Contact form error:', error);
            this.showMessage('error', 'There was an error sending your message. Please try again.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    formatEmailContent(data) {
        return `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
        `.trim();
    }

    showMessage(type, text) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = text;

        // Insert before form
        this.contactForm.insertBefore(messageDiv, this.contactForm.firstChild);

        // Show message
        setTimeout(() => messageDiv.classList.add('show'), 10);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    initMap() {
        // Replace these coordinates with your actual business location
        const businessLocation = { lat: 18.9220, lng: 72.8347 }; // Mumbai coordinates

        const mapOptions = {
            center: businessLocation,
            zoom: 15,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry",
                    "stylers": [{"color": "#f5f5f5"}]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#616161"}]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [{"color": "#f5f5f5"}]
                },
                {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#bdbdbd"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{"color": "#eeeeee"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#757575"}]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [{"color": "#e5e5e5"}]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#9e9e9e"}]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{"color": "#ffffff"}]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#757575"}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{"color": "#dadada"}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#616161"}]
                },
                {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#9e9e9e"}]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [{"color": "#e5e5e5"}]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [{"color": "#eeeeee"}]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"color": "#c9c9c9"}]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#9e9e9e"}]
                }
            ]
        };

        const map = new google.maps.Map(this.mapElement, mapOptions);

        // Add marker
        const marker = new google.maps.Marker({
            position: businessLocation,
            map: map,
            title: 'RangRasika',
            animation: google.maps.Animation.DROP
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 5px;">RangRasika</h3>
                    <p style="margin: 0;">123 Beauty Lane, Fashion Street<br>Mumbai, Maharashtra 400001</p>
                </div>
            `
        });

        // Show info window on marker click
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }
}

// Initialize map callback for Google Maps API
function initMap() {
    new ContactManager();
} 