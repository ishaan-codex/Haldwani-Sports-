/* ==========================================
   HALDWANI SPORTS - JAVASCRIPT
   ========================================== */

// ==========================================
// SMOOTH SCROLL TO SECTION
// ==========================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ==========================================
// NAVBAR ACTIVE STATE ON SCROLL
// ==========================================

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }

    // Update active nav links based on scroll position
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================== 

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards and items for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatableElements = document.querySelectorAll(
        '.about-card, .service-item, .contact-card'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
});

// ==========================================
// BUTTON HOVER EFFECTS
// ==========================================

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ==========================================
// CARD HOVER EFFECTS
// ========================================== 

const cards = document.querySelectorAll('.about-card, .service-item, .contact-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ==========================================
// PAGE LOAD ANIMATION
// ========================================== 

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero content with stagger
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'slideInLeft 0.8s ease forwards';
    }
});

// ==========================================
// CONTACT INFORMATION CLICK HANDLING
// ========================================== 

document.addEventListener('DOMContentLoaded', () => {
    const contactInfos = document.querySelectorAll('.contact-info');
    
    contactInfos.forEach(info => {
        info.style.cursor = 'pointer';
        
        info.addEventListener('click', function(e) {
            const text = this.textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                const originalText = this.textContent;
                this.textContent = '✓ Copied!';
                
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.log('Could not copy text: ', err);
            });
        });
    });
});

// ==========================================
// RESPONSIVE MENU TOGGLE (for future mobile menu)
// ========================================== 

function initMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    
    // This function is prepared for future mobile menu implementation
    // Can be extended with hamburger menu functionality
    
    if (window.innerWidth <= 768) {
        // Mobile specific handling can be added here
    }
}

window.addEventListener('resize', initMobileMenu);
initMobileMenu();

// ==========================================
// SCROLL PROGRESS INDICATOR
// ========================================== 

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    // This can be used to update a progress bar if needed
    console.log(`Scroll Progress: ${scrollPercent.toFixed(2)}%`);
}

window.addEventListener('scroll', updateScrollProgress);

// ==========================================
// SMOOTH ANCHOR LINKS
// ========================================== 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// DYNAMIC YEAR IN FOOTER
// ========================================== 

document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-content p');
    
    if (footerYear) {
        footerYear.textContent = footerYear.textContent.replace('2024', year);
    }
});

// ==========================================
// CONSOLE MESSAGE
// ========================================== 

console.log('%cWelcome to Haldwani Sports!', 'color: #1fa8a0; font-size: 16px; font-weight: bold;');
console.log('%cQuality you can trust. Prices you\'ll love.', 'color: #80c341; font-size: 14px;');

// ==========================================
// ACCESSIBILITY IMPROVEMENTS
// ========================================== 

// Ensure keyboard navigation works smoothly
document.addEventListener('keydown', (e) => {
    // Add keyboard navigation if needed
    if (e.key === 'Escape') {
        // Close any open modals/menus if implemented
    }
});

// Reduce motion preference support
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}
