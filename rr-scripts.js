// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });
    
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 300);
    });
    
    // Mobile Navigation
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });
    
    // Navbar Scrolling Effect for transparent navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        const backToTop = document.querySelector('.back-to-top');
        
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.getAttribute('href') === '#') return;
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
                alert('Please fill in all required fields');
                return;
            }
            
            // Here you would typically send the form data to a server
            // For this example, we'll just show a success message
            this.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Thank you!</h3><p>Your message has been sent successfully.</p></div>';
        });
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (email.trim() === '') {
                alert('Please enter your email address');
                return;
            }
            
            // Here you would typically send the email to a server
            const formGroup = this.querySelector('.form-group') || this;
            formGroup.innerHTML = '<p>Thank you for subscribing!</p>';
        });
    }
    
    // Counter Animation for Stats (when they come into view)
    const statItems = document.querySelectorAll('.stat-info h4');
    
    if (statItems.length > 0) {
        const options = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const value = target.textContent;
                    let startValue = 0;
                    const duration = 2000;
                    
                    // Extract numeric part and any suffix
                    const numericPart = value.replace(/[^\d]/g, '');
                    const suffix = value.replace(/[\d]/g, '');
                    const endValue = parseInt(numericPart);
                    
                    const counter = setInterval(() => {
                        startValue += Math.ceil(endValue / 100);
                        
                        if (startValue > endValue) {
                            target.textContent = `${endValue}${suffix}`;
                            clearInterval(counter);
                        } else {
                            target.textContent = `${startValue}${suffix}`;
                        }
                    }, duration / 100);
                    
                    observer.unobserve(target);
                }
            });
        }, options);
        
        statItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    // Parallax effect for hero banner
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.hero-banner');
        if (heroSection) {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
    });
    
    // Enhanced Back to Top functionality
    const backToTopButton = document.getElementById('backToTop') || document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // For modern browsers
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // Fallback for browsers that don't support scrollBehavior
                const scrollToTop = function() {
                    const currentPosition = window.scrollY;
                    if (currentPosition > 0) {
                        window.requestAnimationFrame(scrollToTop);
                        window.scrollTo(0, currentPosition - currentPosition / 8);
                    }
                };
                scrollToTop();
            }
        });
    }
    
    // Mobile Dropdown Menu Toggle
    document.addEventListener('DOMContentLoaded', function() {
        // Handle dropdown toggles for mobile view
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                // Only prevent default and toggle dropdown in mobile view
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    parent.classList.toggle('active');
                }
            });
        });
    });
});
