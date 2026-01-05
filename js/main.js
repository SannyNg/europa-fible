/**
 * Europa Überlebens-Fibel - Main Application
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌿 Europa Überlebens-Fibel loaded');
    initAnimations();
    initOfflineSupport();
});

// Initialize scroll animations
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.chapter-card, .tip-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideUp 0.5s ease forwards;
        }
        @keyframes slideUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .chapter-card:nth-child(2) { animation-delay: 0.1s; }
        .chapter-card:nth-child(3) { animation-delay: 0.2s; }
        .chapter-card:nth-child(4) { animation-delay: 0.3s; }
    `;
    document.head.appendChild(style);
}

// Service Worker for offline support
function initOfflineSupport() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            console.log('Service Worker not available');
        });
    }
}
