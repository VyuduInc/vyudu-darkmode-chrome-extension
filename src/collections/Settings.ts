import { CollectionConfig } from 'payload/types';

export const Settings: CollectionConfig = {
  slug: 'settings',
  admin: {
    useAsTitle: 'site',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'site',
      type: 'text',
      required: true,
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'brightness',
      type: 'number',
      min: 50,
      max: 150,
      defaultValue: 100,
    },
    {
      name: 'contrast',
      type: 'number',
      min: 50,
      max: 150,
      defaultValue: 100,
    },
    {
      name: 'temperature',
      type: 'number',
      min: 5000,
      max: 7500,
      defaultValue: 6500,
    },
    {
      name: 'mode',
      type: 'select',
      options: [
        { label: 'Dynamic', value: 'dynamic' },
        { label: 'High Contrast', value: 'contrast' },
        { label: 'Gentle', value: 'gentle' },
      ],
      defaultValue: 'dynamic',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
};