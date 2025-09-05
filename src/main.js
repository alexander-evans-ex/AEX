// ----- Imports -----
import './style.css'
import { router } from './router.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getRandomImage } from './imageManifest.js' // Import image manifest and getRandomImage function

// ----- GSAP Setup -----
gsap.registerPlugin(ScrollTrigger);
gsap.config({
    nullTargetWarn: false,
    autoSleep: 60,
    force3D: true
});

// ----- Google Apps Script Endpoints -----
const GAS_GET_URL  = 'https://script.google.com/macros/s/AKfycbwJu-tbfbnDHf8Sc0EOnn6Gv48UtYg8RpYtCkkqqdBuvoPm74hQygix5SBicVYFBu3zrw/exec';
const GAS_POST_URL = 'https://script.google.com/macros/s/AKfycbwJu-tbfbnDHf8Sc0EOnn6Gv48UtYg8RpYtCkkqqdBuvoPm74hQygix5SBicVYFBu3zrw/exec';

// ----- Global App Data -----
let globalData = null;

// ------------------------------
// Image Random Scale and Translate Animation
// ------------------------------
function animateIntroImage() {
    const introImage = document.querySelector('#intro-image img');
  if (introImage) animateImage(introImage);

    const projectsImage = document.querySelector('#projects-image img');
  if (projectsImage) animateImage(projectsImage);
}

function animateImage(imageElement) {
    let randomScale;
    const scaleRoll = Math.random();
    
    if (scaleRoll < 0.8) {
    randomScale = Math.random() * 7 + 1;     // 1–8
    } else if (scaleRoll < 0.95) {
    randomScale = Math.random() * 12 + 8;    // 8–20
    } else {
    randomScale = Math.random() * 20 + 20;   // 20–40
    }
    
    let baseTranslation;
    if (randomScale <= 8) {
    baseTranslation = randomScale * 150;
    } else if (randomScale <= 20) {
    baseTranslation = randomScale * 200;
    } else {
    baseTranslation = randomScale * 250;
    }
    
    const maxTranslation = Math.min(baseTranslation, 3000);
  const randomX = (Math.random() - 0.5) * maxTranslation * 2;
  const randomY = (Math.random() - 0.5) * maxTranslation * 2;
    
    let randomDuration;
    if (randomScale <= 8) {
    randomDuration = Math.random() * 0.5 + 0.6; // 0.6–1.1s
    } else if (randomScale <= 20) {
    randomDuration = Math.random() * 0.4 + 0.4; // 0.4–0.8s
    } else {
    randomDuration = Math.random() * 0.3 + 0.3; // 0.3–0.6s
    }
    
    gsap.to(imageElement, {
        scale: randomScale,
        x: randomX,
        y: randomY,
        duration: randomDuration,
    ease: 'power3.out',
        onComplete: () => {
      const randomDelay = Math.random() * 800 + 600; // 0.6–1.4s
            setTimeout(() => animateImage(imageElement), randomDelay);
        }
    });
}

