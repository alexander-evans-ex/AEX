# Global Data Usage Examples

This document shows how to use the global data functions throughout your AEX project.

## Importing the Functions

In any JavaScript file where you want to use the global data:

```javascript
import { getGlobalData, getGlobalDataByKey, refreshGlobalData, globalData } from './main.js';
```

## Basic Usage Examples

### 1. Get All Global Data

```javascript
// Get the complete global data object
const allData = getGlobalData();
console.log('All data:', allData);

// Access specific properties
if (allData) {
    console.log('Shows:', allData.shows);
    console.log('Announcements:', allData.announcements);
    console.log('Contact:', allData.contact);
}
```

### 2. Get Specific Data by Key

```javascript
// Get only shows data
const shows = getGlobalDataByKey('shows');
if (shows) {
    shows.forEach(show => {
        console.log(`Show: ${show.name} on ${show.date}`);
    });
}

// Get only announcements
const announcements = getGlobalDataByKey('announcements');
if (announcements) {
    announcements.forEach(announcement => {
        console.log(`Announcement: ${announcement}`);
    });
}
```

### 3. Refresh Data

```javascript
// Manually refresh the global data
async function updateData() {
    try {
        const newData = await refreshGlobalData();
        console.log('Data refreshed:', newData);
        // Update your UI here
    } catch (error) {
        console.error('Failed to refresh data:', error);
    }
}

// Call this when you need fresh data
updateData();
```

### 4. Listen for Data Changes

```javascript
// Listen for when global data is loaded or updated
window.addEventListener('globalDataLoaded', (event) => {
    const data = event.detail.data;
    console.log('Global data loaded:', data);
    
    // Update your UI here
    updateShowsSection(data.shows);
    updateAnnouncements(data.announcements);
    updateContactInfo(data.contact);
});
```

## Real-World Examples

### Update Shows Section

```javascript
function updateShowsSection(shows) {
    const showsContainer = document.querySelector('#shows-content');
    if (!showsContainer || !shows) return;
    
    shows.forEach(show => {
        const showElement = document.createElement('div');
        showElement.className = 'show-item';
        showElement.innerHTML = `
            <h3>${show.name}</h3>
            <p>Date: ${show.date}</p>
            <p>Time: ${show.time}</p>
            <p>Location: ${show.location}</p>
            <p>${show.description}</p>
            <span class="ticket-status ${show.ticketsAvailable ? 'available' : 'unavailable'}">
                ${show.ticketsAvailable ? 'Tickets Available' : 'Sold Out'}
            </span>
        `;
        showsContainer.appendChild(showElement);
    });
}
```

### Update Announcements

```javascript
function updateAnnouncements(announcements) {
    const announcementsContainer = document.querySelector('#announcements');
    if (!announcementsContainer || !announcements) return;
    
    announcementsContainer.innerHTML = '';
    announcements.forEach(announcement => {
        const announcementElement = document.createElement('div');
        announcementElement.className = 'announcement';
        announcementElement.textContent = announcement;
        announcementsContainer.appendChild(announcementElement);
    });
}
```

### Update Contact Information

```javascript
function updateContactInfo(contact) {
    if (!contact) return;
    
    // Update email
    const emailElement = document.querySelector('.contact-item .contact-details h3 span');
    if (emailElement) {
        emailElement.textContent = contact.email;
    }
    
    // Update phone
    const phoneElement = document.querySelector('.contact-item:nth-child(2) .contact-details h3 span');
    if (phoneElement) {
        phoneElement.textContent = contact.phone;
    }
    
    // Update location
    const locationElement = document.querySelector('.contact-item:nth-child(3) .contact-details h3 span');
    if (locationElement) {
        locationElement.textContent = contact.location;
    }
}
```

### Dynamic Content Loading

```javascript
// Wait for global data to be loaded before rendering content
function initializeContent() {
    const data = getGlobalData();
    
    if (data) {
        // Data is already loaded
        renderContent(data);
    } else {
        // Wait for data to be loaded
        window.addEventListener('globalDataLoaded', (event) => {
            renderContent(event.detail.data);
        });
    }
}

function renderContent(data) {
    updateShowsSection(data.shows);
    updateAnnouncements(data.announcements);
    updateContactInfo(data.contact);
    updateSocialLinks(data.social);
}

// Call this when your component initializes
initializeContent();
```

## Error Handling

```javascript
function safeGetData(key, defaultValue = null) {
    try {
        const data = getGlobalDataByKey(key);
        return data || defaultValue;
    } catch (error) {
        console.error(`Error getting data for key '${key}':`, error);
        return defaultValue;
    }
}

// Usage
const shows = safeGetData('shows', []);
const announcements = safeGetData('announcements', ['No announcements available']);
```

## Performance Tips

1. **Cache Data**: Store frequently accessed data in local variables
2. **Batch Updates**: Update multiple UI elements at once instead of individually
3. **Debounce Refresh**: Don't refresh data too frequently
4. **Lazy Loading**: Only load data when needed

```javascript
// Cache frequently accessed data
let cachedShows = null;
let lastRefresh = 0;
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

function getShowsWithCache() {
    const now = Date.now();
    
    if (!cachedShows || (now - lastRefresh) > REFRESH_INTERVAL) {
        cachedShows = getGlobalDataByKey('shows');
        lastRefresh = now;
    }
    
    return cachedShows;
}
```

## Integration with Router

You can also integrate this with your routing system to load different data for different pages:

```javascript
// In your router.js or navigation handler
function handleRouteChange(route) {
    // Refresh data when route changes
    refreshGlobalData().then(() => {
        // Route-specific data handling
        switch (route) {
            case '/shows':
                const shows = getGlobalDataByKey('shows');
                renderShowsPage(shows);
                break;
            case '/contact':
                const contact = getGlobalDataByKey('contact');
                renderContactPage(contact);
                break;
            // ... other routes
        }
    });
}
```
