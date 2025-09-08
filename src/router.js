import { getRandomImage, getImageCount } from './imageManifest.js';

// Get a random image from our manifest of known working images
const mainImagePath = getRandomImage();
const secondImagePath = getRandomImage();
const thirdImagePath = getRandomImage();

// console.log(`Selected image: ${mainImagePath} (from ${getImageCount()} available images)`);
 
// Route configuration object
const routes = {
    '/': {
        template: `
            <div class="page home-page">
                <!-- Mobile Menu Toggle -->
                <button id="mobile-menu-toggle" class="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <!-- Mobile Menu Dropdown -->
                <div id="mobile-menu-dropdown" class="mobile-menu-dropdown">
                    <button data-section="about">About</button>
                    <button data-section="carousel">Gallery</button>
                    <button data-section="shows">Shows</button>
                    <button data-section="projects">Projects</button>
                    <button data-section="video">Video</button>
                    <button data-section="contact">Contact</button>
                </div>
                <div id="intro-content">
                    <h1 id="intro-title">Alexander Evans<br class="mobile-break"> Experience<span class="blinking-cursor">_</span></h1>
                    <div id="menu-items">
                        <button data-section="about">About</button>
                        <button data-section="carousel">Gallery</button>
                        <button data-section="shows">Shows</button>
                        <button data-section="projects">Projects</button>
                        <button data-section="video">Video</button>
                        <button data-section="contact">Contact</button>
                    </div>
                </div>
                <div id="intro" class="dark-section">
                    <div id="intro-image">
                        <img id="intro-image-element" src="${mainImagePath}" alt="Intro Image">
                    </div>
                </div>
                <div id="about" class="dark-section">
                    <div id="about-content">
                        <p>We are a multi-functional marketing and production company dedicated to amplifying and elevating our clients.</p>
                        <p>Our mission is to immerse global audiences in their vision through outlets such as custom set design, press, media management, and buyers' brunches. The Alexander Evans Experience creates opportunities to showcase and spotlight today's most innovative brands..</p>
                    </div>
                </div>
                <div id="carousel" class="light-section">
                    <div class="carousel-container">
                        <div class="carousel-track">
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 1">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 2">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 3">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 4">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 5">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 6">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 7">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 8">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 9">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 10">
                            </div>
                            <!-- Duplicate first 5 images for seamless loop -->
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 11">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 12">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 13">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 14">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 15">
                            </div>
                        </div>
                    </div>
                </div>
                <div id="video-title-banner">
                    <div id="video-title-scroll">
                        <span>Experience AEX • Experience AEX • Experience AEX • Experience AEX • Experience AEX • </span>
                    </div>
                </div>
                <div id="carousel" class="light-section">
                    <div class="carousel-container">
                        <div class="carousel-track">
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 1">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 2">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 3">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 4">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 5">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 6">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 7">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 8">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 9">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 10">
                            </div>
                            <!-- Duplicate first 5 images for seamless loop -->
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 11">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 12">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 13">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 14">
                            </div>
                            <div class="carousel-slide">
                                <img src="${getRandomImage()}" alt="Gallery Image 15">
                            </div>
                        </div>
                    </div>
                </div>
                <div id="shows" class="light-section">
                    <h2 id="shows-title">Upcoming Shows</h2>
                    <!-- Dynamic show cards will be inserted here by updateShowsSection() -->
                </div>
                <div id="projects" class="dark-section">
                    <div id="projects-content">
                        <p>Creative endeavors and innovative solutions.</p>
                        <div id="project-container"></div>
                        <div id="projectsGrid">
                            <div class="project" id="moving-project-card">
                                <div class="project-image">
                                    <img src="${getRandomImage()}" alt="EPPERSON Project">
                                </div>
                                <div class="project-caption">EPPERSON</div>
                            </div>
                            <div class="project">
                                <div class="project-image">
                                    <img src="${getRandomImage()}" alt="DANIEL LEATHERS Project">
                                </div>
                                <div class="project-caption">DANIEL LEATHERS</div>
                            </div>
                            <div class="project">
                                <div class="project-image">
                                    <img src="${getRandomImage()}" alt="SCOGÉ Project">
                                </div>
                                <div class="project-caption">SCOGÉ</div>
                            </div>
                            <div class="project">
                                <div class="project-image">
                                    <img src="${getRandomImage()}" alt="CÉLINE Project">
                                </div>
                                <div class="project-caption">CÉLINE</div>
                            </div>
                            <div class="project">
                                <div class="project-image">
                                    <img src="${getRandomImage()}" alt="Project Alpha">
                                </div>
                                <div class="project-caption">Project Alpha</div>
                            </div>
                            <div class="project">
                                <div class="project-image">
                                    <img src="${getRandomImage()}" alt="Project Beta">
                                </div>
                                <div class="project-caption">Project Beta</div>
                            </div>
                        </div>
                    </div>
                    <div id="projects-image">
                        <img src="${thirdImagePath}" alt="Projects Image">
                    </div>
                    <div id="project-right-column">
                        <!-- Non-selected project cards will be moved here -->
                    </div>
                </div>
                <div id="video" class="dark-section">
                    <div id="video-title-banner">
                        <div id="video-title-scroll">
                            <span>Experience AEX • Experience AEX • Experience AEX • Experience AEX • Experience AEX • </span>
                        </div>
                    </div>
                    <div id="video-content">
                        <video id="aex-video" controls autoplay muted loop preload="metadata" playsinline poster="">
                            <source src="" type="video/mp4">
                            <source src="" type="video/quicktime">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div id="video-title-banner">
                        <div id="video-title-scroll">
                            <span>Experience AEX • Experience AEX • Experience AEX • Experience AEX • Experience AEX • </span>
                        </div>
                    </div>
                </div>
                <div id="shop" style="display: none;">
                    <div id="shop-content">
                        <div id="shop-title">
                            <p>Shop our latest products</p>
                        </div>
                        <div id="shop-products">
                            <!-- Dynamic product cards will be inserted here by updateShopSection() -->
                        </div>
                    </div>
                </div>
                <div id="contact" class="dark-section">
                    <div id="contact-content">
                        <div class="contact-info">
                            <div class="contact-item">
                                <div class="contact-details">
                                    <h3>Email:<span> AlexanderEvansCo@gmail.com</span></h3>    
                                </div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-details">
                                    <h3>Phone:<span> +1 (347) 807-4826</span></h3>
                                </div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-details">
                                    <h3>Location:<span> New York, NY</span></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="copyright">
                        <p>&copy; 2025 Alexander Evans Experience. All rights reserved.</p>
                    </div>
                </div>
            </div>
        `,
        title: 'Home - AEX',
        description: 'Welcome to AEX'
    },
    '/about': {
        template: `
            <div class="page about-page">
                <header>
                    <h1>About AEX</h1>
                    <nav>
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/demo">Demo</a>
                    </nav>
                </header>
                
                <main>
                    <section class="about-content">
                        <h2>About Alexander Evans Experience</h2>
                        <p>This is a modern, routing-enabled web application built with vanilla JavaScript and Vite.</p>
                        <p>Features include:</p>
                        <ul>
                            <li>🚀 Fast client-side routing</li>
                            <li>🎨 Modern, responsive design</li>
                            <li>⚡ No framework dependencies</li>
                            <li>🔧 Easy to extend and customize</li>
                        </ul>
                    </section>
                </main>
            </div>
        `,
        title: 'About - AEX',
        description: 'About Alexander Evans Experience'
    },
    '/contact': {
        template: `
            <div class="page contact-page">
                <header>
                    <h1>Contact Us</h1>
                    <nav>
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/demo">Demo</a>
                    </nav>
                </header>
                
                <main>
                    <section class="contact-content">
                        <h2>Get in Touch</h2>
                        <p>Ready to start your next project? Let's talk!</p>
                        <div class="contact-info">
                            <p>📧 Email: hello@aex.com</p>
                            <p>📱 Phone: (555) 123-4567</p>
                            <p>📍 Location: San Francisco, CA</p>
                        </div>
                    </section>
                </main>
            </div>
        `,
        title: 'Contact - AEX',
        description: 'Contact Alexander Evans Experience'
    },
    '/demo': {
        template: `
            <div class="page demo-page">
                <header>
                    <h1>Routing Demo</h1>
                    <nav>
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/demo">Demo</a>
                    </nav>
                </header>
                
                <main>
                    <section class="demo-content">
                        <h2>Interactive Routing Demo</h2>
                        <p>This page demonstrates the routing system in action.</p>
                        
                        <div class="demo-buttons">
                            <button onclick="window.history.back()">← Go Back</button>
                            <button onclick="window.history.forward()">Go Forward →</button>
                            <button onclick="window.location.reload()">🔄 Reload Page</button>
                        </div>
                        
                        <div class="demo-info">
                            <h3>Current Route Info:</h3>
                            <p><strong>Path:</strong> <span id="currentPath">${window.location.pathname}</span></p>
                            <p><strong>Title:</strong> <span id="currentTitle">${document.title}</span></p>
                            <p><strong>Timestamp:</strong> <span id="timestamp">${new Date().toLocaleTimeString()}</span></p>
                        </div>
                        
                        <div class="demo-navigation">
                            <h3>Quick Navigation:</h3>
                            <div class="nav-grid">
                                <a href="/" class="nav-card">🏠 Home</a>
                                <a href="/about" class="nav-card">ℹ️ About</a>
                                <a href="/contact" class="nav-card">📞 Contact</a>
                                <a href="/demo" class="nav-card">🎯 Demo</a>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        `,
        title: 'Demo - AEX',
        description: 'Routing system demonstration'
    },
    '/gallery': {
        template: `
            <div class="page gallery-page">
                <header>
                    <h1>Image Gallery</h1>
                    <nav>
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/gallery">Gallery</a>
                        <a href="/contact">Contact</a>
                        <a href="/demo">Demo</a>
                    </nav>
                </header>
                
                <main>
                    <section class="gallery-content">
                        <div class="gallery-header">
                            <h2>All Images</h2>
                            <p>Click on any image to copy its S3 URL to your clipboard</p>
                        </div>
                        <div id="gallery-grid" class="gallery-grid">
                            <!-- Images will be dynamically loaded here -->
                        </div>
                    </section>
                </main>
            </div>
        `,
        title: 'Gallery - AEX',
        description: 'View all images from the Alexander Evans Experience collection'
    },
    '/404': {
        template: `
            <div class="page error-page">
                <header>
                    <h1>Page Not Found</h1>
                    <nav>
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/demo">Demo</a>
                    </nav>
                </header>
                
                <main>
                    <section class="error-content">
                        <h2>404 - Page Not Found</h2>
                        <p>The page you are looking for does not exist.</p>
                        <a href="/" class="btn">Go Home</a>
                    </section>
                </main>
            </div>
            `,
        title: 'Page Not Found - AEX',
        description: 'The page you are looking for does not exist'
    }
};