// ------------------------------
// Scrolling / Sticky Menu + Title
// ------------------------------
        function initializeScrolling() {
            let isMenuSticky = false;
            let originalMenuPosition = null;
            let isAnimating = false;
            let lastScrollTime = 0;
  let currentTitleColor = 'white';
    
            setTimeout(() => {
                const menuItems = document.querySelector('#menu-items');
                if (menuItems) {
                    const rect = menuItems.getBoundingClientRect();
                    originalMenuPosition = rect.top + window.pageYOffset;
                }
                
    // Init hover colors (white state)
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
                
    // Project card click behavior
                const rightColumn = document.querySelector('#project-right-column');
                
                function resetCardStyles(card) {
                    // Reset all GSAP transforms and inline styles
                    gsap.set(card, {
                        clearProps: "all"
                    });
                    card.style.cssText = '';
                    card.classList.remove('moving-to-column');
                }
                
                function setupProjectCardClick(card) {
                    card.addEventListener('click', () => {
                        // Check if this card is already in the right column
                        const isInRightColumn = card.parentElement === rightColumn;
                        
                        if (isInRightColumn) {
                            // If clicking a card in the right column, move it to main position
                            const projectsSection = document.querySelector('#projects');
                            if (projectsSection) {
                                // Reset the card styles first
                                resetCardStyles(card);
                                projectsSection.appendChild(card);
                                
                                // Move all other cards to right column
                                const allCards = document.querySelectorAll('.project');
                                allCards.forEach(otherCard => {
                                    if (otherCard !== card) {
                                        resetCardStyles(otherCard);
                                        rightColumn.appendChild(otherCard);
                                    }
                                });
                                
                                // Animate the selected card to top-left
                                gsap.to(card, {
                                    position: 'absolute',
                                    top: '10%',
                                    left: '0px',
                                    width: '300px',
                                    zIndex: 1000,
                                    scale: 1,
                                    rotation: -15,
                                    duration: 0.2,
                                    ease: 'power1.out'
                                });
                            }
                        } else {
                            // If clicking a card in the main grid, move others to right column
                            const allCards = document.querySelectorAll('.project');
                            allCards.forEach(otherCard => {
                                if (otherCard !== card) {
                                    // Reset styles first
                                    resetCardStyles(otherCard);
                                    
                                    // Add moving class for animation
                                    otherCard.classList.add('moving-to-column');
                                    
                                    gsap.to(otherCard, {
                                        opacity: 0,
                                        scale: 0.8,
                                        duration: 0.3,
                                        ease: 'power2.out',
                                        onComplete: () => {
                                            // Move to right column
                                            rightColumn.appendChild(otherCard);
                                            rightColumn.classList.add('active');
                                            
                                            // Reset and animate in
                                            otherCard.style.display = 'block';
                                            otherCard.style.opacity = '0';
                                            otherCard.style.transform = 'translateX(20px)';
                                            
                                            gsap.to(otherCard, {
                                                opacity: 1,
                                                x: 0,
                                                duration: 0.5,
                                                ease: 'power2.out'
                                            });
                                        }
                                    });
                                }
                            });
                            
                            // Move selected card to top-left
                            const projectsSection = document.querySelector('#projects');
                            if (projectsSection) {
                                resetCardStyles(card);
                                projectsSection.appendChild(card);
                                
                                gsap.to(card, {
                                    position: 'absolute',
                                    top: '10%',
                                    left: '0px',
                                    width: '300px',
                                    zIndex: 1000,
                                    scale: 1,
                                    rotation: -15,
                                    duration: 0.2,
                                    ease: 'power1.out'
                                });
                            }
                        }
                    });
                }
                
                // Setup click handlers for all project cards
                const projectCards = document.querySelectorAll('.project');
                projectCards.forEach(setupProjectCardClick);
            }, 100);
    
    function handleScroll() {
        const now = Date.now();
    if (now - lastScrollTime < 16) return;
        lastScrollTime = now;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const menuItems = document.querySelector('#menu-items');
        const introTitle = document.querySelector('h1#intro-title');
        
        if (menuItems && introTitle && originalMenuPosition) {
      const menuReachedTop = scrollTop >= (originalMenuPosition - 32);
            
            if (menuReachedTop && !isMenuSticky && !isAnimating) {
                isMenuSticky = true;
                isAnimating = true;
                gsap.killTweensOf([introTitle, menuItems]);
                
                const titleRect = introTitle.getBoundingClientRect();
                const menuRect = menuItems.getBoundingClientRect();
                
                introTitle.dataset.originalParent = 'intro-content';
                menuItems.dataset.originalParent = 'intro-content';
                
                document.body.appendChild(introTitle);
                document.body.appendChild(menuItems);
                
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
                
                gsap.to(introTitle, {
                    top: '5%',
                    left: '50%',
                    transform: 'translateX(-50%)',
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => { isAnimating = false; }
                });
                
                gsap.to(menuItems, {
                    top: 'calc(5% + 4rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
          duration: 0.2,
          ease: 'power2.out'
                });
                
            } else if (!menuReachedTop && isMenuSticky && !isAnimating) {
                isMenuSticky = false;
                isAnimating = true;
                gsap.killTweensOf([introTitle, menuItems]);
                
                const introContent = document.querySelector('#intro-content');
                const tempTitle = introTitle.cloneNode(true);
                const tempMenu = menuItems.cloneNode(true);
                
                tempTitle.style.visibility = 'hidden';
                tempMenu.style.visibility = 'hidden';
                tempTitle.classList.remove('sticky-title');
                tempMenu.classList.remove('sticky-menu');
                
                if (introContent) {
                    introContent.appendChild(tempTitle);
                    introContent.appendChild(tempMenu);
                    
                    const targetTitleRect = tempTitle.getBoundingClientRect();
                    const targetMenuRect = tempMenu.getBoundingClientRect();
                    
                    tempTitle.remove();
                    tempMenu.remove();
                    
                    gsap.to(introTitle, {
                        top: targetTitleRect.top + 'px',
                        left: targetTitleRect.left + 'px',
                        transform: 'none',
            duration: 0.2,
            ease: 'power2.out',
                        onComplete: () => {
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
            duration: 0.2,
            ease: 'power2.out',
                        onComplete: () => {
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
            
      // Section-aware color switching
            const sections = document.querySelectorAll('.dark-section, .light-section');
      let currentSectionType = 'light-section';
            for (let section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom > 100) {
                    currentSectionType = section.className.includes('dark-section') ? 'dark-section' : 'light-section';
                    break;
                }
            }
            
            if (currentSectionType === 'dark-section') {
        const title = document.querySelector('#intro-title');
        const items = document.querySelectorAll('#menu-items button');
        if (title) {
          title.style.setProperty('color', 'white', 'important');
                    currentTitleColor = 'white';
                }
        items.forEach(item => {
                    item.style.setProperty('color', 'white', 'important');
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
        const title = document.querySelector('#intro-title');
        const items = document.querySelectorAll('#menu-items button');
        if (title) {
          title.style.setProperty('color', 'black', 'important');
                    currentTitleColor = 'black';
                }
        items.forEach(item => {
                    item.style.setProperty('color', 'black', 'important');
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
            
      // Title parallax (only when not sticky)
            if (scrollTop > 0 && !isMenuSticky) {
        const maxTitleMove = windowHeight * 0.08;
        const titleMoveDistance = Math.min(scrollTop * 0.1, maxTitleMove);
        gsap.set('h1#intro-title', { y: -titleMoveDistance });
            } else if (scrollTop === 0) {
        gsap.set('h1#intro-title', { y: 0 });
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);
}

// ------------------------------
// Ticket Form Submission (POST) — keep working flow
// ------------------------------
function handleTicketSubmission(e) {
    e.preventDefault();
    
    const ticketInput = document.querySelector('.ticket-input');
    const email = ticketInput.value.trim();
    
  if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    const formData = {
    email,
        timestamp: new Date().toISOString(),
        source: 'AEX Website',
    tab: 'AEXMain'
    };
    
  // keep no-cors so we don’t break the existing successful flow
  fetch(GAS_POST_URL, {
        method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
  .then(() => {
        console.log('Request sent to Google Script');
        ticketInput.value = '';
        alert('Thank you! Your ticket request has been submitted.');
    })
    .catch((error) => {
        console.error('Error submitting ticket request:', error);
        alert('There was an error submitting your request. Please try again.');
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ------------------------------
// Fetch + Global Data Utilities
// ------------------------------
// Check if we're in development mode
function isDevelopmentMode() {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.port === '5173';
}

// CORS proxy service to handle cross-origin requests
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Test function to check if Google Apps Script is accessible
async function testGoogleScript() {
  console.log('Testing Google Apps Script accessibility...');
  console.log('Script URL:', GAS_GET_URL);
  
  try {
    const proxyUrl = CORS_PROXY + encodeURIComponent(GAS_GET_URL);
    console.log('Using CORS proxy:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get response as text first
    const responseText = await response.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));
    
    // Check if it's HTML
    if (responseText.trim().toLowerCase().startsWith('<!doctype') || 
        responseText.trim().toLowerCase().startsWith('<html')) {
      console.error('❌ Google Apps Script returned HTML instead of JSON');
      console.error('This means the script is not properly deployed or accessible');
      throw new Error('Script returned HTML - check deployment settings');
    }

    const data = JSON.parse(responseText);
    console.log('✅ Google Apps Script is accessible via CORS proxy');
    console.log('Test response:', data);
    return data;
  } catch (error) {
    console.error('❌ Google Apps Script test failed:', error);
    throw error;
  }
}

async function fetchGlobalData() {
  try {
        console.log('Fetching data from Google Script...');
    console.log('Original URL:', GAS_GET_URL);

    // Use CORS proxy to handle cross-origin requests
    const proxyUrl = CORS_PROXY + encodeURIComponent(GAS_GET_URL);
    console.log('Using CORS proxy:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
        'Accept': 'application/json'
            }
        });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
    // Get the response as text first to see what we're actually getting
    const responseText = await response.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));
    
    // Check if it's HTML (error page)
    if (responseText.trim().toLowerCase().startsWith('<!doctype') || 
        responseText.trim().toLowerCase().startsWith('<html')) {
      console.error('❌ Received HTML instead of JSON. This usually means:');
      console.error('1. Google Apps Script is not deployed as a web app');
      console.error('2. The script URL is incorrect');
      console.error('3. The script requires authentication');
      console.error('4. The script is returning an error page');
      
      throw new Error('Google Apps Script returned HTML instead of JSON. Check deployment settings.');
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON:', parseError);
      console.error('Response content:', responseText);
      throw new Error('Invalid JSON response from Google Apps Script');
    }

    console.log('✅ Data fetched successfully via CORS proxy');
    return processFetchedData(data);
        
    } catch (error) {
        console.error('Error fetching global data:', error);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if Google Apps Script is deployed as a web app');
    console.log('2. Verify deployment is set to "Anyone" access');
    console.log('3. Test the script URL directly in browser');
    console.log('4. Check if the CORS proxy service is working');
    console.log('5. Verify the script URL is correct and accessible');
    throw error;
  }
}

function processFetchedData(data) {
  // Check for error status from the new script
  if (data.__status && data.__status >= 400) {
    throw new Error(`Server error: ${data.message || 'Unknown error'}`);
  }

  // Expected shape: { main, data, shows, projects, products, lastUpdated, version, __status? }
        globalData = {
    main:      Array.isArray(data.main) ? data.main : [],
    data:      Array.isArray(data.data) ? data.data : [],
    shows:     Array.isArray(data.shows) ? data.shows : [],
    projects:  Array.isArray(data.projects) ? data.projects : [],
    products:  Array.isArray(data.products) ? data.products : [],
    lastUpdated: data.lastUpdated || new Date().toISOString(),
    version:     data.version || 'unknown',
    status:      data.__status || 200
  };
        
        console.log('Data fetched successfully:', globalData);
  console.log('Server status:', data.__status || 200);
  
  // Console out the database object for debugging
  console.log('=== DATABASE OBJECT ===');
  console.log('Raw data from server:', data);
  console.log('Processed globalData:', globalData);
  console.log('Main data:', globalData.main);
  console.log('Data section:', globalData.data);
  console.log('Shows data:', globalData.shows);
  console.log('Projects data:', globalData.projects);
  console.log('Products data:', globalData.products);
  console.log('Last updated:', globalData.lastUpdated);
  console.log('Version:', globalData.version);
  console.log('======================');

  // Notify listeners
  window.dispatchEvent(new CustomEvent('globalDataLoaded', { detail: { data: globalData } }));
        
        return globalData;
}

function useFallbackData() {
  // Enhanced fallback data matching the new schema structure
        globalData = {
    main: [
      {
        title: "Welcome to AEX",
        content: "Experience the future of design"
      }
    ],
    data: [
      {
        mainSection: "Welcome to Alexander Evans Experience",
        mainSectionImages: ["image1.jpg", "image2.jpg"],
        vid1: "https://alexanderevansexs.s3.us-east-2.amazonaws.com/videos/RECAP-4.mov",
        vid2: "https://example.com/video2.mp4", 
        vid3: "https://example.com/video3.mp4",
        aboutInfo: "Innovative design and craftsmanship"
      }
    ],
            shows: [
                {
        showId: "show_001",
        showActive: true,
        showImage: "show1.jpg",
        showName: "Fall/Winter 2026",
        showDesc: "The latest collection showcasing innovative design and craftsmanship",
        showDate: "09.12.2025",
        showTime: "TBD",
        showLocation: "New York, NY"
      },
      {
        showId: "show_002", 
        showActive: false,
        showImage: "show2.jpg",
        showName: "Spring/Summer 2026",
        showDesc: "Upcoming collection - stay tuned for more details",
        showDate: "03.15.2026",
        showTime: "TBD",
        showLocation: "Los Angeles, CA"
      }
    ],
          projects: [
        {
          projectId: "proj_001",
          projectImage: "http://localhost:5173/src/assets/images/Alexander_Evans_Experience_1.webp",
          projectName: "Project Alpha",
          projectText: "Innovative design project showcasing modern aesthetics",
          projectVideo: "https://example.com/project1.mp4",
          projectImages: ["proj1_img1.jpg", "proj1_img2.jpg"],
          projectActive: true
        },
        {
          projectId: "proj_002",
          projectImage: "http://localhost:5173/src/assets/images/Alexander_Evans_Experience_2.jpg",
          projectName: "Project Beta",
          projectText: "A collaborative project focusing on sustainable design practices",
          projectVideo: "https://example.com/project2.mp4",
          projectImages: ["proj2_img1.jpg", "proj2_img2.jpg"],
          projectActive: true
        },
        {
          projectId: "proj_003",
          projectImage: "http://localhost:5173/src/assets/images/Alexander_Evans_Experience_3.webp",
          projectName: "Project Gamma",
          projectText: "An architectural project blending modern aesthetics with traditional elements",
          projectVideo: "https://example.com/project3.mp4",
          projectImages: ["proj3_img1.jpg", "proj3_img2.jpg"],
          projectActive: true
        },
        {
          projectId: "proj_004",
          projectImage: "http://localhost:5173/src/assets/images/Alexander_Evans_Experience_4.webp",
          projectName: "Project Delta",
          projectText: "A digital design project exploring interactive user experiences",
          projectVideo: "https://example.com/project4.mp4",
          projectImages: ["proj4_img1.jpg", "proj4_img2.jpg"],
          projectActive: true
        },
        {
          projectId: "proj_005",
          projectImage: "http://localhost:5173/src/assets/images/Alexander_Evans_Experience_5.webp",
          projectName: "Project Epsilon",
          projectText: "A furniture design project emphasizing ergonomics and functionality",
          projectVideo: "https://example.com/project5.mp4",
          projectImages: ["proj5_img1.jpg", "proj5_img2.jpg"],
          projectActive: true
        },
        {
          projectId: "proj_006",
          projectImage: "http://localhost:5173/src/assets/images/Alexander_Evans_Experience_6.webp",
          projectName: "Project Zeta",
          projectText: "An experimental design project exploring new materials and techniques",
          projectVideo: "https://example.com/project6.mp4",
          projectImages: ["proj6_img1.jpg", "proj6_img2.jpg"],
          projectActive: true
        }
      ],
    products: [
      {
        productId: "prod_001",
        productActive: true,
        imageUrl: "product1.jpg",
        productName: "Product Beta",
        productDesc: "High-quality design product",
        productPrice: 299,
        productSizes: ["S", "M", "L"],
        productQty: 50,
        stripeProductId: "stripe_prod_001"
      }
    ],
    lastUpdated: new Date().toISOString(),
    version: 'fallback',
    status: 200
        };
        
        console.log('Using fallback data:', globalData);
  
  // Console out the fallback database object for debugging
  console.log('=== FALLBACK DATABASE OBJECT ===');
  console.log('Fallback globalData:', globalData);
  console.log('Fallback main data:', globalData.main);
  console.log('Fallback data section:', globalData.data);
  console.log('Fallback shows data:', globalData.shows);
  console.log('Fallback projects data:', globalData.projects);
  console.log('Fallback products data:', globalData.products);
  console.log('Fallback last updated:', globalData.lastUpdated);
  console.log('Fallback version:', globalData.version);
  console.log('================================');
  
  // Still notify listeners with fallback data
  window.dispatchEvent(new CustomEvent('globalDataLoaded', { detail: { data: globalData, isFallback: true } }));
  
        return globalData;
}

function getGlobalData() {
    return globalData;
}

function getGlobalDataByKey(key) {
    return globalData ? globalData[key] : null;
}

async function refreshGlobalData() {
    console.log('Refreshing global data...');
    return await fetchGlobalData();
}

// Convenience typed getters (optional)
function getShows()    { return (globalData && globalData.shows)    || []; }
function getProjects() { return (globalData && globalData.projects) || []; }
function getProducts() { return (globalData && globalData.products) || []; }
function getMain()     { return (globalData && globalData.main)     || []; }
function getData()     { return (globalData && globalData.data)     || []; }

// ------------------------------
// Dynamic Shows Section Update
// ------------------------------
function updateShowsSection() {
  console.log('=== updateShowsSection called ===');
  const shows = getShows();
  const showsSection = document.querySelector('#shows');
  
  console.log('Debug info:', {
    shows: shows,
    showsLength: shows.length,
    showsSection: showsSection,
    showsSectionExists: !!showsSection,
    globalData: globalData,
    globalDataExists: !!globalData,
    showsData: globalData ? globalData.shows : 'No globalData',
    showsDataLength: globalData && globalData.shows ? globalData.shows.length : 0
  });
  
  if (!showsSection) {
    console.error('❌ Shows section not found in DOM');
    console.log('Available sections:', document.querySelectorAll('[id]'));
        return;
    }

  if (!shows.length) {
    console.log('❌ No shows data available');
    return;
  }

  console.log('✅ Shows section found and shows data available');

  // Find the existing showCard container or create one
  let showCardsContainer = showsSection.querySelector('.show-cards-container');
  if (!showCardsContainer) {
    showCardsContainer = document.createElement('div');
    showCardsContainer.className = 'show-cards-container';
    showCardsContainer.style.cssText = `
      display: flex;
      flex-direction: row;
      gap: 2rem;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 1rem 0;
      margin-top: 4rem;
      scroll-behavior: smooth;
    `;
    
    // Insert after the shows title
    const showsTitle = showsSection.querySelector('#shows-title');
    if (showsTitle) {
      showsTitle.insertAdjacentElement('afterend', showCardsContainer);
    }
  }

  // Clear existing show cards (but preserve the title)
  showCardsContainer.innerHTML = '';

  // Create show cards for each active show
  console.log('Processing shows:', shows);
  console.log('Total shows found:', shows.length);
  let activeShowsCount = 0;
  
  shows.forEach((show, index) => {
    console.log(`Processing show ${index}:`, show);
    console.log(`Show active status: ${show.showActive} (type: ${typeof show.showActive})`);
    
    if (!show.showActive) {
      console.log(`Skipping show ${index} - not active`);
      return; // Only show active shows
    }
    
    console.log(`Creating card for active show: ${show.showName}`);
    const showCard = createShowCard(show);
    showCardsContainer.appendChild(showCard);
    activeShowsCount++;
  });

  console.log(`✅ Updated shows section with ${activeShowsCount} active shows`);
}

function createShowCard(show) {
  console.log('Creating show card for:', show);
  const showCard = document.createElement('div');
  showCard.className = 'showCard';
  showCard.setAttribute('data-show-id', show.showId);
  
  // Add styling for horizontal layout
  showCard.style.cssText = `
    min-width: 300px;
    max-width: 350px;
    flex-shrink: 0;
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-right: 1rem;
  `;
  
  // Get a random image for the show from show.showImage or fallback to random image
  let randomImage;
  if (show.showImage && show.showImage.trim()) {
    // Split comma-separated image URLs and select a random one
    const imageUrls = show.showImage.split(',').map(url => url.trim()).filter(url => url);
    console.log('=== SHOW IMAGE DEBUG ===');
    console.log('Show name:', show.showName);
    console.log('Show image data:', show.showImage);
    console.log('Split image URLs:', imageUrls);
    console.log('Number of URLs:', imageUrls.length);
    
    if (imageUrls.length > 0) {
      // Check if the URL is a full URL or just a filename
      const firstUrl = imageUrls[0];
      if (firstUrl.startsWith('http') || firstUrl.startsWith('/')) {
        // It's a full URL, use random selection
        const timestamp = Date.now();
        const randomSeed = (timestamp + Math.random() * 1000) % 1;
        const randomIndex = Math.floor(randomSeed * imageUrls.length);
        randomImage = imageUrls[randomIndex];
        console.log('Using full URL from show data:', randomImage);
      } else {
        // It's just a filename, use fallback random image
        randomImage = getRandomImage();
        console.log('Show image is just a filename, using fallback random image:', randomImage);
      }
    } else {
      randomImage = getRandomImage();
      console.log('No valid image URLs in show data, using fallback random image:', randomImage);
    }
  } else {
    randomImage = getRandomImage();
    console.log('No show image data available, using fallback random image:', randomImage);
  }
  
  // Format the date properly
  let formattedDate = show.showDate;
  if (show.showDate && show.showDate !== 'TBD') {
    try {
      const date = new Date(show.showDate);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    } catch (e) {
      console.log('Date formatting error:', e);
    }
  }
  
  // Format the time properly
  let formattedTime = show.showTime;
  if (show.showTime && show.showTime !== 'TBD') {
    try {
      const time = new Date(show.showTime);
      if (!isNaN(time.getTime())) {
        formattedTime = time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    } catch (e) {
      console.log('Time formatting error:', e);
    }
  }
  
  showCard.innerHTML = `
    <h3>${show.showName || 'Show Name'}</h3>
    <p>${show.showDesc || 'Show description'}</p>
    <p>Show Date: ${formattedDate || 'TBD'}</p>
    <p>Show Time: ${formattedTime || 'TBD'}</p>
    <p>Show Location: ${show.showLocation || 'TBD'}</p>
    <div id="shows-content">
      <img id="shows-image" src="${randomImage}" alt="${show.showName || 'Show Image'}">
    </div>
    <div class="showsCta">
      <p>Reserve a ticket</p>
      <input type="email" placeholder="Enter your email" class="ticket-input">
      <button type="submit" class="submit-btn">Submit</button>
    </div>
  `;

  // Add event listeners for the email submission in this specific card
  const submitBtn = showCard.querySelector('.submit-btn');
  const ticketInput = showCard.querySelector('.ticket-input');
  
  if (submitBtn && ticketInput) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleTicketSubmissionForShow(e, show.showId);
    });
  }

  return showCard;
}

function handleTicketSubmissionForShow(e, showId) {
  e.preventDefault();
  
  const showCard = e.target.closest('.showCard');
  const ticketInput = showCard.querySelector('.ticket-input');
  const email = ticketInput.value.trim();

  if (!email || !isValidEmail(email)) {
    alert('Please enter a valid email address');
        return;
    }

  const formData = {
    email,
    timestamp: new Date().toISOString(),
    source: 'AEX Website',
    tab: 'AEXMain',
    showId: showId
  };

  // Use the same POST logic as the original
  fetch(GAS_POST_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(() => {
    console.log('Ticket request sent to Google Script for show:', showId);
    ticketInput.value = '';
    alert('Thank you! Your ticket request has been submitted.');
  })
  .catch((error) => {
    console.error('Error submitting ticket request:', error);
    alert('There was an error submitting your request. Please try again.');
  });
}

// ------------------------------
// Dynamic Projects Section Update
// ------------------------------
function updateProjectsSection() {
  console.log('=== updateProjectsSection called ===');
  const projects = getProjects();
  const projectsSection = document.querySelector('#projects');
  
  console.log('Projects debug info:', {
    projects: projects,
    projectsLength: projects.length,
    projectsSection: projectsSection,
    projectsSectionExists: !!projectsSection,
    globalData: globalData,
    globalDataExists: !!globalData,
    projectsData: globalData ? globalData.projects : 'No globalData',
    projectsDataLength: globalData && globalData.projects ? globalData.projects.length : 0
  });
  
  if (!projectsSection) {
    console.error('❌ Projects section not found in DOM');
    console.log('Available sections:', document.querySelectorAll('[id]'));
    return;
  }

  if (!projects.length) {
    console.log('❌ No projects data available');
    return;
  }

  console.log('✅ Projects section found and projects data available');

  // Find the existing projectsGrid or create one
  let projectsGrid = projectsSection.querySelector('#projectsGrid');
  if (!projectsGrid) {
    projectsGrid = document.createElement('div');
    projectsGrid.id = 'projectsGrid';
    projectsGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
    `;
    
    // Insert after the projects content
    const projectsContent = projectsSection.querySelector('#projects-content');
    if (projectsContent) {
      projectsContent.insertAdjacentElement('afterend', projectsGrid);
    }
  }

  // Clear existing project cards
  projectsGrid.innerHTML = '';

  // Create project cards for each active project
  console.log('Processing projects:', projects);
  console.log('Total projects found:', projects.length);
  let activeProjectsCount = 0;
  
  projects.forEach((project, index) => {
    console.log(`Processing project ${index}:`, project);
    console.log(`Project active status: ${project.projectActive} (type: ${typeof project.projectActive})`);
    
    console.log(`Creating card for project: ${project.projectName}`);
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
    activeProjectsCount++;
  });

  console.log(`✅ Updated projects section with ${activeProjectsCount} projects`);
  
  // Re-setup click handlers for the new project cards
  setupProjectCardClickHandlers();
}

function createProjectCard(project) {
  console.log('Creating project card for:', project);
  const projectCard = document.createElement('div');
  projectCard.className = 'project';
  projectCard.setAttribute('data-project-id', project.projectId);
  
  // Get project image from projectImage field or use fallback
  let projectImage;
  console.log('=== PROJECT IMAGE DEBUG ===');
  console.log('Project name:', project.projectName);
  console.log('Project image data:', project.projectImage);
  console.log('Project image type:', typeof project.projectImage);
  
  if (project.projectImage && project.projectImage.trim()) {
    const imageUrl = project.projectImage.trim();
    console.log('Trimmed image URL:', imageUrl);
    console.log('Starts with http:', imageUrl.startsWith('http'));
    console.log('Starts with /:', imageUrl.startsWith('/'));
    
    // Check if it's a full URL or just a filename
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      projectImage = imageUrl;
      console.log('✅ Using project image URL:', projectImage);
    } else {
      projectImage = getRandomImage();
      console.log('❌ Project image is just a filename, using fallback random image:', projectImage);
    }
  } else {
    projectImage = getRandomImage();
    console.log('❌ No project image data available, using fallback random image:', projectImage);
  }
  
  projectCard.innerHTML = `
    <div class="project-image">
      <img src="${projectImage}" alt="${project.projectName || 'Project Image'}">
    </div>
    <div class="project-caption">${project.projectName || 'Project Name'}</div>
  `;

  return projectCard;
}

function setupProjectCardClickHandlers() {
  const rightColumn = document.querySelector('#project-right-column');
  
  function resetCardStyles(card) {
    // Reset all GSAP transforms and inline styles
    gsap.set(card, {
      clearProps: "all"
    });
    card.style.cssText = '';
    card.classList.remove('moving-to-column');
  }
  
  function setupProjectCardClick(card) {
    card.addEventListener('click', () => {
      // Get the project data from the card's data attribute
      const projectId = card.getAttribute('data-project-id');
      const project = globalData && globalData.projects ? 
        globalData.projects.find(p => p.projectId === projectId) : null;
      
      if (!project) {
        console.log('Project data not found for ID:', projectId);
        return;
      }
      
      // Display project details
      displayProjectDetails(project);
      
      // Check if this card is already in the right column
      const isInRightColumn = card.parentElement === rightColumn;
      
      if (isInRightColumn) {
        // If clicking a card in the right column, move it to main position
        const projectsSection = document.querySelector('#projects');
        if (projectsSection) {
          // Reset the card styles first
          resetCardStyles(card);
          projectsSection.appendChild(card);
          
          // Move all other cards to right column
          const allCards = document.querySelectorAll('.project');
          allCards.forEach(otherCard => {
            if (otherCard !== card) {
              resetCardStyles(otherCard);
              rightColumn.appendChild(otherCard);
            }
          });
          
          // Animate the selected card to top-left
          gsap.to(card, {
            position: 'absolute',
            top: '10%',
            left: '0px',
            width: '300px',
            zIndex: 1000,
            scale: 1,
            rotation: -15,
            duration: 0.2,
            ease: 'power1.out'
          });
        }
      } else {
        // If clicking a card in the main grid, move others to right column
        const allCards = document.querySelectorAll('.project');
        allCards.forEach(otherCard => {
          if (otherCard !== card) {
            // Reset styles first
            resetCardStyles(otherCard);
            
            // Add moving class for animation
            otherCard.classList.add('moving-to-column');
            
            gsap.to(otherCard, {
              opacity: 0,
              scale: 0.8,
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => {
                // Move to right column
                rightColumn.appendChild(otherCard);
                rightColumn.classList.add('active');
                
                // Reset and animate in
                otherCard.style.display = 'block';
                otherCard.style.opacity = '0';
                otherCard.style.transform = 'translateX(20px)';
                
                gsap.to(otherCard, {
                  opacity: 1,
                  x: 0,
                  duration: 0.5,
                  ease: 'power2.out'
                });
              }
            });
          }
        });
        
        // Move selected card to top-left
        const projectsSection = document.querySelector('#projects');
        if (projectsSection) {
          resetCardStyles(card);
          projectsSection.appendChild(card);
          
          gsap.to(card, {
            position: 'absolute',
            top: '10%',
            left: '0px',
            width: '300px',
            zIndex: 1000,
            scale: 1,
            rotation: -15,
            duration: 0.2,
            ease: 'power1.out'
          });
        }
      }
    });
  }
  
  // Setup click handlers for all project cards
  const projectCards = document.querySelectorAll('.project');
  projectCards.forEach(setupProjectCardClick);
}

// Helper function to show project image when video fails
function showProjectImageFallback(project) {
  const projectMedia = document.querySelector('.project-media');
  if (projectMedia && project.projectImage) {
    let imageUrl = project.projectImage;
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      imageUrl = getRandomImage();
    }
    
    // Replace video with image
    projectMedia.innerHTML = `
      <img src="${imageUrl}" alt="${project.projectName}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;">
    `;
    console.log('Showing project image fallback:', imageUrl);
  }
}

function displayProjectDetails(project) {
  console.log('Displaying project details for:', project);
  
  // Remove any existing project detail display
  const existingDetail = document.querySelector('#project-detail-display');
  if (existingDetail) {
    existingDetail.remove();
  }
  
  // Create the project detail display
  const detailDisplay = document.createElement('div');
  detailDisplay.id = 'project-detail-display';
  detailDisplay.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 800px;
    max-height: 80vh;
    z-index: 100;
    overflow-y: auto;
    padding: 2rem;
    font-family: 'Courier New', Courier, monospace;
    background: transparent;
    color: white;
  `;
  
  // Determine what media to show (video first, then image)
  let mediaContent = '';
  
  // Check if video URL is valid (more comprehensive check)
  const isValidVideoUrl = project.projectVideo && 
    project.projectVideo.trim() && 
    (project.projectVideo.startsWith('http') || 
     project.projectVideo.startsWith('/') || 
     project.projectVideo.startsWith('data:') ||
     project.projectVideo.includes('.mp4') ||
     project.projectVideo.includes('.webm') ||
     project.projectVideo.includes('.mov') ||
     project.projectVideo.includes('youtube.com') ||
     project.projectVideo.includes('youtu.be') ||
     project.projectVideo.includes('vimeo.com'));
  
  if (isValidVideoUrl) {
    // Show video if available
    mediaContent = `
      <div class="project-media" style="width: 100%; margin-bottom: 1.5rem; position: relative;">
        <video id="project-video" controls autoplay muted loop preload="metadata" style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;" 
               onloadstart="console.log('Video loading:', this.src);"
               oncanplay="console.log('Video can play:', this.src);"
               onerror="console.log('Video error:', this.error, 'Code:', this.error?.code); this.style.display='none'; this.nextElementSibling.style.display='block'; showProjectImageFallback(project);"
               onloadeddata="console.log('Video data loaded successfully');"
               onstalled="console.log('Video stalled, trying to recover'); this.load();">
          <source src="${project.projectVideo}" type="video/mp4">
          <source src="${project.projectVideo}" type="video/webm">
          <source src="${project.projectVideo}" type="video/quicktime">
          <div id="video-fallback" style="display: none; color: white; text-align: center; padding: 2rem; background: rgba(0,0,0,0.5); border-radius: 8px;">
            Video unavailable - showing image instead<br>
            <small style="font-size: 12px; opacity: 0.7;">This video may have encoding issues or be inaccessible</small>
          </div>
          Your browser does not support the video tag.
        </video>
        <button id="sound-toggle" style="
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: normal;
          font-family: 'Courier New', Courier, monospace;
          text-transform: none;
          z-index: 101;
        ">Sound Off</button>
      </div>
    `;
  } else if (project.projectImage && project.projectImage.trim()) {
    // Show image if no video or video is invalid
    let imageUrl = project.projectImage;
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      imageUrl = getRandomImage();
    }
    mediaContent = `
      <div class="project-media" style="width: 100%; margin-bottom: 1.5rem;">
        <img src="${imageUrl}" alt="${project.projectName}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;">
      </div>
    `;
  } else {
    // Fallback to random image if no valid media
    mediaContent = `
      <div class="project-media" style="width: 100%; margin-bottom: 1.5rem;">
        <img src="${getRandomImage()}" alt="${project.projectName}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;">
      </div>
    `;
  }
  
  // Handle projectImages array if available
  let additionalImages = '';
  if (project.projectImages) {
    // Parse projectImages - it could be a string (comma-separated) or already an array
    let imageArray = [];
    if (typeof project.projectImages === 'string') {
      // Split by comma and clean up whitespace
      imageArray = project.projectImages.split(',').map(img => img.trim()).filter(img => img);
    } else if (Array.isArray(project.projectImages)) {
      imageArray = project.projectImages.filter(img => img && img.trim());
    }
    
    if (imageArray.length > 0) {
      additionalImages = `
        <div class="additional-images" style="margin-top: 1rem;">
          <h4 style="margin-bottom: 1rem; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); text-transform: none;">Additional Images</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: flex-start;">
            ${imageArray.map((img, index) => `
              <div style="flex: 0 0 auto; width: 100px; height: 80px;">
                <img src="${img.startsWith('http') || img.startsWith('/') ? img : getRandomImage()}" 
                     alt="Project image" 
                     class="thumbnail-image"
                     data-full-image="${img.startsWith('http') || img.startsWith('/') ? img : getRandomImage()}"
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid rgba(255,255,255,0.3); transition: transform 0.2s ease; display: block;">
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }
  
  detailDisplay.innerHTML = `
    <div style="position: relative;">
      
      ${mediaContent}
      
      <div class="project-info" style="color: white; line-height: 1.6;">
        <p style="font-size: 1.1rem; margin-bottom: 1rem; text-align: left; color: #ccc; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); text-transform: none;">
          ${project.projectText || 'No description available'}
        </p>
        
        
        ${additionalImages}
      </div>
    </div>
  `;
  
  // Hide the projects content text when detail is open
  const projectsContent = document.querySelector('#projects-content p');
  if (projectsContent) {
    projectsContent.style.display = 'none';
  }
  
  // Add to projects section
  const projectsSection = document.querySelector('#projects');
  if (projectsSection) {
    projectsSection.appendChild(detailDisplay);
    
    // Scroll window to projects section
    projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Add sound toggle functionality
  const soundToggle = detailDisplay.querySelector('#sound-toggle');
  const video = detailDisplay.querySelector('#project-video');
  
  if (soundToggle && video) {
    soundToggle.addEventListener('click', () => {
      if (video.muted) {
        video.muted = false;
        soundToggle.textContent = 'Sound On';
        soundToggle.style.color = 'white';
      } else {
        video.muted = true;
        soundToggle.textContent = 'Sound Off';
        soundToggle.style.color = 'white';
      }
    });
    
    // Try direct src assignment as fallback for MP4s
    if (project.projectVideo && project.projectVideo.includes('.mp4')) {
      video.src = project.projectVideo;
      video.load(); // Force reload with new src
    }
    
    // Add timeout fallback - if video doesn't load within 5 seconds, show image
    const videoTimeout = setTimeout(() => {
      if (video.readyState < 2) { // HAVE_CURRENT_DATA
        console.log('Video timeout - falling back to image');
        video.style.display = 'none';
        const fallbackDiv = video.nextElementSibling;
        if (fallbackDiv) {
          fallbackDiv.style.display = 'block';
        }
        // Also show the project image
        showProjectImageFallback(project);
      }
    }, 5000);
    
    // Clear timeout if video loads successfully
    video.addEventListener('loadeddata', () => {
      clearTimeout(videoTimeout);
    });
    
    video.addEventListener('canplay', () => {
      clearTimeout(videoTimeout);
    });
  }
  
  // Add thumbnail popup functionality
  const thumbnailImages = detailDisplay.querySelectorAll('.thumbnail-image');
  thumbnailImages.forEach(thumb => {
    // Add hover effects
    thumb.addEventListener('mouseenter', () => {
      thumb.style.transform = 'scale(1.05)';
    });
    
    thumb.addEventListener('mouseleave', () => {
      thumb.style.transform = 'scale(1)';
    });
    
    // Add click functionality
    thumb.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event bubbling
      const imageUrl = thumb.src; // Use the actual thumbnail image source
      
      // Get all thumbnail images to create navigation
      const allThumbnails = Array.from(document.querySelectorAll('.thumbnail-image'));
      const currentIndex = allThumbnails.indexOf(thumb);
      
      // Create overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      `;
      
      // Create navigation container
      const navContainer = document.createElement('div');
      navContainer.style.cssText = `
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      `;
      
      // Create previous arrow
      const prevArrow = document.createElement('div');
      prevArrow.innerHTML = '‹';
      prevArrow.style.cssText = `
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 40px;
        color: white;
        cursor: pointer;
        z-index: 3001;
        background: transparent;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s ease;
        user-select: none;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      `;
      
      // Create next arrow
      const nextArrow = document.createElement('div');
      nextArrow.innerHTML = '›';
      nextArrow.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 40px;
        color: white;
        cursor: pointer;
        z-index: 3001;
        background: transparent;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s ease;
        user-select: none;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      `;
      
      // Create image
      const fullImage = document.createElement('img');
      fullImage.src = imageUrl;
      fullImage.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        cursor: default;
      `;
      
      // Create image counter
      const counter = document.createElement('div');
      counter.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        background: rgba(0, 0, 0, 0.7);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 3001;
      `;
      counter.textContent = `${currentIndex + 1} / ${allThumbnails.length}`;
      
      // Track current image index
      let currentImageIndex = currentIndex;
      
      // Navigation function
      function showImage(index) {
        if (index >= 0 && index < allThumbnails.length) {
          currentImageIndex = index;
          const newImageUrl = allThumbnails[index].src;
          fullImage.src = newImageUrl;
          counter.textContent = `${index + 1} / ${allThumbnails.length}`;
          
          // Update arrow visibility
          prevArrow.style.display = index > 0 ? 'flex' : 'none';
          nextArrow.style.display = index < allThumbnails.length - 1 ? 'flex' : 'none';
        }
      }
      
      // Arrow event listeners
      prevArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentImageIndex > 0) {
          showImage(currentImageIndex - 1);
        }
      });
      
      nextArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentImageIndex < allThumbnails.length - 1) {
          showImage(currentImageIndex + 1);
        }
      });
      
      // Hover effects for arrows
      prevArrow.addEventListener('mouseenter', () => {
        prevArrow.style.opacity = '0.7';
      });
      prevArrow.addEventListener('mouseleave', () => {
        prevArrow.style.opacity = '1';
      });
      
      nextArrow.addEventListener('mouseenter', () => {
        nextArrow.style.opacity = '0.7';
      });
      nextArrow.addEventListener('mouseleave', () => {
        nextArrow.style.opacity = '1';
      });
      
      // Keyboard navigation
      function handleKeyPress(e) {
        if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
          showImage(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight' && currentImageIndex < allThumbnails.length - 1) {
          showImage(currentImageIndex + 1);
        } else if (e.key === 'Escape') {
          overlay.remove();
          document.removeEventListener('keydown', handleKeyPress);
        }
      }
      
      // Assemble overlay
      navContainer.appendChild(prevArrow);
      navContainer.appendChild(nextArrow);
      navContainer.appendChild(fullImage);
      navContainer.appendChild(counter);
      overlay.appendChild(navContainer);
      document.body.appendChild(overlay);
      
      // Set initial arrow visibility
      showImage(currentIndex);
      
      // Add keyboard listener
      document.addEventListener('keydown', handleKeyPress);
      
      // Close on background click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === navContainer) {
          overlay.remove();
          document.removeEventListener('keydown', handleKeyPress);
        }
      });
      
      // Prevent image from closing the popup
      fullImage.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  });
  
  // Close on background click
  detailDisplay.addEventListener('click', (e) => {
    if (e.target === detailDisplay) {
      // Show the projects content text again
      const projectsContent = document.querySelector('#projects-content p');
      if (projectsContent) {
        projectsContent.style.display = 'block';
      }
      detailDisplay.remove();
    }
  });
  
  // Animate in
  gsap.fromTo(detailDisplay, 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
  );
}

// ------------------------------
// Dynamic Shop Section Update
// ------------------------------
function updateShopSection() {
  console.log('=== updateShopSection called ===');
  const products = getProducts();
  const shopSection = document.querySelector('#shop');
  
  console.log('Shop debug info:', {
    products: products,
    productsLength: products.length,
    shopSection: shopSection,
    shopSectionExists: !!shopSection,
    globalData: globalData,
    globalDataExists: !!globalData,
    productsData: globalData ? globalData.products : 'No globalData',
    productsDataLength: globalData && globalData.products ? globalData.products.length : 0
  });
  
  if (!shopSection) {
    console.error('❌ Shop section not found in DOM');
    console.log('Available sections:', document.querySelectorAll('[id]'));
    return;
  }

  if (!products.length) {
    console.log('❌ No products data available - hiding shop section');
    shopSection.style.display = 'none';
    return;
  }

  console.log('✅ Shop section found and products data available');

  // Find the shop products container
  const shopProductsContainer = shopSection.querySelector('#shop-products');
  if (!shopProductsContainer) {
    console.error('❌ Shop products container not found');
    return;
  }

  // Clear existing product cards
  shopProductsContainer.innerHTML = '';

  // Create product cards for each active product
  console.log('Processing products:', products);
  let activeProductsCount = 0;
  
  products.forEach((product, index) => {
    console.log(`Processing product ${index}:`, product);
    console.log(`Product active status: ${product.productActive} (type: ${typeof product.productActive})`);
    console.log(`Boolean conversion: ${Boolean(product.productActive)}`);
    console.log(`Strict false check: ${product.productActive === false}`);
    
    if (!product.productActive) {
      console.log(`Skipping product ${index} - not active`);
      return; // Only show active products
    }
    
    console.log(`Creating card for active product: ${product.productName}`);
    const productCard = createProductCard(product);
    shopProductsContainer.appendChild(productCard);
    activeProductsCount++;
  });

  // Show or hide shop section based on active products count
  console.log(`Total products: ${products.length}, Active products: ${activeProductsCount}`);
  if (activeProductsCount > 0) {
    shopSection.style.display = 'block';
    console.log(`✅ Updated shop section with ${activeProductsCount} active products`);
  } else {
    shopSection.style.display = 'none';
    console.log('❌ No active products - hiding shop section');
  }
}

// ------------------------------
// Dynamic Video Section Update
// ------------------------------
function updateVideoSection() {
  console.log('=== updateVideoSection called ===');
  const data = getData();
  const video = document.querySelector('#aex-video');
  
  console.log('Video section debug info:', {
    data: data,
    dataLength: data.length,
    video: video,
    videoExists: !!video,
    globalData: globalData,
    globalDataExists: !!globalData
  });
  
  if (!video) {
    console.error('❌ Video element not found in DOM');
    return;
  }
  
  let videoUrl = null;
  
  // Try to get video URL from data first
  if (data.length > 0) {
    const mainData = data[0];
    videoUrl = mainData.vid1;
    console.log('Video URL from getData():', videoUrl);
  }
  
  // Fallback to globalData if getData() doesn't work
  if (!videoUrl && globalData && globalData.data && globalData.data.length > 0) {
    const mainData = globalData.data[0];
    videoUrl = mainData.vid1;
    console.log('Video URL from globalData:', videoUrl);
  }
  
  if (videoUrl && videoUrl.trim()) {
    console.log('✅ Setting video source to:', videoUrl);
    
    // Update both source elements
    const sources = video.querySelectorAll('source');
    console.log('Found sources:', sources.length);
    
    sources.forEach((source, index) => {
      console.log(`Updating source ${index}:`, source);
      source.src = videoUrl.trim();
    });
    
    // Load the new source
    video.load();
    console.log('Video load() called');
  } else {
    console.log('❌ No video URL found in vid1 field');
  }
}

function createProductCard(product) {
  console.log('Creating product card for:', product);
  const productCard = document.createElement('div');
  productCard.className = 'shop-product';
  productCard.setAttribute('data-product-id', product.productId);
  
  // Use the product's image URL or fallback to random image
  let productImage;
  console.log('Product data for image:', {
    productId: product.productId,
    productName: product.productName,
    imageUrl: product.imageUrl,
    allProductKeys: Object.keys(product)
  });
  
  if (product.imageUrl && product.imageUrl.trim()) {
    const imageUrl = product.imageUrl.trim();
    // Check if the URL is a full URL or just a filename
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      productImage = imageUrl;
      console.log('Using full product image URL:', productImage);
    } else {
      productImage = getRandomImage();
      console.log('Product image is just a filename, using fallback random image:', productImage);
    }
  } else {
    productImage = getRandomImage();
    console.log('No product image URL available, using fallback random image:', productImage);
    console.log('Available product fields:', Object.keys(product));
  }
  
  // Format the price
  let formattedPrice = 'Price TBD';
  if (product.productPrice && product.productPrice > 0) {
    formattedPrice = `$${product.productPrice}`;
  }
  
  // Format sizes if available
  let sizesText = '';
  if (product.productSizes && product.productSizes.length > 0) {
    sizesText = `<p>Sizes: ${product.productSizes.join(', ')}</p>`;
  }
  
  productCard.innerHTML = `
    <img src="${productImage}" alt="${product.productName || 'Product Image'}">
    <p>${product.productName || 'Product Name'}</p>
    <p>${product.productDesc || 'Product Description'}</p>
    <p>${formattedPrice}</p>
    ${sizesText}
    <button class="shop-btn" data-product-id="${product.productId}">Shop Now</button>
  `;

  // Add event listener for the shop button
  const shopBtn = productCard.querySelector('.shop-btn');
  if (shopBtn) {
    shopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleProductClick(e, product);
    });
  }

  return productCard;
}

function handleProductClick(e, product) {
  console.log('Product clicked:', product);
  
  // You can implement different actions here:
  // 1. Redirect to a product page
  // 2. Open a modal with product details
  // 3. Add to cart functionality
  // 4. Redirect to Stripe checkout if stripeProductId is available
  
  if (product.stripeProductId) {
    // If you have Stripe integration, redirect to checkout
    console.log('Redirecting to Stripe checkout for product:', product.stripeProductId);
    // window.location.href = `https://checkout.stripe.com/pay/${product.stripeProductId}`;
    alert(`Redirecting to checkout for ${product.productName}...`);
  } else {
    // For now, just show an alert
    alert(`You clicked on ${product.productName}!\nPrice: $${product.productPrice || 'TBD'}\n\nThis would normally redirect to a product page or checkout.`);
  }
}

// ------------------------------
// App Init
// ------------------------------
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    
  // GSAP global (if needed elsewhere)
    window.gsap = gsap;
    
  // Load data from Apps Script
  fetchGlobalData().catch(error => {
    console.error('Failed to load data from Google Apps Script:', error);
    console.error('Please check your Google Apps Script deployment and CORS configuration.');
  });

  // Make test functions available globally for debugging
  window.testGoogleScript = testGoogleScript;
  window.fetchGlobalData = fetchGlobalData;
  window.updateShowsSection = updateShowsSection;
  window.updateShopSection = updateShopSection;
  window.updateProjectsSection = updateProjectsSection;
  window.regenerateShowCards = () => {
    console.log('Manually regenerating show cards...');
    updateShowsSection();
  };
  
  window.debugShowCards = () => {
    console.log('=== DEBUGGING SHOW CARDS ===');
    console.log('Global data:', globalData);
    console.log('Shows from getShows():', getShows());
    console.log('Shows section exists:', !!document.querySelector('#shows'));
    console.log('Show cards container exists:', !!document.querySelector('.show-cards-container'));
    console.log('Existing show cards:', document.querySelectorAll('.showCard').length);
    updateShowsSection();
  };
  
  window.debugProductCards = () => {
    console.log('=== DEBUGGING PRODUCT CARDS ===');
    console.log('Global data:', globalData);
    console.log('Products from getProducts():', getProducts());
    console.log('Shop section exists:', !!document.querySelector('#shop'));
    console.log('Existing product cards:', document.querySelectorAll('.shop-product').length);
    updateShopSection();
  };
  
  window.debugProjectCards = () => {
    console.log('=== DEBUGGING PROJECT CARDS ===');
    console.log('Global data exists:', !!globalData);
    console.log('Global data keys:', globalData ? Object.keys(globalData) : 'No globalData');
    console.log('Projects in globalData:', globalData ? globalData.projects : 'No globalData');
    console.log('Projects from getProjects():', getProjects());
    console.log('Projects section exists:', !!document.querySelector('#projects'));
    console.log('Projects grid exists:', !!document.querySelector('#projectsGrid'));
    console.log('Existing project cards:', document.querySelectorAll('.project').length);
    console.log('Project cards in grid:', document.querySelectorAll('#projectsGrid .project').length);
    
    if (globalData && globalData.projects) {
      console.log('All projects data:', globalData.projects);
      console.log('Projects length:', globalData.projects.length);
      console.log('First project details:', globalData.projects[0]);
    } else {
      console.log('No projects data in globalData');
      console.log('Available data keys:', globalData ? Object.keys(globalData) : 'No globalData');
    }
    updateProjectsSection();
  };
  
  window.debugGoogleScriptProjects = async () => {
    console.log('=== DEBUGGING GOOGLE SCRIPT PROJECTS ===');
    try {
      const response = await fetch(CORS_PROXY + GOOGLE_SCRIPT_URL);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Raw Google Script response:', data);
      console.log('Projects in response:', data.projects);
      console.log('Projects length:', data.projects ? data.projects.length : 0);
      if (data.projects) {
        console.log('First project:', data.projects[0]);
        console.log('All project names:', data.projects.map(p => p.projectName));
        console.log('All project images:', data.projects.map(p => p.projectImage));
      }
    } catch (error) {
      console.error('Error fetching from Google Script:', error);
    }
  };
  
  window.forceLoadFromScript = async () => {
    console.log('=== FORCING LOAD FROM GOOGLE SCRIPT ===');
    try {
      await fetchGlobalData();
      console.log('Fresh data loaded from script');
      console.log('New globalData:', globalData);
      updateProjectsSection();
    } catch (error) {
      console.error('Error loading from script:', error);
    }
  };
  
  window.checkDataSource = () => {
    console.log('=== CHECKING DATA SOURCE ===');
    console.log('Current globalData:', globalData);
    console.log('Is this fallback data?', globalData && globalData.projects && globalData.projects[0] && globalData.projects[0].projectImage === 'test');
    console.log('Projects data:', globalData ? globalData.projects : 'No projects');
    if (globalData && globalData.projects) {
      console.log('First project image:', globalData.projects[0].projectImage);
      console.log('All project images:', globalData.projects.map(p => p.projectImage));
    }
  };
  
  window.forceProjectsUpdate = () => {
    console.log('=== FORCING PROJECTS UPDATE ===');
    console.log('Current globalData:', globalData);
    if (globalData && globalData.projects) {
      console.log('Projects in globalData:', globalData.projects);
      updateProjectsSection();
    } else {
      console.log('No projects in globalData, trying to fetch fresh data...');
      fetchGlobalData().then(() => {
        console.log('Fresh data fetched, updating projects...');
        updateProjectsSection();
      });
    }
  };
  
  window.testProjectImages = () => {
    console.log('=== TESTING PROJECT IMAGES ===');
    if (globalData && globalData.projects) {
      globalData.projects.forEach((project, index) => {
        console.log(`Project ${index}:`, {
          name: project.projectName,
          imageUrl: project.projectImage,
          imageType: typeof project.projectImage,
          startsWithHttp: project.projectImage ? project.projectImage.startsWith('http') : false,
          startsWithSlash: project.projectImage ? project.projectImage.startsWith('/') : false
        });
      });
    } else {
      console.log('No projects data available');
    }
  };
  
  window.makeAllShowsActive = () => {
    console.log('=== MAKING ALL SHOWS ACTIVE ===');
    if (globalData && globalData.shows) {
      globalData.shows.forEach(show => {
        show.showActive = true;
        console.log('Made show active:', show.showName);
      });
      updateShowsSection();
    }
  };
  
  window.makeAllProjectsActive = () => {
    console.log('=== MAKING ALL PROJECTS ACTIVE ===');
    if (globalData && globalData.projects) {
      globalData.projects.forEach(project => {
        project.projectActive = true;
        console.log('Made project active:', project.projectName);
      });
      updateProjectsSection();
    }
  };
  
  window.testAllCards = () => {
    console.log('=== TESTING ALL CARDS ===');
    console.log('Testing show cards...');
    debugShowCards();
    console.log('Testing product cards...');
    debugProductCards();
    console.log('Testing project cards...');
    debugProjectCards();
  };
  
  window.debugProjectCards = () => {
    console.log('=== DEBUGGING PROJECT CARDS ===');
    console.log('Global data:', globalData);
    console.log('Projects from getProjects():', getProjects());
    console.log('Projects section exists:', !!document.querySelector('#projects'));
    console.log('Projects grid exists:', !!document.querySelector('#projectsGrid'));
    console.log('Existing project cards:', document.querySelectorAll('.project').length);
    console.log('Project cards in grid:', document.querySelectorAll('#projectsGrid .project').length);
    
    if (globalData && globalData.projects) {
      console.log('All projects data:', globalData.projects);
      console.log('Active projects:', globalData.projects.filter(p => p.projectActive));
    }
  };
  
  window.refreshDataFromGoogle = async () => {
    console.log('Manually refreshing data from Google Apps Script...');
    try {
      await fetchGlobalData();
      console.log('Data refreshed successfully');
      updateShowsSection();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };
  
  window.testVideoUpdate = () => {
    console.log('Manually testing video update...');
    updateVideoSection();
  };
  
  window.forceVideoUpdate = () => {
    console.log('=== FORCING VIDEO UPDATE ===');
    const video = document.querySelector('#aex-video');
    if (!video) {
      console.error('Video element not found');
      return;
    }
    
    console.log('Current video src:', video.src);
    console.log('Current video currentSrc:', video.currentSrc);
    
    const data = getData();
    let videoUrl = null;
    
    console.log('getData() result:', data);
    
    if (data.length > 0) {
      videoUrl = data[0].vid1;
      console.log('Video URL from getData():', videoUrl);
    } else if (globalData && globalData.data && globalData.data.length > 0) {
      videoUrl = globalData.data[0].vid1;
      console.log('Video URL from globalData:', videoUrl);
    }
    
    console.log('Final video URL to set:', videoUrl);
    console.log('Is this the RECAP video?', videoUrl && videoUrl.includes('RECAP-4.mov'));
    
    if (videoUrl) {
      // Direct approach - set the video src directly
      video.src = videoUrl;
      video.load();
      console.log('Video src set directly to:', videoUrl);
      console.log('New video src after setting:', video.src);
      
      // Also update sources
      const sources = video.querySelectorAll('source');
      sources.forEach((source, index) => {
        console.log(`Source ${index} before:`, source.src);
        source.src = videoUrl;
        console.log(`Source ${index} after:`, source.src);
      });
      console.log('Updated', sources.length, 'source elements');
    }
  };
  
  // Test function to check random image selection
  window.testRandomImageSelection = () => {
    const testString = "http://localhost:5173/src/assets/images/Alexander_Evans_Experience_79.jpg, http://localhost:5173/src/assets/images/Alexander_Evans_Experience_68.jpg, http://localhost:5173/src/assets/images/Alexander_Evans_Experience_53.jpg";
    const imageUrls = testString.split(',').map(url => url.trim()).filter(url => url);
    console.log('Testing with your string:', testString);
    console.log('Split URLs:', imageUrls);
    
    for (let i = 0; i < 5; i++) {
      const timestamp = Date.now();
      const randomSeed = (timestamp + Math.random() * 1000) % 1;
      const randomIndex = Math.floor(randomSeed * imageUrls.length);
      console.log(`Test ${i + 1}: Index ${randomIndex} -> ${imageUrls[randomIndex]}`);
    }
  };
  
  // Debug function to check shows data
  window.debugShowsData = () => {
    const shows = getShows();
    console.log('=== SHOWS DATA DEBUG ===');
    console.log('Total shows:', shows.length);
    console.log('All shows data:', shows);
    
    shows.forEach((show, index) => {
      console.log(`Show ${index}:`, {
        showId: show.showId,
        showName: show.showName,
        showActive: show.showActive,
        showActiveType: typeof show.showActive,
        showImage: show.showImage
      });
    });
    
    const activeShows = shows.filter(show => show.showActive);
    console.log('Active shows:', activeShows.length);
    console.log('Active shows data:', activeShows);
  };
  
  // Debug function to check raw global data
  window.debugGlobalData = () => {
    console.log('=== GLOBAL DATA DEBUG ===');
    console.log('Global data exists:', !!globalData);
    console.log('Full global data:', globalData);
    
    if (globalData) {
      console.log('Shows in global data:', globalData.shows);
      console.log('Shows length:', globalData.shows ? globalData.shows.length : 'undefined');
      console.log('Products in global data:', globalData.products);
      console.log('Products length:', globalData.products ? globalData.products.length : 'undefined');
      console.log('All data keys:', Object.keys(globalData));
    }
  };
  
  // Debug function to check products data specifically
  window.debugProductsData = () => {
    const products = getProducts();
    console.log('=== PRODUCTS DATA DEBUG ===');
    console.log('Total products:', products.length);
    console.log('All products data:', products);
    
    products.forEach((product, index) => {
      console.log(`Product ${index}:`, {
        productId: product.productId,
        productName: product.productName,
        productActive: product.productActive,
        imageUrl: product.imageUrl,
        productPrice: product.productPrice,
        allKeys: Object.keys(product)
      });
    });
  };
  
  // Debug function to check video data specifically
  window.debugVideoData = () => {
    const data = getData();
    console.log('=== VIDEO DATA DEBUG ===');
    console.log('Total data entries:', data.length);
    console.log('All data:', data);
    
    if (data.length > 0) {
      const mainData = data[0];
      console.log('First data entry:', mainData);
      console.log('vid1 field:', mainData.vid1);
      console.log('All keys in first entry:', Object.keys(mainData));
    }
    
    // Also check global data directly
    console.log('Global data directly:', globalData);
    if (globalData && globalData.data) {
      console.log('Global data.data:', globalData.data);
    }
  };
  
  // Debug function to check raw Google Apps Script response
  window.debugGoogleScriptResponse = async () => {
    console.log('=== GOOGLE SCRIPT RESPONSE DEBUG ===');
    try {
      console.log('Fetching fresh data from Google Apps Script...');
      const response = await fetch(CORS_PROXY + encodeURIComponent(GAS_GET_URL), {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response length:', responseText.length);
      console.log('Raw response (first 1000 chars):', responseText.substring(0, 1000));
      
      const data = JSON.parse(responseText);
      console.log('Parsed data:', data);
      console.log('Shows in response:', data.shows);
      console.log('Shows length in response:', data.shows ? data.shows.length : 'undefined');
      console.log('Data in response:', data.data);
      console.log('Data length in response:', data.data ? data.data.length : 'undefined');
      
      if (data.data && data.data.length > 0) {
        console.log('First data entry:', data.data[0]);
        console.log('vid1 field:', data.data[0].vid1);
      }
      
      if (data.shows && data.shows.length > 0) {
        console.log('All shows details:');
        data.shows.forEach((show, index) => {
          console.log(`Show ${index}:`, show);
        });
      }
      
    } catch (error) {
      console.error('Error fetching from Google Script:', error);
    }
  };
  
  // Debug function to test direct Google Script access (without CORS proxy)
  window.testDirectGoogleScript = async () => {
    console.log('=== TESTING DIRECT GOOGLE SCRIPT ACCESS ===');
    try {
      console.log('Testing direct access to:', GAS_GET_URL);
      const response = await fetch(GAS_GET_URL, {
        method: 'GET',
        mode: 'no-cors'
      });
      
      console.log('Direct response status:', response.status);
      console.log('Direct response type:', response.type);
      
    } catch (error) {
      console.error('Direct access error:', error);
    }
  };
  
  // Debug function to check the complete data flow
  window.debugCompleteDataFlow = async () => {
    console.log('=== COMPLETE DATA FLOW DEBUG ===');
    
    // Step 1: Check current global data
    console.log('1. Current global data:');
    console.log('Global data exists:', !!globalData);
    if (globalData) {
      console.log('Shows in global data:', globalData.shows);
      console.log('Shows length:', globalData.shows ? globalData.shows.length : 'undefined');
    }
    
    // Step 2: Check what getShows() returns
    console.log('2. getShows() result:');
    const shows = getShows();
    console.log('getShows() result:', shows);
    console.log('getShows() length:', shows.length);
    
    // Step 3: Fetch fresh data and process it
    console.log('3. Fetching and processing fresh data...');
    try {
      const freshData = await fetchGlobalData();
      console.log('Fresh data processed:', freshData);
      console.log('Fresh shows:', freshData.shows);
      console.log('Fresh shows length:', freshData.shows ? freshData.shows.length : 'undefined');
      
      // Step 4: Check getShows() again
      console.log('4. getShows() after fresh data:');
      const freshShows = getShows();
      console.log('Fresh getShows() result:', freshShows);
      console.log('Fresh getShows() length:', freshShows.length);
      
    } catch (error) {
      console.error('Error in data flow:', error);
    }
  };

  // Listen for when global data is loaded to update sections
  window.addEventListener('globalDataLoaded', (event) => {
    console.log('Global data loaded event received:', event.detail);
    console.log('About to call updateShowsSection...');
    updateShowsSection();
    console.log('About to call updateShopSection...');
    updateShopSection();
    console.log('About to call updateProjectsSection...');
    updateProjectsSection();
    console.log('About to call updateVideoSection...');
    updateVideoSection();
    
    // Force video update after a short delay to ensure DOM is ready
    setTimeout(() => {
      console.log('Forcing video update after data load...');
      updateVideoSection();
    }, 1000);
  });

  // Also try to update sections after a delay in case the DOM isn't ready
  setTimeout(() => {
    console.log('Delayed section updates...');
    if (globalData && globalData.shows) {
      console.log('Global data exists, calling updateShowsSection');
      updateShowsSection();
    }
    if (globalData && globalData.products) {
      console.log('Global data exists, calling updateShopSection');
      updateShopSection();
    }
    if (globalData && globalData.projects) {
      console.log('Global data exists, calling updateProjectsSection');
      updateProjectsSection();
    }
    if (globalData && globalData.data) {
      console.log('Global data exists, calling updateVideoSection');
      updateVideoSection();
    }
    if (!globalData) {
      console.log('No global data yet, will try again later');
    }
  }, 2000);

  // Start intro animation
    setTimeout(animateIntroImage, 1000);
    
  // Scroll effects
    initializeScrolling();
    
  // Menu buttons + ticket submit
    setTimeout(() => {
        const menuButtons = document.querySelectorAll('#menu-items button');
        console.log('Found menu buttons:', menuButtons.length);
        
        menuButtons.forEach(button => {
      button.addEventListener('click', () => {
                const sectionName = button.getAttribute('data-section');
                const targetSection = document.querySelector(`#${sectionName}`);
        console.log('Button clicked:', sectionName, 'Target section:', targetSection);
                
                if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Regenerate show cards when shows section is clicked
          if (sectionName === 'shows') {
            console.log('Shows section clicked - regenerating show cards');
            setTimeout(() => {
              updateShowsSection();
            }, 500); // Small delay to allow scroll to complete
          }
          
          // Handle video autoplay when video section is clicked
          if (sectionName === 'video') {
            console.log('Video section clicked - attempting to play video');
            setTimeout(() => {
              // Update video source first
              updateVideoSection();
              
              const video = document.querySelector('#aex-video');
              if (video) {
                video.muted = true; // Ensure muted for autoplay
                video.play().catch(error => {
                  console.log('Autoplay failed:', error);
                  console.log('User interaction required for video playback');
                });
              }
            }, 500); // Small delay to allow scroll to complete
          }
                } else {
                    console.error('Section not found:', sectionName);
                }
            });
        });
        
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', handleTicketSubmission);
        }
    }, 100);
    
  // Rebind after route changes (if your router swaps DOM)
    window.addEventListener('routeChange', (event) => {
        console.log('Route changed to:', event.detail.path);
        setTimeout(() => {
            const submitBtn = document.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.removeEventListener('click', handleTicketSubmission);
                submitBtn.addEventListener('click', handleTicketSubmission);
            }
        }, 100);
    });
});

// ------------------------------
// Exports
// ------------------------------
export {
  router,
  gsap,
  globalData,
  getGlobalData,
  getGlobalDataByKey,
  refreshGlobalData,
  getShows,
  getProjects,
  getProducts,
  getMain,
  getData,
  updateShowsSection,
  updateShopSection
};
