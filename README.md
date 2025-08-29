# AEX - Alexander Evans Experience

A modern, routing-enabled web application built with vanilla JavaScript and Vite.

## Features

- 🚀 **Client-side routing** - Fast navigation without page reloads
- 🎨 **Modern design** - Clean, responsive UI with smooth animations
- ⚡ **No framework dependencies** - Built with vanilla JavaScript
- 🔧 **Easy to extend** - Modular component system
- 📱 **Mobile-friendly** - Responsive design that works on all devices

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
AEX/
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies and scripts
├── src/
│   ├── main.js            # Application entry point
│   ├── router.js          # Routing system implementation
│   ├── components/        # Page-specific components
│   │   └── home.js        # Home page component
│   └── style.css          # Global styles
└── public/                # Static assets
    └── templates/         # HTML templates (if using external templates)
```

## Routing System

The application uses a custom client-side routing system that:

- Handles browser navigation (back/forward buttons)
- Updates page content dynamically
- Manages browser history
- Loads page-specific JavaScript components
- Provides clean URLs

### Available Routes

- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/demo` - Interactive routing demonstration
- `/404` - 404 error page (handles unknown routes)

### Adding New Routes

To add a new route, update the `routes` object in `src/router.js`:

```javascript
'/new-page': {
    template: `
        <div class="page new-page">
            <header>
                <h1>New Page</h1>
                <nav>
                    <a href="/">Home</a>
                    <a href="/new-page">New Page</a>
                </nav>
            </header>
            <main>
                <h2>Welcome to the new page!</h2>
            </main>
        </div>
    `,
    title: 'New Page - AEX',
    description: 'Description of the new page'
}
```

### Navigation

Use standard anchor tags for navigation:

```html
<a href="/about">About</a>
<a href="/contact">Contact</a>
```

The router automatically intercepts these links and handles navigation without page reloads.

## Components

Each page can have its own JavaScript component that initializes when the page loads. Components are defined in `src/components/` and automatically loaded by the router.

Example component:

```javascript
// src/components/about.js
export default function initAbout() {
    console.log('About page initialized');
    
    // Add page-specific functionality here
    const aboutButton = document.getElementById('aboutButton');
    if (aboutButton) {
        aboutButton.addEventListener('click', () => {
            console.log('About button clicked');
        });
    }
}
```

## Styling

The application uses modern CSS with:

- Flexbox layouts
- CSS Grid for complex layouts
- CSS custom properties
- Smooth transitions and animations
- Mobile-first responsive design

## Building for Production

To build the application for production:

```bash
npm run build
```

This creates a `dist` folder with optimized files ready for deployment.

## Development

- **Development server**: `npm run dev`
- **Build**: `npm run build`
- **Preview build**: `npm run preview`

## Browser Support

The application works in all modern browsers that support:
- ES6 modules
- Fetch API
- History API
- CSS Grid and Flexbox

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help, please open an issue on GitHub.
