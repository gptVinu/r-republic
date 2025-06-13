// Contact Page Scripts

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Initialize scroll functions
    initScrollFunctions();
    
    // Initialize form validation
    initContactForm();
    
    // Initialize hero animation
    initHeroAnimation();
});

// Handle preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Initialize scroll functions
function initScrollFunctions() {
    // Handle back-to-top button visibility
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when button is clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Handle navbar transparency on scroll
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.remove('transparent');
            } else {
                navbar.classList.add('transparent');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Initialize contact form validation and submission
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                highlightInvalidField(nameInput);
                isValid = false;
            } else {
                removeInvalidHighlight(nameInput);
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                highlightInvalidField(emailInput);
                isValid = false;
            } else {
                removeInvalidHighlight(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                highlightInvalidField(messageInput);
                isValid = false;
            } else {
                removeInvalidHighlight(messageInput);
            }
            
            if (isValid) {
                // For demonstration purposes, we'll just show a success message
                // In a real implementation, you would send the data to a server
                
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Simulate API call delay
                setTimeout(function() {
                    // Reset the form
                    contactForm.reset();
                    
                    // Show success message
                    showNotification('Your message has been sent successfully!', 'success');
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 1500);
            }
        });
    }
    
    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Highlight invalid fields
    function highlightInvalidField(element) {
        element.style.borderColor = '#ff4136';
        element.style.backgroundColor = 'rgba(255, 65, 54, 0.05)';
        
        if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('error-message')) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = `Please enter a valid ${element.id}`;
            errorMessage.style.color = '#ff4136';
            errorMessage.style.fontSize = '12px';
            errorMessage.style.marginTop = '5px';
            element.parentNode.insertBefore(errorMessage, element.nextSibling);
        }
    }
    
    // Remove invalid highlighting
    function removeInvalidHighlight(element) {
        element.style.borderColor = '';
        element.style.backgroundColor = '';
        
        if (element.nextElementSibling && element.nextElementSibling.classList.contains('error-message')) {
            element.nextElementSibling.remove();
        }
    }
    
    // Show notification
    function showNotification(message, type) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.padding = '15px 25px';
            notification.style.borderRadius = '5px';
            notification.style.color = '#fff';
            notification.style.fontWeight = '500';
            notification.style.zIndex = '1000';
            notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            notification.style.transition = 'all 0.4s ease';
            
            document.body.appendChild(notification);
        }
        
        // Set notification content and style based on type
        notification.textContent = message;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
        } else {
            notification.style.backgroundColor = '#007bff';
        }
        
        // Show notification
        setTimeout(function() {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
            
            // Hide notification after a delay
            setTimeout(function() {
                notification.style.transform = 'translateY(100px)';
                notification.style.opacity = '0';
                
                setTimeout(function() {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 400);
            }, 3000);
        }, 100);
    }
}

// Initialize hero animation using three.js
function initHeroAnimation() {
    const canvas = document.getElementById('heroAnimation');
    
    if (!canvas) return;
    
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particles
    const particlesCount = 500;
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);
    
    // Fill positions and scales arrays
    for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        
        scales[i] = Math.random() * 2 + 0.5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    
    // Material
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    // Create point cloud
    const pointCloud = new THREE.Points(particles, material);
    scene.add(pointCloud);
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        pointCloud.rotation.x += 0.0005;
        pointCloud.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    });
}

// Handle mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks?.classList.contains('active')) {
            if (!event.target.closest('.nav-links') && !event.target.closest('.menu-toggle')) {
                navLinks.classList.remove('active');
                menuToggle?.classList.remove('active');
            }
        }
    });
});

// Handle dropdown menus
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        // For mobile/tablet: toggle dropdown on click
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    this.parentNode.classList.toggle('active');
                }
            });
        }
    });
});

// Newsletter form submission
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            if (emailInput && emailInput.value.trim()) {
                // Simulate form submission
                const submitBtn = newsletterForm.querySelector('button');
                const originalContent = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                setTimeout(function() {
                    emailInput.value = '';
                    
                    // Create thank you message
                    const message = document.createElement('div');
                    message.className = 'success-message';
                    message.innerHTML = 'Thank you for subscribing!';
                    message.style.color = '#28a745';
                    message.style.fontSize = '14px';
                    message.style.padding = '10px 0';
                    
                    // Insert thank you message after form
                    newsletterForm.parentNode.insertBefore(message, newsletterForm.nextSibling);
                    
                    // Reset button
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    
                    // Remove message after a delay
                    setTimeout(function() {
                        message.style.opacity = '0';
                        setTimeout(() => message.remove(), 300);
                    }, 3000);
                }, 1500);
            }
        });
    }
});
