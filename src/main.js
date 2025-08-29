import './style.css'
import { router } from './router.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// GSAP Configuration
gsap.config({
    nullTargetWarn: false,
    autoSleep: 60,
    force3D: true
});

// Global variable to store data from Google Script
let globalData = null;

// Export for use in other modules
export { router, gsap, getGlobalData, getGlobalDataByKey, refreshGlobalData, globalData };



// Image Random Scale and Translate Animation
function animateIntroImage() {
    const introImage = document.querySelector('#intro-image img');
    
    // Animate intro image
    if (introImage) {
        animateImage(introImage);
    }
    
    // Animate projects image
    const projectsImage = document.querySelector('#projects-image img');
    if (projectsImage) {
        animateImage(projectsImage);
    }
}

// Animate a single image with random scale and translate
function animateImage(imageElement) {
    
    // Enhanced scale distribution with more variation
    // 60% chance of normal scale (1-8), 30% chance of medium zoom (8-20), 10% chance of extreme zoom (20-40)
    let randomScale;
    const scaleRoll = Math.random();
    
    if (scaleRoll < 0.6) {
        // Normal scale range - more frequent, more variation
        randomScale = Math.random() * 7 + 1; // 1 to 8 (normal)
    } else if (scaleRoll < 0.9) {
        // Medium zoom range
        randomScale = Math.random() * 12 + 8; // 8 to 20 (medium)
    } else {
        // Extreme zoom range - rare but dramatic
        randomScale = Math.random() * 20 + 20; // 20 to 40 (extreme)
    }
    
    // Calculate translation based on scale - greater scale = greater translation
    let randomX, randomY;
    
    // Enhanced translation calculation with scale-based multipliers
    let baseTranslation;
    if (randomScale <= 8) {
        // Normal scale: moderate translation
        baseTranslation = randomScale * 150; // 150px per scale unit for normal range
    } else if (randomScale <= 20) {
        // Medium zoom: increased translation
        baseTranslation = randomScale * 200; // 200px per scale unit for medium zoom
    } else {
        // Extreme zoom: maximum dramatic translation
        baseTranslation = randomScale * 250; // 250px per scale unit for extreme zoom
    }
    
    // Cap maximum translation at 3000px for more dramatic movement
    const maxTranslation = Math.min(baseTranslation, 3000);
    
    // Apply the scale-proportional translation with enhanced randomness
    randomX = (Math.random() - 0.5) * maxTranslation * 2; // -maxTranslation to +maxTranslation
    randomY = (Math.random() - 0.5) * maxTranslation * 2;
    
    // Dynamic duration based on scale - larger scales get faster animations
    let randomDuration;
    if (randomScale <= 8) {
        randomDuration = Math.random() * 0.5 + 0.6; // 0.6-1.1 seconds for normal
    } else if (randomScale <= 20) {
        randomDuration = Math.random() * 0.4 + 0.4; // 0.4-0.8 seconds for medium
    } else {
        randomDuration = Math.random() * 0.3 + 0.3; // 0.3-0.6 seconds for extreme
    }
    
    // Animate the image
    gsap.to(imageElement, {
        scale: randomScale,
        x: randomX,
        y: randomY,
        duration: randomDuration,
        ease: "power3.out", // More dramatic easing
        onComplete: () => {
            // Schedule next animation with random delay
            const randomDelay = Math.random() * 800 + 600; // 0.6-1.4 seconds
            setTimeout(() => animateImage(imageElement), randomDelay);
        }
    });
}

