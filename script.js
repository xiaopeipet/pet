// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const bookingForm = document.getElementById('bookingForm');
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.close');

    // Set minimum date for booking (today)
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Navigation between sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            // Close mobile menu
            navMenu.classList.remove('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Handle hero button clicks
    document.querySelectorAll('.hero-buttons a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Trigger the corresponding nav link
            const targetNavLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
            if (targetNavLink) {
                targetNavLink.click();
            }
        });
    });

    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(bookingForm);
        const bookingData = {};
        formData.forEach((value, key) => {
            bookingData[key] = value;
        });
        
        // Log booking data (in production, this would be sent to a server)
        console.log('Booking submitted:', bookingData);
        
        // Simulate async submission
        setTimeout(() => {
            // Show success modal
            showModal();
            
            // Reset form and button
            bookingForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    });

    // Modal functions
    function showModal() {
        modal.style.display = 'block';
    }

    window.closeModal = function() {
        modal.style.display = 'none';
    };

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form validation enhancements
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        // Allow only numbers and common phone characters
        this.value = this.value.replace(/[^0-9()+\s-]/g, '');
    });

    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.classList.contains('nav-link')) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetNavLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
                if (targetNavLink) {
                    targetNavLink.click();
                }
            });
        }
    });

    // Add animation on scroll (for cards)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.service-card, .staff-card, .feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    console.log('Xiaopei Pet Shop website loaded successfully! 🐾');
});
