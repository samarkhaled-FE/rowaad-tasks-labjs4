// Main JavaScript for Lab 4 project
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lab 4 JavaScript Demos - Main page loaded');
    
    // Add smooth scrolling for any internal links
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
    
    // Add click tracking for demo buttons
    document.querySelectorAll('.demo-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const demoName = this.closest('.demo-card').querySelector('h3').textContent;
            console.log(`Navigating to: ${demoName}`);
            
            // Add a small delay for visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add intersection observer for animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe demo cards for scroll animations
    document.querySelectorAll('.demo-card').forEach(card => {
        observer.observe(card);
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 1-4 to navigate to demos
        const keyMap = {
            '1': 'student_form_demo/index.html',
            '2': 'three_div_elements/index.html',
            '3': 'falling_egg/index.html',
            '4': 'todo_list/index.html'
        };
        
        if (keyMap[e.key]) {
            window.location.href = keyMap[e.key];
        }
    });
    
    // Add a subtle parallax effect to the header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            }, 0);
        });
    }
    
    // Add error handling for demo links
    document.querySelectorAll('.demo-btn').forEach(btn => {
        btn.addEventListener('error', function() {
            console.error('Failed to load demo:', this.href);
            alert('Sorry, this demo is currently unavailable.');
        });
    });
    
    console.log('Main page JavaScript initialized successfully');
    console.log('Keyboard shortcuts: Press 1-4 to navigate to demos');
});

