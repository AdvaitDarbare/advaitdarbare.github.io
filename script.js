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

    // Menu toggle wiring
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
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

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMenu);
    }
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
    // Close when clicking any side-menu link
    document.querySelectorAll('.side-link').forEach(el => {
        el.addEventListener('click', closeMenu);
    });


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

    // Project Modal Functionality
    const projectData = {
        'mcp-stock': {
            icon: '📈',
            title: 'LangGraph MCP AI Stock & Market Analysis Platform',
            subtitle: 'MCP-compliant multi-agent system powered by Claude AI for real-time market intelligence',
            overview: 'An advanced AI-powered stock market assistant that delivers real-time quotes, fundamentals, news, options chains, and historical charts. Built as an MCP-compliant multi-agent system that intelligently routes queries to specialized agents, providing seamless, context-aware market intelligence through Claude AI, LangGraph orchestration, and FastAPI backend.',
            features: [
                'Intelligent query routing with LLM-powered decision making',
                'Real-time stock quotes and market data via Charles Schwab API',
                'Company fundamentals, analyst ratings, and insider trading data',
                'Multi-stock comparisons and historical performance analysis',
                'Market movers tracking (top gainers, losers, most active)',
                'Dynamic time range queries with intelligent parameter optimization',
                'Multi-agent system with specialized tools for different data types',
                'React frontend with real-time streaming responses',
                'Comprehensive debug logging and error handling',
                'LangGraph Studio integration for visual workflow debugging'
            ],
            architecture: 'The system uses a multi-agent architecture with a Router Agent that analyzes user queries and directs them to specialized agents (Stock Agent, Equity Insights Agent). Each agent has access to specific tools and APIs, ensuring efficient data retrieval. The LangGraph framework orchestrates communication between agents, while Claude AI provides natural language understanding. FastAPI serves as the backend framework, and React powers the interactive frontend with real-time updates.',
            techStack: ['Python', 'LangGraph', 'Claude AI', 'FastAPI', 'React', 'TypeScript', 'Charles Schwab API', 'Finviz API', 'MCP Protocol', 'asyncio', 'LangSmith', 'Poetry'],
            github: 'https://github.com/AdvaitDarbare/MCP_StockAssistant'
        },
        'standup-assistant': {
            icon: '💬',
            title: 'AI-Powered Standup Assistant',
            subtitle: 'Automated team coordination tool with GPT-4 intelligence and Slack integration',
            overview: 'An intelligent automation tool designed to streamline daily standup meetings by collecting team check-ins, generating AI-powered summaries, and posting updates to Slack. Features semantic search capabilities powered by ChromaDB and sentence transformers, enabling team members to quickly find relevant information from past standups.',
            features: [
                'Automated daily check-in collection with scheduling',
                'GPT-4 powered intelligent summarization of team updates',
                'Semantic search across historical standup data',
                'Direct Slack integration for automatic posting',
                'Real-time streaming responses with Server-Sent Events (SSE)',
                'ChromaDB vector database for efficient similarity search',
                'Streamlit-based user interface for easy interaction',
                'Sentence transformer embeddings for context-aware search',
                'Async operations for high performance',
                'Configurable scheduling and notification system'
            ],
            architecture: 'Built on FastAPI for high-performance async operations, the system uses OpenAI GPT-4 for natural language processing and summarization. ChromaDB stores standup data as vector embeddings using sentence transformers, enabling semantic search. The Slack API integration automatically posts summaries, while a Streamlit interface provides easy interaction. Server-Sent Events enable real-time streaming of AI responses.',
            techStack: ['Python', 'FastAPI', 'OpenAI GPT-4', 'Slack API', 'ChromaDB', 'Sentence Transformers', 'Streamlit', 'SSE', 'asyncio', 'Scheduler'],
            github: 'https://github.com/AdvaitDarbare/standup-assistant'
        },
        'job-portal': {
            icon: '💼',
            title: 'Job Web Portal Application',
            subtitle: 'Enterprise-grade job portal with role-based access and AWS deployment',
            overview: 'A comprehensive full-stack job portal application built with Spring Boot 3 and deployed on AWS cloud infrastructure. Features secure user authentication, role-based access control, job posting management, and advanced search functionality. Designed following MVC architecture principles with enterprise-level security and scalability.',
            features: [
                'Secure user registration and authentication with Spring Security',
                'Role-based access control (Job Seekers, Employers, Admins)',
                'Job listing creation, management, and search functionality',
                'Advanced filtering and search capabilities',
                'Resume upload and management system',
                'Application tracking for both seekers and employers',
                'Admin dashboard for platform management',
                'RESTful API design for extensibility',
                'Responsive user interface for all device types',
                'AWS cloud deployment with auto-scaling',
                'CloudWatch monitoring and logging',
                'RDS database with automated backups'
            ],
            architecture: 'Built using Spring Boot 3 with MVC architecture pattern, the application leverages Spring Security for authentication and authorization. Hibernate/JPA handles database operations with MySQL on AWS RDS. The application is deployed on AWS Elastic Beanstalk for auto-scaling, with CloudWatch providing monitoring and logging. RESTful APIs enable future mobile app integration.',
            techStack: ['Java', 'Spring Boot 3', 'Spring MVC', 'Spring Security', 'Hibernate', 'JPA', 'MySQL', 'AWS EC2', 'AWS RDS', 'Elastic Beanstalk', 'CloudWatch', 'RESTful APIs'],
            github: 'https://github.com/AdvaitDarbare/job-portal-web-application'
        }
    };

    // Get modal elements
    const modal = document.getElementById('projectModal');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    const modalClose = modal?.querySelector('.modal-close');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalOverview = document.getElementById('modalOverview');
    const modalFeatures = document.getElementById('modalFeatures');
    const modalArchitecture = document.getElementById('modalArchitecture');
    const modalTechStack = document.getElementById('modalTechStack');
    const modalGithubLink = document.getElementById('modalGithubLink');
    if (modalGithubLink) {
        modalGithubLink.addEventListener('click', (e) => {
            e.stopPropagation();
            const href = modalGithubLink.getAttribute('href');
            if (href) {
                window.open(href, '_blank', 'noopener');
            }
        });
    }

    // Function to open modal
    function openProjectModal(projectId) {
        const project = projectData[projectId];
        if (!project || !modal) return;

        // Populate modal content
        if (modalIcon) modalIcon.textContent = project.icon;
        if (modalTitle) modalTitle.textContent = project.title;
        if (modalSubtitle) modalSubtitle.textContent = project.subtitle;
        if (modalOverview) modalOverview.textContent = project.overview;
        if (modalArchitecture) modalArchitecture.textContent = project.architecture;
        if (modalGithubLink) {
            const card = document.querySelector(`.project-card[data-project="${projectId}"]`);
            const cardGithub = card?.querySelector('.project-link');
            modalGithubLink.href = cardGithub?.getAttribute('href') || project.github;
        }

        // Populate features
        if (modalFeatures) {
            modalFeatures.innerHTML = project.features
                .map(feature => `<li>${feature}</li>`)
                .join('');
        }

        // Populate tech stack
        if (modalTechStack) {
            modalTechStack.innerHTML = project.techStack
                .map(tech => `<div class="tech-stack-item">${tech}</div>`)
                .join('');
        }

        // Show modal
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        } else {
            modal.scrollTop = 0;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to close modal
    function closeProjectModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add event listeners to Learn More buttons
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
    learnMoreButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = btn.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });

    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeProjectModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeProjectModal();
        }
    });
});

// Initial page load animation - removed duplicate animation
// Body opacity is handled in DOMContentLoaded
