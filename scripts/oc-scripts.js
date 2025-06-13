// Organizing Committee Page Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: false
    });
    
    // Background particles effect for hero section
    const particlesContainer = document.querySelector('.oc-particles');
    if (particlesContainer) {
        createParticles();
    }
    
    // Animate hero counter numbers immediately without waiting for scroll
    const heroCounters = document.querySelectorAll('.oc-counter-row .counter-number');
    heroCounters.forEach(element => {
        const targetNumber = parseInt(element.getAttribute('data-counter'));
        animateCounter(element, targetNumber, 1500); // Faster animation for hero counters
    });
    
    // Animate other counter numbers on scroll
    const sectionCounters = document.querySelectorAll('.team-stats-section .stat-number');
    observeCounters(sectionCounters);
    
    // Enhance hover interactions
    enhanceHoverEffects();
    
    // Make orbit icons rotate independently
    animateOrbitIcons();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('.oc-cta-buttons a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get the height of the navbar for offset
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                
                // Calculate the final position
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Smooth scroll to the target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
});

// Function to animate orbit icons with random movements
function animateOrbitIcons() {
    const orbitIcons = document.querySelectorAll('.orbit-icon');
    
    orbitIcons.forEach(icon => {
        // Random starting position within the orbit
        const randomAngle = Math.random() * 360;
        icon.style.transform = `rotate(${randomAngle}deg) translateX(120px) rotate(-${randomAngle}deg)`;
        
        // Add hover effect
        icon.addEventListener('mouseenter', function() {
            this.style.transform = `rotate(${randomAngle}deg) translateX(120px) rotate(-${randomAngle}deg) scale(1.2)`;
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = `rotate(${randomAngle}deg) translateX(120px) rotate(-${randomAngle}deg)`;
        });
    });
}

// Function to create particle background effect
function createParticles() {
    const particlesContainer = document.querySelector('.oc-particles');
    
    // Create Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    particlesContainer.appendChild(renderer.domElement);
    
    // Create particles geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create particles material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0xffffff,
        transparent: true
    });
    
    // Create points mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 2;
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        particlesMesh.rotation.x += 0.0001;
        particlesMesh.rotation.y += 0.0001;
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Function to observe and animate counter elements
function observeCounters(elements) {
    if (!elements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = entry.target;
                const targetNumber = parseInt(targetElement.getAttribute('data-counter'));
                animateCounter(targetElement, targetNumber);
                observer.unobserve(targetElement);
            }
        });
    }, observerOptions);
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Function to animate counter from 0 to target number
function animateCounter(element, targetNumber, duration = 2000) {
    let start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const value = Math.floor(progress * targetNumber);
        
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetNumber;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Function to enhance hover effects
function enhanceHoverEffects() {
    // Add 3D tilt effect to member cards
    const memberCards = document.querySelectorAll('.team-member-card');
    
    memberCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const rotateX = deltaY * 10; // Max 10 degrees
            const rotateY = -deltaX * 10; // Max 10 degrees
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Handle back to top button
document.addEventListener('scroll', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});
