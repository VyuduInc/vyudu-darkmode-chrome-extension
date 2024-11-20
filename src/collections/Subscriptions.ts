import { CollectionConfig } from 'payload/types';

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Past Due', value: 'past_due' },
      ],
      required: true,
    },
    {
      name: 'plan',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
        { label: 'Lifetime', value: 'lifetime' },
      ],
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'currentPeriodEnd',
      type: 'date',
      required: true,
    },
  ],
};