// Router class
class Router {
    constructor() {
        this.routes = routes;
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle initial route
        this.handleRoute();

        // Add click event listeners to navigation links
        this.setupNavigation();
    }

    async handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/404'];
        
        try {
            // Show loading state
            document.getElementById('app').innerHTML = '<div class="loading">Loading...</div>';
            
            // Small delay to show loading state (remove in production if not needed)
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Use inline template
            const html = route.template;
            
            // Update page content
            document.getElementById('app').innerHTML = html;
            
            // Update browser history
            if (this.currentRoute !== path) {
                window.history.pushState({}, '', path);
                this.currentRoute = path;
            }
            
            // Update page title
            document.title = route.title;
            
            // Update active navigation
            this.updateActiveNavigation(path);
            
            // Load page-specific JavaScript
            await this.loadPageScript(path);
            
            // Trigger route change event
            this.onRouteChange(path, route);
            
        } catch (error) {
            console.error('Error loading route:', error);
            // Load 404 page on error
            document.getElementById('app').innerHTML = this.routes['/404'].template;
        }
    }

    async loadPageScript(path) {
        // No page-specific scripts needed for now
        // Add component loading logic here when needed
    }

    setupNavigation() {
        // Add click event listeners to all navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="/"]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                this.navigate(href);
            }
        });
    }

    updateActiveNavigation(path) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    onRouteChange(path, route) {
        // Custom event for route changes
        const event = new CustomEvent('routeChange', {
            detail: { path, route }
        });
        window.dispatchEvent(event);
    }
}

// Export router instance
export const router = new Router();

// Export navigation function
export const navigate = (path) => router.navigate(path);
