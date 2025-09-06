// Stripe Configuration
export const STRIPE_CONFIG = {
  // Test keys for development
  test: {
    publishableKey: 'pk_test_51RmOiEQDQ6Nh8Wgn3q4NAqrDxFDnbJOVCIIKwG3SbhyO7zHPSv2S4ssBX9kN7LCPKHsdY3t5bEW2qvIzLniE5YR600pB91m9wA'
  },
  // Live keys for production (replace with your actual live keys)
  live: {
    publishableKey: 'pk_live_your_live_publishable_key_here'
  }
};

// Determine environment
export const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Get the appropriate Stripe key
export const getStripeKey = () => {
  return isDevelopment ? STRIPE_CONFIG.test.publishableKey : STRIPE_CONFIG.live.publishableKey;
};
