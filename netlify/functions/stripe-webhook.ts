import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import payload from '../../src/payload';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let data: any;
  let eventType: string;

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig!,
      webhookSecret!
    );
    data = stripeEvent.data.object;
    eventType = stripeEvent.type;
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  try {
    switch (eventType) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(data);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeletion(data);
        break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Server Error: ${err.message}`,
    };
  }
};

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const user = await payload.find({
    collection: 'users',
    where: {
      stripeCustomerId: { equals: subscription.customer },
    },
  });

  if (user.docs.length > 0) {
    await payload.update({
      collection: 'users',
      id: user.docs[0].id,
      data: {
        subscriptionStatus: subscription.status === 'active' ? 'premium' : 'free',
      },
    });

    await payload.update({
      collection: 'subscriptions',
      where: {
        stripeSubscriptionId: { equals: subscription.id },
      },
      data: {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  const user = await payload.find({
    collection: 'users',
    where: {
      stripeCustomerId: { equals: subscription.customer },
    },
  });

  if (user.docs.length > 0) {
    await payload.update({
      collection: 'users',
      id: user.docs[0].id,
      data: {
        subscriptionStatus: 'free',
      },
    });

    await payload.update({
      collection: 'subscriptions',
      where: {
        stripeSubscriptionId: { equals: subscription.id },
      },
      data: {
        status: 'canceled',
      },
    });
  }
}