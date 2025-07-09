// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Loading screen logic
window.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.querySelector('.main-content');
    if (loadingScreen && mainContent) {
        setTimeout(() => {
            loadingScreen.style.transition = 'opacity 0.8s';
            loadingScreen.style.opacity = 0;
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.style.transition = 'opacity 1s';
                mainContent.style.opacity = 1;
            }, 800);
        }, 1500); // Durasi loading screen (ms)
    }
});

// Modern Navbar functionality
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobile-toggle');
const navbarMenu = document.getElementById('navbar-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

// Check if elements exist before adding event listeners
if (navbar && mobileToggle && navbarMenu && mobileOverlay) {
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navbarMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking overlay
    mobileOverlay.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mobileToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// Enhanced Navbar scroll effect
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
    if (!navbar) return;
    
    const scrollY = window.scrollY;
    
    // Add scrolled class
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (scrollY > lastScrollY && scrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

function requestNavbarUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', requestNavbarUpdate);

// Active link highlighting with smooth transition
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-link');
    
    if (!sections.length || !navLinks.length) return;
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Throttled scroll event for active link
let activeNavTicking = false;
function requestActiveNavUpdate() {
    if (!activeNavTicking) {
        requestAnimationFrame(updateActiveLink);
        activeNavTicking = true;
        setTimeout(() => { activeNavTicking = false; }, 100);
    }
}

window.addEventListener('scroll', requestActiveNavUpdate);
window.addEventListener('load', updateActiveLink);

// Typewriter effect
const typewriterText = [
    "Crafting digital solutions that bridge frontend elegance with backend robustness",
    "Building scalable web applications with Laravel expertise",
    "Creating seamless user experiences from database to UI"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseDuration = 2000;

function typeWriter() {
    if (!typewriterElement) return;
    
    const currentText = typewriterText[textIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let speed = isDeleting ? deletingSpeed : typingSpeed;
    
    if (!isDeleting && charIndex === currentText.length) {
        speed = pauseDuration;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typewriterText.length;
    }
    
    setTimeout(typeWriter, speed);
}

// Enhanced smooth scroll for all navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target && navbar) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced Skills progress bar animation
const aboutSection = document.querySelector('.about');
let aboutAnimated = false;

function animateAboutSection() {
    if (aboutAnimated) return;
    
    console.log('🎯 Animating About Section...');
    
    const aboutText = document.querySelector('.about-text');
    const skillsGrid = document.querySelector('.skills-grid');
    const statItems = document.querySelectorAll('.stat-item');
    const skillItems = document.querySelectorAll('.skill-item');
    const skillBars = document.querySelectorAll('.skill-progress');
    
    console.log('📊 Found elements:', {
        aboutText: !!aboutText,
        skillsGrid: !!skillsGrid,
        statItems: statItems.length,
        skillItems: skillItems.length,
        skillBars: skillBars.length
    });
    
    // Animate about text
    if (aboutText) {
        aboutText.classList.add('animate');
        console.log('✅ About text animated');
    }
    
    // Animate stats with counter effect
    statItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
            
            // Animate counter numbers
            const numberElement = item.querySelector('h3');
            if (numberElement) {
                const targetNumber = parseInt(numberElement.textContent);
                const suffix = numberElement.textContent.includes('+') ? '+' : 
                              numberElement.textContent.includes('%') ? '%' : '';
                
                animateCounter(numberElement, 0, targetNumber, 1500, suffix);
                console.log(`📈 Counter ${index + 1} animated: ${targetNumber}${suffix}`);
            }
        }, index * 150);
    });
    
    // Animate skills grid
    setTimeout(() => {
        if (skillsGrid) {
            skillsGrid.classList.add('animate');
            console.log('🎨 Skills grid animated');
            
            // Animate skill items with stagger
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                    console.log(`🔧 Skill item ${index + 1} animated`);
                }, index * 100);
            });
            
            // Animate skill bars with proper width
            setTimeout(() => {
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const targetWidth = bar.getAttribute('data-width');
                        if (targetWidth) {
                            console.log(`📊 Animating skill bar ${index + 1}: ${targetWidth}`);
                            
                            // Set CSS custom property for keyframe animation
                            bar.style.setProperty('--target-width', targetWidth);
                            bar.classList.add('animate');
                            
                            // Animate width step by step for better visual effect
                            let currentWidth = 0;
                            const targetNum = parseInt(targetWidth);
                            const duration = 2000; // 2 seconds
                            const fps = 60;
                            const increment = targetNum / (duration / 1000 * fps);
                            
                            function updateWidth() {
                                currentWidth += increment;
                                if (currentWidth <= targetNum) {
                                    bar.style.width = Math.min(currentWidth, targetNum) + '%';
                                    requestAnimationFrame(updateWidth);
                                } else {
                                    bar.style.width = targetWidth;
                                    console.log(`✅ Skill bar ${index + 1} animation complete: ${targetWidth}`);
                                }
                            }
                            
                            requestAnimationFrame(updateWidth);
                        }
                    }, index * 200);
                });
            }, 400);
        }
    }, 300);
    
    aboutAnimated = true;
    console.log('🎉 About section animation completed!');
}

