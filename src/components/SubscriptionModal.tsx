import React from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!);

const plans = [
  {
    name: 'Monthly',
    price: '$1.49',
    priceId: 'price_monthly',
    features: ['All Pro features', 'Sync across devices', 'Priority support']
  },
  {
    name: 'Yearly',
    price: '$12.49',
    priceId: 'price_yearly',
    features: ['All Pro features', '2 months free', 'Priority support']
  },
  {
    name: 'Lifetime',
    price: '$19.99',
    priceId: 'price_lifetime',
    features: ['All Pro features', 'One-time payment', 'Lifetime updates']
  }
];

export function SubscriptionModal() {
  const { settings } = useSettingsStore();
  
  const handleSubscribe = async (priceId: string) => {
    const stripe = await stripePromise;
    if (!stripe) return;

    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId })
    });

    const { clientSecret } = await response.json();
    
    await stripe.confirmCardPayment(clientSecret);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold mb-6">Upgrade to Pro</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-3xl font-bold my-4">{plan.price}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.priceId)}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}