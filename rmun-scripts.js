document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false
    });

    // Counter Animation for Statistics
    const counterElements = document.querySelectorAll('[data-counter]');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-counter'));
                
                let count = 0;
                const updateCount = () => {
                    const increment = countTo / 50;
                    
                    if (count < countTo) {
                        count += increment;
                        target.textContent = Math.floor(count);
                        setTimeout(updateCount, 30);
                    } else {
                        target.textContent = countTo;
                    }
                };
                
                updateCount();
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    counterElements.forEach(element => {
        observer.observe(element);
    });

    // Committee Cards Animation
    const committeeCards = document.querySelectorAll('.committee-card');
    committeeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.overlay-content');
            if (overlay) {
                overlay.style.transform = 'translateY(0)';
                overlay.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.overlay-content');
            if (overlay) {
                overlay.style.transform = 'translateY(20px)';
                overlay.style.opacity = '0';
            }
        });
    });

    // Globe 3D Animation
    if (typeof THREE !== 'undefined') {
        const globePlaceholder = document.querySelector('.globe-placeholder');
        if (globePlaceholder) {
            const container = document.querySelector('.globe-animation');
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            // Create scene
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);
            
            // Create globe
            const geometry = new THREE.SphereGeometry(3, 32, 32);
            
            // Create texture loader
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('/images/world-map.png');
            
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                opacity: 0.9,
                transparent: true
            });
            
            const globe = new THREE.Mesh(geometry, material);
            scene.add(globe);
            
            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            // Add point light
            const pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.set(5, 3, 5);
            scene.add(pointLight);
            
            // Position camera
            camera.position.z = 7;
            
            // Animation function
            function animate() {
                requestAnimationFrame(animate);
                
                globe.rotation.y += 0.005;
                
                renderer.render(scene, camera);
            }
            
            // Start animation
            animate();
            
            // Hide the placeholder after globe is loaded
            globePlaceholder.style.display = 'none';
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Fix layout issues after page load
    // Adjust committee cards height for better alignment
    function equalizeCommitteeCardHeights() {
        const committeeCards = document.querySelectorAll('.committee-card');
        
        // Reset heights first
        committeeCards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // Group cards by rows
        const windowWidth = window.innerWidth;
        if (windowWidth >= 768) {
            const rows = {};
            committeeCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const top = Math.floor(rect.top);
                
                if (!rows[top]) rows[top] = [];
                rows[top].push(card);
            });
            
            // Set equal height in each row
            Object.values(rows).forEach(cardsInRow => {
                const maxHeight = Math.max(...cardsInRow.map(card => card.offsetHeight));
                cardsInRow.forEach(card => {
                    card.style.height = `${maxHeight}px`;
                });
            });
        }
    }
    
    // Run on load and window resize
    equalizeCommitteeCardHeights();
    window.addEventListener('resize', equalizeCommitteeCardHeights);
    
    // Ensure timeline items are properly aligned
    function adjustTimelineLayout() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const windowWidth = window.innerWidth;
        
        if (windowWidth <= 1024) {
            timelineItems.forEach(item => {
                const content = item.querySelector('.timeline-content');
                if (content) {
                    content.style.width = '90%';
                }
            });
        } else {
            timelineItems.forEach(item => {
                const content = item.querySelector('.timeline-content');
                if (content) {
                    content.style.width = '45%';
                }
            });
        }
    }
    
    adjustTimelineLayout();
    window.addEventListener('resize', adjustTimelineLayout);

    // Add staggered animation effect for committee cards
    document.addEventListener('DOMContentLoaded', function() {
        // Enhance committee images with staggered animations
        const committeeCards = document.querySelectorAll('.committee-card');
        
        function animateCommittees() {
            committeeCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animated');
                    
                    // Add image effect
                    const logoImg = card.querySelector('.committee-logo img');
                    if (logoImg) {
                        logoImg.style.opacity = '0';
                        setTimeout(() => {
                            logoImg.style.opacity = '1';
                            logoImg.classList.add('animated');
                        }, 300);
                    }
                    
                }, index * 200);
            });
        }
        
        // Run animation when section is in view
        const committeesSection = document.querySelector('.committees-section');
        
        if (committeesSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCommittees();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(committeesSection);
        }
        
        // Improve CTA buttons with hover effects
        const ctaButtons = document.querySelectorAll('.cta-container .btn');
        
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    });
    
    // Fix committee section images and layout
    const committeeImages = document.querySelectorAll('.committee-logo img');
    
    // Fix committee images
    committeeImages.forEach(img => {
        // Ensure image is displayed properly
        img.style.display = 'block';
        
        // Add error handling for images
        img.onerror = function() {
            // If image fails to load, replace with a placeholder
            this.src = '/images/mun_1.png';
            this.style.opacity = '0.7';
            
            // Add a committee icon as a fallback
            const logoDiv = this.parentElement;
            if (!logoDiv.querySelector('.fallback-icon')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-icon';
                fallback.innerHTML = '<i class="fas fa-landmark"></i>';
                fallback.style.position = 'absolute';
                fallback.style.fontSize = '2.5rem';
                fallback.style.color = 'rgba(255, 255, 255, 0.8)';
                logoDiv.appendChild(fallback);
            }
        };
        
        // Force image reload to ensure it displays
        const currentSrc = img.src;
        img.src = '';
        img.src = currentSrc;
    });
    
    // Add animation delay based on index to create staggered effect
    committeeCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
});