// Counter animation function
function animateCounter(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOutCubic);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = end + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Enhanced Intersection Observer for About section
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        console.log('👁️ About section intersection:', {
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            boundingClientRect: entry.boundingClientRect
        });
        
        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            console.log('🚀 Triggering about section animation...');
            animateAboutSection();
        }
    });
}, { 
    threshold: [0.1, 0.2, 0.3, 0.5],
    rootMargin: '0px 0px -10% 0px'
});

if (aboutSection) {
    aboutObserver.observe(aboutSection);
    console.log('👀 About section observer attached');
} else {
    console.error('❌ About section not found!');
}

// Contact form handling with validation
const contactForm = document.getElementById('contactForm');

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(formData) {
    const errors = {};
    
    // Name validation
    if (!formData.get('name') || formData.get('name').trim().length < 2) {
        errors.name = 'Please enter a valid name (at least 2 characters)';
    }
    
    // Email validation
    if (!formData.get('email') || !validateEmail(formData.get('email'))) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Project type validation
    if (!formData.get('projectType')) {
        errors.projectType = 'Please select a project type';
    }
    
    // Message validation
    if (!formData.get('message') || formData.get('message').trim().length < 10) {
        errors.message = 'Please enter a message (at least 10 characters)';
    }
    
    return errors;
}

function showFieldError(fieldName, message) {
    const formGroup = document.querySelector(`[name="${fieldName}"]`).closest('.form-group');
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

function showFieldSuccess(fieldName) {
    const formGroup = document.querySelector(`[name="${fieldName}"]`).closest('.form-group');
    formGroup.classList.add('success');
    formGroup.classList.remove('error');
    
    // Remove error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function clearFieldValidation(fieldName) {
    const formGroup = document.querySelector(`[name="${fieldName}"]`).closest('.form-group');
    formGroup.classList.remove('error', 'success');
    
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Real-time validation
['name', 'email', 'projectType', 'message'].forEach(fieldName => {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.addEventListener('blur', () => {
            const formData = new FormData(contactForm);
            const errors = validateForm(formData);
            
            if (errors[fieldName]) {
                showFieldError(fieldName, errors[fieldName]);
            } else if (formData.get(fieldName)) {
                showFieldSuccess(fieldName);
            }
        });
        
        field.addEventListener('input', () => {
            clearFieldValidation(fieldName);
        });
    }
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        projectType: formData.get('projectType'),
        message: formData.get('message')
    };
    
    // Validate form
    const errors = validateForm(formData);
    
    // Clear previous validations
    ['name', 'email', 'projectType', 'message'].forEach(fieldName => {
        clearFieldValidation(fieldName);
    });
    
    // Show errors if any
    if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach(fieldName => {
            showFieldError(fieldName, errors[fieldName]);
        });
        
        // Focus on first error field
        const firstErrorField = document.querySelector(`[name="${Object.keys(errors)[0]}"]`);
        if (firstErrorField) {
            firstErrorField.focus();
        }
        
        showNotification('Please fix the errors above', 'error');
        return;
    }
    
    // Show all fields as success
    ['name', 'email', 'projectType', 'message'].forEach(fieldName => {
        showFieldSuccess(fieldName);
    });
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    console.log('📧 Form submission data:', data);
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Show success message
        showNotification(`Thanks ${data.name}! Your message about "${data.projectType.replace('-', ' ')}" has been sent successfully. I'll get back to you within 24 hours! 🚀`, 'success');
        
        // Reset form
        contactForm.reset();
        
        // Clear all validations
        ['name', 'email', 'projectType', 'message'].forEach(fieldName => {
            clearFieldValidation(fieldName);
        });
        
        // Reset button
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
    }, 2000);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Project image lazy loading
