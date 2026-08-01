import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL não definida. Configure apps/backend/.env (veja .env.example).',
  );
}

export default {
  schema: 'apps/backend/src/db/schema.ts',
  out: 'apps/backend/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
