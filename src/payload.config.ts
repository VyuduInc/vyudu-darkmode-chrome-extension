import { buildConfig } from 'payload/config';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import { Users } from './collections/Users';
import { Settings } from './collections/Settings';
import { Subscriptions } from './collections/Subscriptions';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
  },
  editor: slateEditor({}),
  collections: [
    Users,
    Settings,
    Subscriptions,
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
  cors: [
    'chrome-extension://*',
  ],
});