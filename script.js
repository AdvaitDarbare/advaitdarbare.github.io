document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Section titles
    document.querySelectorAll('.section-title').forEach(el => observer.observe(el));

    // Contact elements
    document.querySelectorAll('.contact-info h3, .contact-info p').forEach(el => observer.observe(el));

    // Blog cards
    document.querySelectorAll('.blog-card').forEach(el => observer.observe(el));

    // Stagger observer for grouped card containers
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                Array.from(entry.target.children).forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 80);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) staggerObserver.observe(aboutContent);

    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) staggerObserver.observe(projectsGrid);

    const experienceLayout = document.querySelector('.experience-layout');
    if (experienceLayout) staggerObserver.observe(experienceLayout);

    const contactLinks = document.querySelector('.contact-links');
    if (contactLinks) staggerObserver.observe(contactLinks);

    // ==========================================
    // MOBILE MENU
    // ==========================================
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuClose = document.getElementById('menuClose');
    const menuBackdrop = document.getElementById('menuBackdrop');

    function openMobileMenu() {
        sideMenu?.classList.add('open');
        menuBackdrop?.classList.add('open');
        document.body.classList.add('menu-open');
        sideMenu?.setAttribute('aria-hidden', 'false');
    }

    function closeMobileMenu() {
        sideMenu?.classList.remove('open');
        menuBackdrop?.classList.remove('open');
        document.body.classList.remove('menu-open');
        sideMenu?.setAttribute('aria-hidden', 'true');
    }

    mobileToggle?.addEventListener('click', openMobileMenu);
    menuClose?.addEventListener('click', closeMobileMenu);
    menuBackdrop?.addEventListener('click', closeMobileMenu);

    document.querySelectorAll('.side-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ==========================================
    // PROJECT DATA
    // ==========================================
    const projectData = {
        'mcp-stock': {
            icon: '📈',
            title: 'AI Stock Assistant',
            subtitle: 'Production-grade research platform with LangGraph multi-agent supervisor and institutional-style reports',
            overview: 'A research-first stock analysis platform powered by a LangGraph multi-agent supervisor, Claude (Anthropic), and real-time market data from Schwab and Alpaca. Routes natural language queries through a dependency-aware agent graph, generates institutional-quality research reports, and streams results to a Next.js UI in real time. Follows a Hierarchical Multi-Agent Orchestration (HMAO) pattern with two tiers: parallel data researchers (market_data, fundamentals, sentiment, macro) and synthesis agents (technical_analysis, advisor).',
            features: [
                'Chat interface — ask any financial question; supervisor decomposes into parallel research tasks',
                'Report Lab — 10 institutional-style reports (Goldman Screener, Morgan DCF, Bridgewater Risk, Citadel Technical, Harvard Dividend, etc.)',
                'Live market data — quotes, OHLCV, analyst ratings, insider trades, SEC filings, Reddit/news sentiment, FRED macro',
                'Portfolio + trading — Schwab integration with mandatory human-in-the-loop (HITL) gate before orders',
                'Memory — conversation history in Qdrant for semantic recall across sessions',
                'Dependency-aware execution — Tier 1 researchers run in parallel; Tier 2 synthesizers wait on dependencies',
                'Quality gate — reports scored across 7 checks; auto-repair for scores below 0.75',
                '108 unit tests, zero LLM calls — comprehensive test suite with MLflow observability'
            ],
            architecture: 'Two-tier LangGraph StateGraph with a Planner LLM that produces an ExecutionPlan. The Router dispatches ready Tier 1 tasks (market_data, fundamentals, sentiment, macro) in parallel. A Research Gate synchronizes output, then Tier 2 agents (technical_analysis, advisor) run sequentially. The Report Engine bypasses the graph for named reports, using specialist builders and a quality gate. Redis caches market data; PostgreSQL stores portfolio/threads; Qdrant holds vector memory.',
            techStack: ['Python', 'LangGraph', 'Claude', 'FastAPI', 'Next.js 14', 'Schwab API', 'Alpaca', 'Redis', 'PostgreSQL', 'Qdrant', 'MLflow', 'Finviz', 'FRED', '108 tests'],
            github: 'https://github.com/AdvaitDarbare/MCP_StockAssistant'
        },
        'ai-agents-dre': {
            icon: '🔧',
            title: 'Agentic Data Reliability Engineering (DRE)',
            subtitle: 'Contract-first validation, anomaly detection, SLO enforcement, and human-in-the-loop remediation',
            overview: 'An agentic data reliability control plane for local-first and enterprise data workflows. Validates incoming datasets against contracts, detects anomalies using statistical baselines (Z-Score, Robust MAD, IQR), evaluates SLOs, and routes data through active/pending/quarantine flows with Human-in-the-Loop (HITL) and Agentic Remediation controls. Uses LangGraph for durable state management and Agno + GPT-4o for AI copilot investigation.',
            features: [
                'Contract-first + HITL — unknown datasets move to pending_approval; AI generates YAML contract proposals; LangGraph interrupt/resume for durable approval workflow',
                'Multi-stage reliability engine — Schema validation (DuckDB), data profiling, 6D quality scoring, anomaly detection with 3 concurrent statistical models',
                'Emergency Force Load — manual bypass for blocked datasets with full audit logging',
                'Next.js 15 Dashboard — Health Pulse, incident lifecycle, data lineage graph, workflow timeline',
                'Agentic governance — RBAC, policy engine, AI copilot for root cause analysis, auto-remediation for schema fixes',
                'Apache Doris load engine — high-performance Stream Load with auto-created tables',
                'MCP integration — entire toolset exposed via Model Context Protocol for AI-assisted workflows',
                'PostgreSQL 16 — unified store for runs, incidents, metric_history, learned_thresholds'
            ],
            architecture: 'Event-driven file watcher ingests files into data/landing. If no contract exists, LangGraph moves to pending_approval and generates AI proposals. On approval, full evaluation runs: Schema → Profiling → Anomaly → Routing (pass/quarantine). DuckDB handles in-memory profiling; PostgreSQL stores run_history, metric_history, incidents, and async_jobs. Next.js 15 + React 19 powers the operations dashboard. FastAPI backend with Pydantic v2.',
            techStack: ['Python', 'LangGraph', 'Agno', 'GPT-4o', 'FastAPI', 'Next.js 15', 'React 19', 'PostgreSQL 16', 'DuckDB', 'Apache Doris', 'Tailwind', 'Lucide', 'MCP'],
            github: 'https://github.com/AdvaitDarbare/ai-agents-dre'
        },
        'tariffpulse': {
            icon: '🏭',
            title: 'TariffPulse',
            subtitle: 'Multi-agent platform for quantifying semiconductor supply chain risk and tariff exposure using Knowledge Graphs and agentic RAG',
            overview: 'An intelligence platform designed to map and quantify how trade policy shocks (e.g., China chip tariffs) propagate through complex semiconductor supply chains. It utilizes a Hierarchical Multi-Agent Orchestration pattern to traverse a Neo4j Knowledge Graph, perform hybrid RAG over SEC filings, and calculate exposure scores. The system features a live-streaming analysis engine that renders interactive propagation graphs in real time.',
            features: [
                'Multi-Agent Supervisor — Orchestrates 4 specialized agents (Policy, Research, Analysis, Critique) via AutoGen 0.4, featuring a "Critique-Loop" for automated re-retrieval and gap detection',
                'Supply Chain Propagation — Performs multi-hop Neo4j traversal (Direct Producer → Upstream Supplier → Downstream Buyer) to identify hidden dependencies up to 4 nodes deep',
                'Agentic RAG — Executes hybrid BM25 and semantic search across 400+ SEC 10-K document chunks in Weaviate to provide documentary evidence for every supply chain relationship',
                'Exposure Modeling — Implements a weighted scoring algorithm (0–100 scale) calibrated across geographic concentration, margin sensitivity, and revenue dependency',
                'Real-Time Streaming — Utilizes FastAPI SSE and asyncio.Queue to stream live agent reasoning and node-by-node graph animations to a Next.js frontend',
                'Production Observability — Integrated with AgentOps for full session tracing and LlamaParse for complex PDF ingestion of USTR policy documents'
            ],
            architecture: 'The system employs a SelectorGroupChat where a GPT-4o supervisor routes tasks to parallel Tier-1 agents (Policy Scraper and Research). A Research Gate synchronizes the Knowledge Graph paths and vector search results before Tier-2 Analysis agents generate the final report. The data layer uses Neo4j AuraDB for relationship mapping, Weaviate for vector memory, and PostgreSQL for job state.',
            techStack: ['Python', 'FastAPI', 'AutoGen 0.4', 'LlamaIndex', 'TypeScript', 'Next.js 15', '@xyflow/react', 'shadcn/ui', 'Neo4j', 'Weaviate', 'PostgreSQL', 'Docker', 'Docker Compose', 'OpenAI GPT-4o', 'Tavily API', 'AgentOps'],
            github: 'https://github.com/AdvaitDarbare/TariffPulse'
        },
        'wikiwatch': {
            icon: '📊',
            title: 'WikiWatch',
            subtitle: 'Real-time Wikipedia anomaly detection pipeline with distributed stream processing and ML scoring',
            overview: 'A high-throughput monitoring system that detects behavioral anomalies (vandalism, bot swarms) in the live Wikipedia edit stream. The architecture mirrors industrial network telemetry systems, utilizing a Kafka-Flink pipeline for stateful aggregation and a PyTorch MLP for real-time scoring. Features a live-updating dashboard that visualizes edit bursts and anomaly trends across the global encyclopedia.',
            features: [
                'Real-time Ingestion — Consumes the Wikimedia SSE stream via a dedicated producer, filtering and routing events into Kafka',
                'Windowed Analytics — Implements PyFlink 5-minute tumbling windows to calculate per-article metrics like edit velocity and anonymous user ratios',
                'Behavioral Scoring — PyTorch MLP classifies windows as anomalous based on historical patterns, featuring input clipping to handle extreme data spikes',
                'Self-Correction — Model trained on 10k samples with an automated retraining loop that leverages live "ground truth" labels from PostgreSQL',
                'Live Dashboard — Full-stack React and FastAPI interface with real-time score updates and historical trend visualization via Recharts',
                'Distributed Infra — Fully containerized deployment across 9 services including a multi-node Flink cluster (JobManager/TaskManager)'
            ],
            architecture: 'The system uses a producer to write filtered edits to Kafka, which serves as the buffer for a PyFlink job. Flink performs keyed window aggregations and sinks metrics to PostgreSQL. A separate ML Inference service polls for new windows, calculates anomaly scores (0–1), and updates the DB. The FastAPI backend serves these scores to the React frontend, while a Retrain worker periodically updates the model weights based on accumulated window data.',
            techStack: ['Python', 'PyFlink', 'PyTorch', 'FastAPI', 'Apache Kafka', 'Apache Flink', 'PostgreSQL', 'Docker', 'Docker Compose', 'React', 'Tailwind CSS', 'Recharts', 'Wikimedia SSE API'],
            github: 'https://github.com/AdvaitDarbare/WikiWatch'
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

    // ==========================================
    // PROJECT PANEL
    // ==========================================
    const panel = document.getElementById('projectPanel');
    const panelOverlay = document.getElementById('panelOverlay');
    const panelClose = document.getElementById('panelClose');
    const panelIcon = document.getElementById('panelIcon');
    const panelTitle = document.getElementById('panelTitle');
    const panelSubtitle = document.getElementById('panelSubtitle');
    const panelOverview = document.getElementById('panelOverview');
    const panelFeatures = document.getElementById('panelFeatures');
    const panelArchitecture = document.getElementById('panelArchitecture');
    const panelTechStack = document.getElementById('panelTechStack');
    const panelGithubLink = document.getElementById('panelGithubLink');

    function openProjectPanel(projectId) {
        const project = projectData[projectId];
        if (!project || !panel) return;

        // Populate content
        if (panelIcon) panelIcon.textContent = project.icon;
        if (panelTitle) panelTitle.textContent = project.title;
        if (panelSubtitle) panelSubtitle.textContent = project.subtitle;
        if (panelOverview) panelOverview.textContent = project.overview;
        if (panelArchitecture) panelArchitecture.textContent = project.architecture;
        if (panelGithubLink) panelGithubLink.href = project.github;

        if (panelFeatures) {
            panelFeatures.innerHTML = project.features
                .map(f => `<li>${f}</li>`)
                .join('');
        }

        if (panelTechStack) {
            panelTechStack.innerHTML = project.techStack
                .map(t => `<span class="tech-badge">${t}</span>`)
                .join('');
        }

        // Scroll panel to top
        const panelContent = panel.querySelector('.panel-content');
        if (panelContent) panelContent.scrollTop = 0;

        // Open
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectPanel() {
        if (!panel) return;
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Event listeners for panel
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = btn.getAttribute('data-project');
            openProjectPanel(projectId);
        });
    });

    panelClose?.addEventListener('click', closeProjectPanel);
    panelOverlay?.addEventListener('click', closeProjectPanel);

    panelGithubLink?.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = panelGithubLink.getAttribute('href');
        if (href && href !== '#') {
            window.open(href, '_blank', 'noopener');
            e.preventDefault();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectPanel();
            closeMobileMenu();
        }
    });

});
