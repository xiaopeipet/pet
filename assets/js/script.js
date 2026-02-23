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

    // TTS (Text-to-Speech) for post pages using Web Speech API (Edge neural voices)
    const ttsBtn = document.getElementById('tts-btn');
    if (ttsBtn && 'speechSynthesis' in window) {
        const ttsStopBtn = document.getElementById('tts-stop-btn');
        const ttsWave    = document.querySelector('.tts-wave');
        const ttsStatus  = document.querySelector('.tts-status');
        const ttsLabel   = ttsBtn.querySelector('.tts-label');
        const ttsIcon    = ttsBtn.querySelector('.tts-icon');
        let   utterance  = null;
        let   isPaused   = false;

        function getArticleText() {
            const body = document.getElementById('post-body-content');
            return body ? body.innerText.trim() : '';
        }

        function setPlayingState() {
            ttsIcon.textContent  = '⏸';
            ttsLabel.textContent = '暂停';
            ttsWave.classList.add('active');
            ttsStopBtn.style.display = '';
            ttsStatus.textContent    = '正在朗读…';
            isPaused = false;
        }

        function setPausedState() {
            ttsIcon.textContent  = '▶';
            ttsLabel.textContent = '继续';
            ttsWave.classList.remove('active');
            ttsStatus.textContent = '已暂停';
            isPaused = true;
        }

        function setIdleState() {
            ttsIcon.textContent  = '🔊';
            ttsLabel.textContent = '朗读';
            ttsWave.classList.remove('active');
            ttsStopBtn.style.display = 'none';
            ttsStatus.textContent    = '';
            isPaused = false;
            utterance = null;
        }

        function pickChineseVoice() {
            const voices = window.speechSynthesis.getVoices();
            // Prefer Microsoft neural Chinese voices (Edge TTS)
            return voices.find(v => v.lang === 'zh-CN' && v.name.includes('Microsoft')) ||
                   voices.find(v => v.lang === 'zh-CN') ||
                   voices.find(v => v.lang.startsWith('zh')) ||
                   null;
        }

        function startReading() {
            window.speechSynthesis.cancel();
            const text = getArticleText();
            if (!text) return;
            utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.lang = 'zh-CN';
            const voice = pickChineseVoice();
            if (voice) utterance.voice = voice;
            utterance.onstart  = setPlayingState;
            utterance.onend    = setIdleState;
            utterance.onerror  = setIdleState;
            utterance.onpause  = setPausedState;
            utterance.onresume = setPlayingState;
            window.speechSynthesis.speak(utterance);
        }

        ttsBtn.addEventListener('click', function() {
            if (!utterance && !isPaused) {
                // Voices may not be loaded yet; wait for them if needed
                const voices = window.speechSynthesis.getVoices();
                if (voices.length === 0 && 'onvoiceschanged' in window.speechSynthesis) {
                    window.speechSynthesis.addEventListener('voiceschanged', startReading, { once: true });
                } else {
                    startReading();
                }
            } else if (isPaused) {
                window.speechSynthesis.resume();
            } else {
                // Directly update UI as onpause may not fire in all browsers
                window.speechSynthesis.pause();
                setPausedState();
            }
        });

        if (ttsStopBtn) {
            ttsStopBtn.addEventListener('click', function() {
                window.speechSynthesis.cancel();
                setIdleState();
            });
        }

        // Stop reading when leaving the page
        window.addEventListener('beforeunload', function() {
            window.speechSynthesis.cancel();
        });
    } else if (ttsBtn) {
        // Browser does not support speech synthesis
        ttsBtn.disabled = true;
        const ttsStatus = document.querySelector('.tts-status');
        if (ttsStatus) ttsStatus.textContent = '当前浏览器不支持语音朗读';
    }

    console.log('Xiaopei Pet Shop website loaded successfully! 🐾');
});

