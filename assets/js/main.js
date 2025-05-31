// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if ('PerformanceObserver' in window) {
            this.observeLoadingMetrics();
            this.observePaintMetrics();
        }
    }

    observeLoadingMetrics() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.loadEventEnd - entry.loadEventStart > 3000) {
                    console.warn('Slow page load detected:', {
                        type: 'slow_load',
                        duration: entry.loadEventEnd - entry.loadEventStart,
                        timestamp: new Date().toISOString()
                    });
                }
            });
        });

        observer.observe({ entryTypes: ['navigation'] });
    }

    observePaintMetrics() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                console.log(`${entry.name}: ${entry.startTime}ms`);
            });
        });

        observer.observe({ entryTypes: ['paint'] });
    }
}

// Service Worker Registration
class ServiceWorkerManager {
    constructor() {
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered with scope:', registration.scope);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance monitoring
    new PerformanceMonitor();

    // Initialize service worker
    new ServiceWorkerManager();

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 