// For Vercel deployment - this will be used in production
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      amount, 
      currency = 'usd', 
      paymentMethodId, 
      email, 
      metadata = {} 
    } = req.body;

    if (!amount || !paymentMethodId || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, paymentMethodId, email' 
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        ...metadata,
        source: 'AEX Website'
      }
    });

    res.status(200).json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret
      }
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      message: error.message 
    });
  }
}