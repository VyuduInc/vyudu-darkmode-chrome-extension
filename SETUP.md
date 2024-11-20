# Elegant Dark Pro - Setup Guide

## Prerequisites

1. MongoDB Atlas account
2. Stripe account
3. Netlify account
4. Chrome Developer account

## Configuration Steps

### 1. MongoDB Atlas Setup

1. Create new cluster
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Add to `.env`:
   ```
   MONGODB_URI=your_connection_string
   ```

### 2. Stripe Configuration

1. Create Stripe account
2. Set up products:
   - Monthly: $1.49
   - Yearly: $12.49
   - Lifetime: $19.99
3. Get API keys
4. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_PUBLIC_KEY=pk_live_xxx
   ```

### 3. Payload CMS Setup

1. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```
2. Set environment variables in Netlify
3. Configure webhook endpoints
4. Update `.env` with webhook secret

### 4. Chrome Web Store Setup

1. Create developer account
2. Generate ZIP file:
   ```bash
   npm run build:extension
   ```
3. Submit to Chrome Web Store:
   - Upload `dist/elegant-dark-pro.zip`
   - Add store listing details
   - Submit for review

## Development Workflow

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development:
   ```bash
   npm run dev
   ```

3. Build extension:
   ```bash
   npm run build:extension
   ```

## Testing

1. Load unpacked extension:
   - Open Chrome Extensions
   - Enable Developer mode
   - Load unpacked from `dist` folder

2. Test features:
   - Dark mode conversion
   - Settings sync
   - Premium features
   - Payment flow

## Deployment Checklist

- [ ] Configure MongoDB Atlas
- [ ] Set up Stripe products
- [ ] Deploy Payload CMS
- [ ] Configure webhooks
- [ ] Submit to Chrome Web Store
- [ ] Set up monitoring
- [ ] Configure error tracking
- [ ] Test payment flow
- [ ] Verify cross-device sync

## Support

For technical support, contact:
- Backend issues: backend@yourdomain.com
- Extension issues: extension@yourdomain.com