# Production Setup Guide

## 🔧 Stripe Configuration for Production

### 1. Get Your Live Stripe Keys

1. **Log into Stripe Dashboard**: https://dashboard.stripe.com
2. **Switch to Live Mode**: Toggle the "Test mode" switch in the top right
3. **Get Your Keys**:
   - **Publishable Key**: `pk_live_...` (starts with pk_live_)
   - **Secret Key**: `sk_live_...` (starts with sk_live_)

### 2. Update Configuration Files

#### A. Update `src/config.js`
Replace the placeholder with your actual live publishable key:

```javascript
live: {
  publishableKey: 'pk_live_your_actual_live_key_here'
}
```

#### B. Set Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:

```
STRIPE_SECRET_KEY = sk_live_your_actual_live_secret_key_here
```

### 3. Test Your Live Configuration

#### A. Test with Real Cards (Small Amounts)
- Use real card numbers for testing
- Start with small amounts ($1-5)
- Monitor your Stripe dashboard for transactions

#### B. Test Cards for Live Mode
- **Success**: Use your own card with small amounts
- **Decline**: Use `4000 0000 0000 0002`
- **3D Secure**: Use `4000 0025 0000 3155`

### 4. Security Considerations

#### A. Never Commit Live Keys
- ✅ Keep live keys in environment variables only
- ❌ Never commit live keys to git
- ✅ Use test keys in development

#### B. Webhook Security
Consider setting up webhooks for production:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 5. Production Checklist

- [ ] Updated `src/config.js` with live publishable key
- [ ] Set `STRIPE_SECRET_KEY` environment variable in Vercel
- [ ] Test with real card (small amount)
- [ ] Verify payments appear in Stripe dashboard
- [ ] Test error handling with declined cards
- [ ] Monitor Stripe dashboard for any issues

### 6. Deployment Commands

```bash
# Deploy to Vercel
vercel --prod

# Or if using Vercel CLI
vercel deploy --prod
```

### 7. Monitoring

- **Stripe Dashboard**: Monitor payments, refunds, disputes
- **Vercel Logs**: Check function logs for errors
- **Google Sheets**: Verify customer data is being saved

## 🚨 Important Notes

1. **Test First**: Always test with small amounts before going live
2. **Monitor Closely**: Watch your Stripe dashboard for the first few days
3. **Backup Data**: Ensure Google Sheets integration is working
4. **Error Handling**: Test error scenarios (declined cards, network issues)
5. **Compliance**: Ensure you're following PCI compliance guidelines

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Check Stripe dashboard for payment status
3. Verify environment variables are set correctly
4. Test with Stripe's test cards first
