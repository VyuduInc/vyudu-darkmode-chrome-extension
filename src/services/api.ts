import { Settings, SubscriptionStatus } from '../types';

const API_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL;

export const api = {
  async createSubscription(email: string, priceId: string) {
    const response = await fetch(`${API_URL}/api/create-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, priceId }),
    });
    return response.json();
  },

  async syncSettings(userId: string, settings: Settings) {
    const response = await fetch(`${API_URL}/api/settings/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return response.json();
  },

  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    const response = await fetch(`${API_URL}/api/users/${userId}/subscription`);
    return response.json();
  },
};