// Initialize GSAP scrolling effects
        function initializeScrolling() {
            let isMenuSticky = false;
            let originalMenuPosition = null;
            let isAnimating = false;
            let lastScrollTime = 0;
            let currentTitleColor = 'white'; // Track current title color
    
                // Store original menu position when page loads
            setTimeout(() => {
                const menuItems = document.querySelector('#menu-items');
                if (menuItems) {
                    const rect = menuItems.getBoundingClientRect();
                    originalMenuPosition = rect.top + window.pageYOffset;
                }
                
                // Initialize hover colors for menu items (white state)
                const menuLinks = document.querySelectorAll('#menu-items button');
                menuLinks.forEach(item => {
                    item.addEventListener('mouseenter', () => {
                        item.style.setProperty('background-color', 'white', 'important');
                        item.style.setProperty('color', 'black', 'important');
                    });
                    item.addEventListener('mouseleave', () => {
                        item.style.setProperty('background-color', 'transparent', 'important');
                        item.style.setProperty('color', 'white', 'important');
                    });
                });
                
                // Initialize project card click functionality
                const projectCards = document.querySelectorAll('.project');
                projectCards.forEach(card => {
                    card.addEventListener('click', () => {
                        // Hide all other project cards
                        projectCards.forEach(otherCard => {
                            if (otherCard !== card) {
                                gsap.to(otherCard, {
                                    opacity: 0,
                                    scale: 0.8,
                                    duration: 0.3,
                                    ease: "power2.out",
                                    onComplete: () => {
                                        otherCard.style.display = 'none';
                                    }
                                });
                            }
                        });
                        
                        // Move card to projects section to keep it contained
                        const projectsSection = document.querySelector('#projects');
                        if (projectsSection) {
                            projectsSection.appendChild(card);
                        }
                        
                        // Animate selected card to top left of projects section
                        gsap.to(card, {
                            position: 'absolute',
                            top: '10%',
                            left: '0px', // Position at left edge of projects section
                            width: '300px', // Set fixed width when positioned
                            zIndex: 1000,
                            scale: 1,
                            rotation: -15,
                            duration: 0.2, // Faster, smoother animation
                            ease: "power1.out" // More linear, less dramatic easing
                        });
                    });
                });
            }, 100);
    
    // Throttled scroll handler to prevent rapid firing
    function handleScroll() {
        const now = Date.now();
        if (now - lastScrollTime < 16) return; // Throttle to ~60fps
        lastScrollTime = now;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const menuItems = document.querySelector('#menu-items');
        const introTitle = document.querySelector('h1#intro-title');
        
        if (menuItems && introTitle && originalMenuPosition) {
            // Calculate if menu should stick based on scroll position
            const menuReachedTop = scrollTop >= (originalMenuPosition - 32); // 32px = 2rem
            
            if (menuReachedTop && !isMenuSticky && !isAnimating) {
                // Make both menu items and title sticky with smooth transition
                isMenuSticky = true;
                isAnimating = true;
                
                // Kill any existing animations
                gsap.killTweensOf([introTitle, menuItems]);
                
                // Get current positions before moving
                const titleRect = introTitle.getBoundingClientRect();
                const menuRect = menuItems.getBoundingClientRect();
                
                // Store original properties for restoration
                introTitle.dataset.originalParent = 'intro-content';
                menuItems.dataset.originalParent = 'intro-content';
                
                // Move elements to body first
                document.body.appendChild(introTitle);
                document.body.appendChild(menuItems);
                
                // Apply initial fixed positioning at current location (no jump)
                introTitle.style.position = 'fixed';
                introTitle.style.top = titleRect.top + 'px';
                introTitle.style.left = titleRect.left + 'px';
                introTitle.style.width = titleRect.width + 'px';
                introTitle.style.zIndex = '10';
                introTitle.classList.add('sticky-title');
                
                menuItems.style.position = 'fixed';
                menuItems.style.top = menuRect.top + 'px';
                menuItems.style.left = menuRect.left + 'px';
                menuItems.style.width = menuRect.width + 'px';
                menuItems.style.zIndex = '10';
                menuItems.classList.add('sticky-menu');
                
                // Animate to final sticky positions
                gsap.to(introTitle, {
                    top: '5%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    duration: 0.2, // Shorter duration for fast scrolling
                    ease: "power2.out",
                    onComplete: () => {
                        isAnimating = false;
                    }
                });
                
                gsap.to(menuItems, {
                    top: 'calc(5% + 4rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    duration: 0.2, // Shorter duration for fast scrolling
                    ease: "power2.out"
                });
                
            } else if (!menuReachedTop && isMenuSticky && !isAnimating) {
                // Reset both menu items and title with smooth transition
                isMenuSticky = false;
                isAnimating = true;
                
                // Kill any existing animations
                gsap.killTweensOf([introTitle, menuItems]);
                
                // Get target positions in original container
                const introContent = document.querySelector('#intro-content');
                const tempTitle = introTitle.cloneNode(true);
                const tempMenu = menuItems.cloneNode(true);
                
                // Temporarily add clones to get target positions
                tempTitle.style.visibility = 'hidden';
                tempMenu.style.visibility = 'hidden';
                tempTitle.classList.remove('sticky-title');
                tempMenu.classList.remove('sticky-menu');
                
                if (introContent) {
                    introContent.appendChild(tempTitle);
                    introContent.appendChild(tempMenu);
                    
                    const targetTitleRect = tempTitle.getBoundingClientRect();
                    const targetMenuRect = tempMenu.getBoundingClientRect();
                    
                    // Remove temp clones
                    tempTitle.remove();
                    tempMenu.remove();
                    
                    // Animate to target positions
                    gsap.to(introTitle, {
                        top: targetTitleRect.top + 'px',
                        left: targetTitleRect.left + 'px',
                        transform: 'none',
                        duration: 0.2, // Shorter duration for fast scrolling
                        ease: "power2.out",
                        onComplete: () => {
                            // Move back to original parent after animation
                            if (introTitle.dataset.originalParent === 'intro-content') {
                                introContent.appendChild(introTitle);
                                delete introTitle.dataset.originalParent;
                            }
                            introTitle.classList.remove('sticky-title');
                            introTitle.style.position = '';
                            introTitle.style.top = '';
                            introTitle.style.left = '';
                            introTitle.style.transform = '';
                            introTitle.style.width = '';
                            introTitle.style.zIndex = '';
                            isAnimating = false;
                        }
                    });
                    
                    gsap.to(menuItems, {
                        top: targetMenuRect.top + 'px',
                        left: targetMenuRect.left + 'px',
                        transform: 'none',
                        duration: 0.2, // Shorter duration for fast scrolling
                        ease: "power2.out",
                        onComplete: () => {
                            // Move back to original parent after animation
                            if (menuItems.dataset.originalParent === 'intro-content') {
                                introContent.appendChild(menuItems);
                                delete menuItems.dataset.originalParent;
                            }
                            menuItems.classList.remove('sticky-menu');
                            menuItems.style.position = '';
                            menuItems.style.top = '';
                            menuItems.style.left = '';
                            menuItems.style.transform = '';
                            menuItems.style.width = '';
                            menuItems.style.zIndex = '';
                        }
                    });
                }
            }
            
            // Check which section is currently at the top to determine colors
            const sections = document.querySelectorAll('.dark-section, .light-section');
            let currentSectionType = 'light-section'; // Default to light section
            
            // Find which section is currently at the top
            for (let section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom > 100) {
                    currentSectionType = section.className.includes('dark-section') ? 'dark-section' : 'light-section';
                    break;
                }
            }
            
            // Debug logging
    
            
            // Change colors based on section type
            if (currentSectionType === 'dark-section') {
        
                const introTitle = document.querySelector('#intro-title');
                const menuItems = document.querySelectorAll('#menu-items button');
                
                if (introTitle) {
                    introTitle.style.setProperty('color', 'white', 'important');
                    currentTitleColor = 'white';
    
                }
                
                menuItems.forEach(item => {
                    item.style.setProperty('color', 'white', 'important');
                    // Set hover styles directly
                    item.addEventListener('mouseenter', () => {
                        item.style.setProperty('background-color', 'white', 'important');
                        item.style.setProperty('color', 'black', 'important');
                    });
                    item.addEventListener('mouseleave', () => {
                        item.style.setProperty('background-color', 'transparent', 'important');
                        item.style.setProperty('color', 'white', 'important');
                    });
                });

                
            } else {
        
                const introTitle = document.querySelector('#intro-title');
                const menuItems = document.querySelectorAll('#menu-items button');
                
                if (introTitle) {
                    introTitle.style.setProperty('color', 'black', 'important');
                    currentTitleColor = 'black';
    
                }
                
                menuItems.forEach(item => {
                    item.style.setProperty('color', 'black', 'important');
                    // Set hover styles directly
                    item.addEventListener('mouseenter', () => {
                        item.style.setProperty('background-color', 'black', 'important');
                        item.style.setProperty('color', 'white', 'important');
                    });
                    item.addEventListener('mouseleave', () => {
                        item.style.setProperty('background-color', 'transparent', 'important');
                        item.style.setProperty('color', 'black', 'important');
                    });
                });

            }
            
            // Only move title up if not sticky (when it's still in the normal flow)
            if (scrollTop > 0 && !isMenuSticky) {
                const maxTitleMove = windowHeight * 0.08; // Only move up 8% of screen height max
                const titleMoveDistance = Math.min(scrollTop * 0.1, maxTitleMove); // Slower movement rate
                gsap.set('h1#intro-title', {
                    y: -titleMoveDistance
                });
            } else if (scrollTop === 0) {
                // Reset title position when at top
                gsap.set('h1#intro-title', {
                    y: 0
                });
            }
        }
    }
    
    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);
}

