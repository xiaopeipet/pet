// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // SPA navigation: only intercept links whose href starts with '#'
    // (non-SPA pages use '/#section' hrefs which must navigate normally)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return; // let real URLs navigate
            e.preventDefault();
            const targetId = href.substring(1);

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
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Handle hero button clicks (SPA page only)
    document.querySelectorAll('.hero-buttons a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetNavLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
            if (targetNavLink) {
                targetNavLink.click();
            }
        });
    });

    // Form submission (SPA page only)
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;

            const formData = new FormData(bookingForm);
            const bookingData = {};
            formData.forEach((value, key) => { bookingData[key] = value; });

            console.log('Booking submitted:', bookingData);

            setTimeout(() => {
                showModal();
                bookingForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }

    // Modal functions (SPA page only)
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.close');

    function showModal() {
        if (modal) modal.style.display = 'block';
    }

    window.closeModal = function() {
        if (modal) modal.style.display = 'none';
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', function(e) {
        if (modal && e.target === modal) {
            closeModal();
        }
    });

    // Form validation (SPA page only)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9()+\s-]/g, '');
        });
    }

    // Set minimum date for booking (SPA page only)
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Smooth scrolling for other anchor links
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

    // Knowledge tab switching
    document.querySelectorAll('.knowledge-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.knowledge-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.knowledge-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const targetTab = this.getAttribute('data-tab');
            const targetEl = document.getElementById(targetTab);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // Post list filtering (archive page)
    document.querySelectorAll('.post-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.post-filter').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            document.querySelectorAll('.post-list-item').forEach(item => {
                if (filter === 'all' || item.getAttribute('data-pet') === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Observe all cards
    document.querySelectorAll('.service-card, .staff-card, .feature-card, .knowledge-card, .latest-post-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    console.log('Xiaopei Pet Shop website loaded successfully! 🐾');
});

