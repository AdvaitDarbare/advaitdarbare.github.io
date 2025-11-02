// All scripts moved to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '1';
    
    // Detect touch devices for conditional feature loading
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px'
    };

    // Create observer for all elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        observer.observe(title);
    });

    // Observe contact elements (h3 and p only, links handled by stagger)
    const contactElements = document.querySelectorAll('.contact-info h3, .contact-info p');
    contactElements.forEach(element => {
        observer.observe(element);
    });

    // Stagger animation observer for grouped elements
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                        // For blog cards, also animate the inner article
                        const innerCard = child.querySelector('.blog-card');
                        if (innerCard) {
                            setTimeout(() => {
                                innerCard.classList.add('visible');
                            }, index * 100);
                        }
                    }, index * 100);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe containers for stagger effect
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) staggerObserver.observe(aboutContent);

    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) staggerObserver.observe(projectsGrid);

    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) staggerObserver.observe(blogGrid);
    
    // Also observe blog cards directly for immediate animation
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        observer.observe(card);
    });

    const contactLinks = document.querySelector('.contact-links');
    if (contactLinks) staggerObserver.observe(contactLinks);

    // Observe experience blocks
    const experienceLayout = document.querySelector('.experience-layout');
    if (experienceLayout) staggerObserver.observe(experienceLayout);

    // Parallax effect for hero section and backgrounds
    let heroShapes = document.querySelectorAll('.shape');
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    function updateParallax() {
        const scrolled = lastScrollY;

        // Hero shapes parallax
        heroShapes.forEach((shape, index) => {
            const speed = 0.3 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Section backgrounds parallax
        document.querySelectorAll('.section').forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (window.innerHeight - rect.top) * 0.05;
                const before = section.querySelector('::before');
                if (section.classList.contains('about') ||
                    section.classList.contains('projects') ||
                    section.classList.contains('blog')) {
                    section.style.setProperty('--parallax-offset', `${offset}px`);
                }
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.pageYOffset;
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Enhanced 3D tilt effect for cards - only on non-touch devices
    if (!isTouchDevice) {
        // About cards - reduced intensity
        document.querySelectorAll('.about-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (!card.classList.contains('visible')) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 80;
                const rotateY = (centerX - x) / 80;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Project cards - moderate tilt
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (!card.classList.contains('visible')) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 50;
                const rotateY = (centerX - x) / 50;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Blog cards - minimal tilt
        document.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (!card.classList.contains('visible')) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 100;
                const rotateY = (centerX - x) / 100;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (sideMenu && sideMenu.classList.contains('open')) {
                    closeMenu();
                }
                // Use CSS scroll-padding for proper offset
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
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

    // Add glow effect on scroll for timeline
    window.addEventListener('scroll', () => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible && item.classList.contains('visible')) {
                const marker = item.querySelector('.timeline-marker');
                const progress = Math.min(Math.max((window.innerHeight - rect.top) / window.innerHeight, 0), 1);
                marker.style.transform = `translateX(-50%) scale(${1 + progress * 0.5})`;
                marker.style.boxShadow = `0 0 ${20 + progress * 20}px var(--primary-color)`;
            }
        });
    });

    // Magnetic effect for contact links - only on non-touch devices
    if (!isTouchDevice) {
        document.querySelectorAll('.contact-link').forEach(link => {
            link.addEventListener('mousemove', (e) => {
                if (!link.classList.contains('visible')) return;
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                link.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
            });
        });
    }

    // Custom Cursor - only on non-touch devices
    const cursor = document.getElementById('cursor');
    if (cursor && !isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            if (!cursor.classList.contains('active')) {
                cursor.classList.add('active');
            }
        });

        // Add hover effect
        const hoverElements = document.querySelectorAll('a, button, .project-card, .blog-card, .about-card, .contact-link');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // Menu toggle wiring
    const menuBtn = document.querySelector('.menu-toggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuBackdrop = document.getElementById('menuBackdrop');
    const menuClose = document.getElementById('menuClose');

    function openMenu() {
        if (!sideMenu || !menuBackdrop) return;
        sideMenu.classList.add('open');
        menuBackdrop.classList.add('open');
        document.body.classList.add('menu-open');
        sideMenu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        if (!sideMenu || !menuBackdrop) return;
        sideMenu.classList.remove('open');
        menuBackdrop.classList.remove('open');
        document.body.classList.remove('menu-open');
        sideMenu.setAttribute('aria-hidden', 'true');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', openMenu);
        // Only add hover for non-touch devices
        if (!isTouchDevice) {
            menuBtn.addEventListener('mouseenter', openMenu);
        }
    }
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

    // Auto-close menu when cursor exits the menu - only for non-touch devices
    if (sideMenu && !isTouchDevice) {
        sideMenu.addEventListener('mouseleave', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
    // Close when clicking any side-menu link
    document.querySelectorAll('.side-link, .side-tag').forEach(el => {
        el.addEventListener('click', closeMenu);
    });

    // Optional: simple local time in nav
    const navTime = document.getElementById('navTime');
    if (navTime) {
        const updateTime = () => {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            navTime.textContent = `${Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()} ${time}`;
        };
        updateTime();
        setInterval(updateTime, 60000);
    }

    // Nav scroll effect
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Add smooth reveal animation for skill items
    const skillsTrack = document.querySelector('.skills-track');
    if (skillsTrack) {
        const skillItems = skillsTrack.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 30);
        });
    }
});

// Initial page load animation - removed duplicate animation
// Body opacity is handled in DOMContentLoaded
