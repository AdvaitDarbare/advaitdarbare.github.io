// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.about-card, .skill-category, .timeline-item, .project-card, .contact-info');
    elements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Parallax effect for hero section
let heroShapes = document.querySelectorAll('.shape');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    heroShapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Subtle mouse movement effect for cards (excluding timeline-content and blog for readability)
document.querySelectorAll('.about-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const nav = document.getElementById('nav');
    
    if (currentScroll > 100) {
        nav.style.top = '10px';
        nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
    } else {
        nav.style.top = '20px';
        nav.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Add ripple effect to buttons
document.querySelectorAll('.form-button, .nav-link').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Stagger animation for cards
function staggerCards() {
    const cards = document.querySelectorAll('.about-card, .project-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.6s ease-out forwards`;
        }, index * 100);
    });
}

// Call stagger when cards enter viewport
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.about-card, .project-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.about-content, .skills-container, .projects-grid').forEach(container => {
    cardObserver.observe(container);
});

// Initial card styles
document.querySelectorAll('.about-card, .project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
});

// Add glow effect on scroll for timeline
window.addEventListener('scroll', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            const marker = item.querySelector('.timeline-marker');
            const progress = Math.min(Math.max((window.innerHeight - rect.top) / window.innerHeight, 0), 1);
            marker.style.transform = `translateX(-50%) scale(${1 + progress * 0.5})`;
            marker.style.boxShadow = `0 0 ${20 + progress * 20}px var(--primary-color)`;
        }
    });
});

// Magnetic effect for contact links
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        link.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = '';
    });
});

// Text reveal animation
const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            entry.target.innerHTML = '';
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.opacity = '0';
                span.style.animation = `fadeIn 0.1s ease forwards ${index * 0.02}s`;
                entry.target.appendChild(span);
            });
            textObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Enhanced hero title animation
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.querySelectorAll('.word').forEach((word, index) => {
        word.style.animationDelay = `${index * 0.2}s`;
    });
}

// Hero section interactivity removed - clean animation only

// Prevent flash of unstyled content
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '1';
});

// Initial page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

