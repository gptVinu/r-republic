document.addEventListener('DOMContentLoaded', function() {
    // Consolidated navigation toggle functionality
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('mainNav');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const body = document.body;
    
    // Define a single closeSidebar function to avoid conflicts
    function closeSidebar() {
        sidebar.classList.remove('active');
        navToggle.classList.remove('active');
        
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
        
        // Make sure to restore body scrolling
        body.style.overflow = '';
        body.classList.remove('menu-open');
        
        // Debug log to check if this function is executed
        console.log('Sidebar closed');
    }
    
    // Open sidebar when toggle button is clicked
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            sidebar.classList.add('active');
            navToggle.classList.add('active');
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            body.classList.add('menu-open');
            
            if (sidebarOverlay) {
                sidebarOverlay.classList.add('active');
            }
        });
    }
    
    // Close sidebar when close button is clicked
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event from bubbling up
            closeSidebar();
        });
    }
    
    // Close sidebar when clicking on overlay (if it exists)
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar when pressing escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
    
    // Close sidebar when clicking on menu items
    const navLinks = document.querySelectorAll('.sidebar .nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });

    // Improved navbar scroll behavior
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show navbar when scrolling up from any position
        if (scrollTop < lastScrollTop) {
            navbar.classList.remove('navbar-hidden');
        } 
        // Hide navbar only when scrolling down and past a certain point
        else if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.classList.add('navbar-hidden');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Enhanced text animation function
    function setupTextAnimation() {
        const words = document.querySelectorAll('.animated-text-changing .word');
        let currentIndex = 0;
        
        function animateText() {
            // Remove visible class from all words
            words.forEach(word => word.classList.remove('visible'));
            
            // Add visible class to current word
            words[currentIndex].classList.add('visible');
            
            // Update index for next animation
            currentIndex = (currentIndex + 1) % words.length;
        }
        
        // Run immediately to ensure first word is visible
        animateText();
        
        // Set interval for animation
        setInterval(animateText, 3000);
        
        // Scroll down button functionality
        const scrollDownBtn = document.querySelector('.scroll-down-container');
        if (scrollDownBtn) {
            scrollDownBtn.addEventListener('click', function() {
                const featuresSection = document.querySelector('.features');
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
    
    setupTextAnimation();

    // Hero Carousel Functionality - Modified to remove auto-slide
    function setupHeroCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        
        // Initialize the carousel with just the first slide visible
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
                const video = slide.querySelector('video');
                if (video) {
                    video.play();
                }
            } else {
                slide.classList.remove('active');
            }
        });
        
        // We keep this function in case you want to add manual navigation later
        function goToSlide(slideIndex) {
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
                
                // Pause any videos in non-active slides
                const video = slide.querySelector('video');
                if (video) {
                    video.pause();
                }
            });
            
            // Show current slide
            slides[slideIndex].classList.add('active');
            
            // Play video if current slide is a video
            const currentVideo = slides[slideIndex].querySelector('video');
            if (currentVideo) {
                currentVideo.play();
            }
            
            currentSlide = slideIndex;
        }
    }
    
    // Initialize carousel
    setupHeroCarousel();
});
