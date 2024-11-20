import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'user',
      required: true,
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'subscriptionStatus',
      type: 'select',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Premium', value: 'premium' },
      ],
      defaultValue: 'free',
      required: true,
    },
  ],
};