/**
 * Aplica, em ordem, todos os arquivos .sql de src/db/migrations contra o
 * banco apontado por DATABASE_URL. Substitui o antigo migrate.js, que tinha
 * a credencial de produção hardcoded (removido — ver histórico do git).
 *
 * Uso: DATABASE_URL=postgresql://... npm run db:migrate
 */
require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não definida. Configure apps/backend/.env (veja .env.example).');
  process.exit(1);
}

async function migrate() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const dir = path.join(__dirname, 'src/db/migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  try {
    for (const file of files) {
      console.log(`Aplicando ${file}...`);
      const sql = fs.readFileSync(path.join(dir, file), 'utf8');
      await client.query(sql);
    }
    console.log('Migrations aplicadas com sucesso.');
  } catch (error) {
    console.error('Erro ao aplicar migrations:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

migrate();
