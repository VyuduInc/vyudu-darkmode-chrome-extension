import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import payload from '../../src/payload';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, priceId } = JSON.parse(event.body || '');

    // Create or get customer
    let user = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    });

    let stripeCustomerId;
    if (user.docs.length === 0) {
      const customer = await stripe.customers.create({ email });
      stripeCustomerId = customer.id;
      
      await payload.create({
        collection: 'users',
        data: {
          email,
          stripeCustomerId,
          subscriptionStatus: 'free',
        },
      });
    } else {
      stripeCustomerId = user.docs[0].stripeCustomerId;
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};