// Handle ticket form submission
function handleTicketSubmission(e) {
    e.preventDefault();
    
    const ticketInput = document.querySelector('.ticket-input');
    const email = ticketInput.value.trim();
    
    if (!email) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Google Script URL - replace with your actual Google Script web app URL
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbz0h_vNoSDiAdIxMhGrENkVCaMvu9WjpGW3OBCXBoFpZ1Ho9VES6f2mhK134V1iBsnLJw/exec';
    
    // Prepare the data to send
    const formData = {
        email: email,
        timestamp: new Date().toISOString(),
        source: 'AEX Website',
        tab: 'AEXMain' // Specify which tab to add the data to
    };
    
    // Send data to Google Script
    fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Scripts
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then((response) => {
        // Since we're using no-cors, we can't read the response
        // But we can check if the request was sent
        console.log('Request sent to Google Script');
        
        // Success - clear the input and show confirmation
        ticketInput.value = '';
        alert('Thank you! Your ticket request has been submitted.');
    })
    .catch((error) => {
        console.error('Error submitting ticket request:', error);
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        alert('There was an error submitting your request. Please try again.');
    });
}

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fetch data from Google Script and save to global variable
async function fetchGlobalData() {
    try {
        // Google Script URL for fetching data - replace with your actual Google Script web app URL
        const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbz0h_vNoSDiAdIxMhGrENkVCaMvu9WjpGW3OBCXBoFpZ1Ho9VES6f2mhK134V1iBsnLJw/exec';
        
        console.log('Fetching data from Google Script...');
        
        const response = await fetch(googleScriptUrl, {
            method: 'GET',
            mode: 'cors', // Use CORS for GET requests
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Save data to global variable
        globalData = data;
        
        console.log('Data fetched successfully:', globalData);
        
        // Dispatch custom event to notify other parts of the app
        window.dispatchEvent(new CustomEvent('globalDataLoaded', { 
            detail: { data: globalData } 
        }));
        
        return globalData;
        
    } catch (error) {
        console.error('Error fetching global data:', error);
        
        // Set fallback data if fetch fails
        globalData = {
            shows: [
                {
                    id: 1,
                    name: "Fall/Winter 2026",
                    date: "09.12.2025",
                    time: "TBD",
                    location: "New York, NY",
                    ticketsAvailable: true
                }
            ],
            announcements: [
                "Welcome to Alexander Evans Experience",
                "New collection coming soon"
            ],
            lastUpdated: new Date().toISOString()
        };
        
        console.log('Using fallback data:', globalData);
        return globalData;
    }
}

// Function to get data from global variable
function getGlobalData() {
    return globalData;
}

// Function to get specific data by key
function getGlobalDataByKey(key) {
    return globalData ? globalData[key] : null;
}

// Function to refresh global data
async function refreshGlobalData() {
    console.log('Refreshing global data...');
    return await fetchGlobalData();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    
    // GSAP is now available globally
    window.gsap = gsap;
    
    // Fetch global data from Google Script
    fetchGlobalData();
    
    // Start the intro image animation after a short delay
    setTimeout(animateIntroImage, 1000);
    
    // Initialize GSAP scrolling effects
    initializeScrolling();
    
    // Set up navigation button event listeners with a small delay to ensure DOM is ready
    setTimeout(() => {
        const menuButtons = document.querySelectorAll('#menu-items button');
        console.log('Found menu buttons:', menuButtons.length);
        
        menuButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Get the data-section and find the corresponding section
                const sectionName = button.getAttribute('data-section');
                const targetSection = document.querySelector(`#${sectionName}`);
                
                console.log('Button clicked:', sectionName);
                console.log('Target section:', targetSection);
                
                if (targetSection) {
                    // Use native smooth scrolling as fallback
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Alternative: use GSAP if ScrollTo plugin is available
                    // if (gsap.plugins.ScrollToPlugin) {
                    //     gsap.to(window, {
                    //         duration: 1.5,
                    //         scrollTo: targetSection.offsetTop,
                    //         ease: "power2.inOut"
                    //     });
                    // }
                } else {
                    console.error('Section not found:', sectionName);
                }
            });
        });
        
        // Set up submit button event listener for ticket form
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', handleTicketSubmission);
        }
    }, 100);
    
    // Listen for route changes
    window.addEventListener('routeChange', (event) => {
        console.log('Route changed to:', event.detail.path);
        // Add any global route change logic here
        
        // Set up submit button event listener after route change
        setTimeout(() => {
            const submitBtn = document.querySelector('.submit-btn');
            if (submitBtn) {
                // Remove existing event listener to prevent duplicates
                submitBtn.removeEventListener('click', handleTicketSubmission);
                submitBtn.addEventListener('click', handleTicketSubmission);
            }
        }, 100);
    });
});

// Image Zoom and Movement