const projectImages = document.querySelectorAll('.project-image img');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            // Simulate loading delay
            setTimeout(() => {
                img.style.opacity = '1';
            }, 100);
            
            observer.unobserve(img);
        }
    });
});

projectImages.forEach(img => {
    imageObserver.observe(img);
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active link styles
const activeSidebarStyles = document.createElement('style');
activeSidebarStyles.textContent = `
    .sidebar-link.active {
        color: white !important;
        background: rgba(255, 255, 255, 0.1) !important;
    }
    .sidebar-link.active::before {
        transform: scaleY(1) !important;
    }
`;
document.head.appendChild(activeSidebarStyles);

// Loading animation for page elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.loading');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('loaded');
        }
    });
}

// Add loading class to elements that should animate
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .skill-item, .project-item');
    animatedElements.forEach(element => {
        element.classList.add('loading');
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 Easter egg found! You found the Konami code!', 'success');
        
        // Add rainbow effect to the page
        document.body.style.animation = 'rainbow 2s ease-in-out';
        
        // Add rainbow animation
        if (!document.querySelector('#easter-egg-styles')) {
            const rainbowStyles = document.createElement('style');
            rainbowStyles.id = 'easter-egg-styles';
            rainbowStyles.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(rainbowStyles);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
        
        konamiCode = [];
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Your scroll handling code here
    animateOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Console message
console.log(`
    🚀 Welcome to my portfolio!
    
    Built with:
    - HTML5, CSS3, JavaScript
    - AOS (Animate On Scroll)
    - Font Awesome Icons
    - Google Fonts
    
    Feel free to check out the source code!
    Contact me if you'd like to work together.
`);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio JavaScript initialized!');
    
    // Start typewriter effect
    setTimeout(typeWriter, 1000);
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Add fade-in animation to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transition = 'opacity 1s ease-in-out';
        
        setTimeout(() => {
            hero.style.opacity = '1';
        }, 100);
    }
    
    // Preload critical images
    const criticalImages = [
        'https://via.placeholder.com/300x300/059669/ffffff?text=Your+Photo'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Add loading animations to elements
    const animatedElements = document.querySelectorAll('.service-card, .project-item');
    animatedElements.forEach(element => {
        element.classList.add('loading');
    });
    
    // Force check about section animation after page load
    setTimeout(() => {
        const aboutSectionCheck = document.querySelector('.about');
        if (aboutSectionCheck && window.scrollY > 0) {
            const rect = aboutSectionCheck.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible && !aboutAnimated) {
                console.log('🔥 Force triggering about animation on load');
                animateAboutSection();
            }
        }
    }, 1500);
});

// Enhanced navbar interactions
function initNavbarEnhancements() {
    // Smooth scroll for navbar links
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background opacity based on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        const opacity = Math.max(0.95 - scrolled / 1000, 0.8);
        
        navbar.style.background = `rgba(255, 255, 255, ${opacity})`;
        
        if (document.body.classList.contains('dark-theme')) {
            navbar.style.background = `rgba(31, 41, 55, ${opacity})`;
        }
    });

    // Brand animation on scroll to top
    const brandText = document.querySelector('.brand-text');
    if (brandText) {
        brandText.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        brandText.style.cursor = 'pointer';
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            mobileToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize enhanced features
initNavbarEnhancements();

// Contact Form Submission to Google Spreadsheet
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const projectType = formData.get('projectType');
            const message = formData.get('message');
            
            // Validate form
            if (!name || !email || !projectType || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Get submit button and show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Prepare data for Google Apps Script
                const dataToSend = {
                    name: name,
                    email: email,
                    projectType: projectType,
                    description: message,
                    timestamp: new Date().toISOString()
                };
                
                // Send to Google Apps Script Web App
                // Replace YOUR_GOOGLE_APPS_SCRIPT_URL with your actual deployment URL
                const response = await fetch('AKfycbzUcrQ7DvcAvlgfPMEvaW2vCwzAaay_p9lj5FrjTodQUTxmZfCSJgr5fTfzpe7Hl7TmDg', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend)
                });
                
                if (response.ok) {
                    // Success
                    alert('Thank you! Your message has been sent successfully. I will get back to you soon.');
                    contactForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your message. Please try again or contact me directly via email.');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});