import { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { api } from '../services/api';
import { SubscriptionStatus } from '../types';

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings, updateSettings } = useSettingsStore();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const status = await api.getSubscriptionStatus(settings.userId);
        setStatus(status);
        updateSettings({ premium: status.premium });
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  return { status, loading };
}