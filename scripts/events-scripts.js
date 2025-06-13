document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: false
    });
    
    // Initialize Hero Animation
    initHeroAnimation();
    
    // Initialize Timeline Controls for Utsav Aarohan
    initTimelineControls();
    
    // Initialize Initiative Tabs for Free School Initiative
    initInitiativeTabs();
    
    // Initialize Celebration Cards
    initCelebrationCards();
    
    // Initialize Testimonial Carousel
    initTestimonialCarousel();
    
    // Initialize Counter Animations
    initCounterAnimations();
    
    // Initialize Smooth Scroll
    initSmoothScroll();
    
    // Initialize Parallax Effects
    initParallaxEffects();
});

// Professional Hero Animation
function initHeroAnimation() {
    const canvas = document.getElementById('heroAnimation');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;
    let animationFrameId;
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initParticles();
    }
    
    // Create particles
    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                // Use a subtle color palette
                color: getParticleColor()
            });
        }
    }
    
    // Get elegant color for particles
    function getParticleColor() {
        const colors = [
            'rgba(100, 181, 246, ', // Light blue
            'rgba(30, 136, 229, ',  // Blue
            'rgba(94, 53, 177, ',   // Deep purple
            'rgba(123, 31, 162, ',  // Purple
            'rgba(49, 27, 146, '    // Indigo
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Draw and update particles
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connecting lines
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const distance = Math.sqrt(
                    Math.pow(p2.x - p1.x, 2) + 
                    Math.pow(p2.y - p1.y, 2)
                );
                
                // Only connect particles within threshold distance
                if (distance < 120) {
                    ctx.strokeStyle = `rgba(100, 181, 246, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        
        // Update and draw particles
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${p.opacity})`;
            ctx.fill();
        });
        
        animationFrameId = requestAnimationFrame(drawParticles);
    }
    
    // Add subtle parallax effect on mouse move
    function addParallax() {
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            particles.forEach(p => {
                // Apply subtle influence based on mouse position
                p.x += (mouseX - 0.5) * 0.3 * p.size;
                p.y += (mouseY - 0.5) * 0.3 * p.size;
            });
        });
    }
    
    // Initialize and start animation
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    addParallax();
    drawParticles();
    
    // Return cleanup function
    return function cleanup() {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationFrameId);
    };
}

// Timeline Controls for Utsav Aarohan
function initTimelineControls() {
    const controls = document.querySelectorAll('.timeline-control');
    const contents = document.querySelectorAll('.year-content');
    const indicator = document.querySelector('.indicator');
    
    if (!controls.length || !contents.length) return;
    
    // Set initial indicator position
    const activeControl = document.querySelector('.timeline-control.active');
    if (activeControl && indicator) {
        updateIndicator(activeControl, indicator);
    }
    
    controls.forEach(control => {
        control.addEventListener('click', function() {
            // Remove active class from all controls and contents
            controls.forEach(c => c.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked control
            this.classList.add('active');
            
            // Update indicator position
            if (indicator) {
                updateIndicator(this, indicator);
            }
            
            // Show corresponding content
            const year = this.getAttribute('data-year');
            const content = document.querySelector(`.year-content[data-year="${year}"]`);
            if (content) {
                content.classList.add('active');
                // Add entrance animation
                content.style.animation = 'fadeInContent 0.8s ease forwards';
            }
        });
    });
    
    function updateIndicator(element, indicator) {
        indicator.style.width = `${element.offsetWidth}px`;
        indicator.style.left = `${element.offsetLeft}px`;
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const activeControl = document.querySelector('.timeline-control.active');
        if (activeControl && indicator) {
            updateIndicator(activeControl, indicator);
        }
    });
}

// Initiative Tabs for Free School Initiative
function initInitiativeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.initiative-content');
    const tabIndicator = document.querySelector('.tab-indicator');
    
    if (!tabButtons.length || !tabContents.length) return;
    
    // Set initial indicator position
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab && tabIndicator) {
        updateTabIndicator(activeTab, tabIndicator);
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update indicator position
            if (tabIndicator) {
                updateTabIndicator(this, tabIndicator);
            }
            
            // Show corresponding content with animation
            const tab = this.getAttribute('data-tab');
            const content = document.querySelector(`.initiative-content[data-tab="${tab}"]`);
            if (content) {
                content.classList.add('active');
                content.style.animation = 'fadeInTab 0.8s ease forwards';
            }
        });
    });
    
    function updateTabIndicator(element, indicator) {
        indicator.style.width = `${element.offsetWidth}px`;
        indicator.style.left = `${element.offsetLeft}px`;
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab && tabIndicator) {
            updateTabIndicator(activeTab, tabIndicator);
        }
    });
}

// Celebration Cards
function initCelebrationCards() {
    const infoButtons = document.querySelectorAll('.info-button');
    const closeButtons = document.querySelectorAll('.close-button');
    
    infoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.celebration-card');
            card.classList.add('flipped');
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.celebration-card');
            card.classList.remove('flipped');
        });
    });
}

// Testimonial Carousel
function initTestimonialCarousel() {
    const swiperContainer = document.querySelector('.testimonial-swiper');
    
    if (swiperContainer) {
        new Swiper('.testimonial-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                }
            }
        });
    }
}

// Counter Animations
function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('[data-value]');
    
    if (!statNumbers.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetValue = parseInt(element.getAttribute('data-value'));
                
                animateCounter(element, targetValue);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.2 });
    
    statNumbers.forEach(number => {
        observer.observe(number);
    });
    
    function animateCounter(element, targetValue) {
        let startValue = 0;
        const duration = 2000;
        const increment = Math.ceil(targetValue / (duration / 16)); // 60fps approx
        
        const counter = setInterval(() => {
            startValue += increment;
            
            if (startValue >= targetValue) {
                element.textContent = targetValue;
                clearInterval(counter);
            } else {
                element.textContent = startValue;
            }
        }, 16);
    }
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Account for fixed navbar
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20; // Extra 20px padding
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without scrolling
            history.pushState(null, null, targetId);
        });
    });
}

// Parallax Effects
function initParallaxEffects() {
    // Background parallax for sections
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const scrollPosition = window.pageYOffset;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Only apply effect when section is in viewport
            if (scrollPosition + window.innerHeight > sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                
                const yScroll = (scrollPosition - sectionTop) * 0.1;
                
                // Apply to background patterns and decoration elements
                section.querySelectorAll('.bg-pattern, .floating-shape, .bg-circle, .celebration-pattern').forEach((element, index) => {
                    const speed = (index + 1) * 0.05;
                    element.style.transform = `translate3d(0, ${yScroll * speed}px, 0)`;
                });
            }
        });
    });
    
    // Mouse move parallax for visual elements
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        // Apply to hero decoration elements
        document.querySelectorAll('.hero-decorations .deco-element').forEach((el, index) => {
            const depth = (index + 1) * 10;
            const moveX = mouseX * depth;
            const moveY = mouseY * depth;
            el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
        
        // Apply to other decorative elements
        document.querySelectorAll('.decoration-element, .deco-shape').forEach((el, index) => {
            const depth = (index + 1) * 5;
            const moveX = mouseX * depth;
            const moveY = mouseY * depth;
            el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });
    
    // Scale effect on scroll for images
    const imageContainers = document.querySelectorAll('.main-image, .media-item, .preview-item');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scale-effect');
            } else {
                entry.target.classList.remove('scale-effect');
            }
        });
    }, { threshold: 0.3 });
    
    imageContainers.forEach(container => {
        imageObserver.observe(container);
    });
}
