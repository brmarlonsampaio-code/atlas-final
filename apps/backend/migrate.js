const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:L%40mina50%2378@db.lxzfedugdsonymqavhlt.supabase.co:5432/postgres'
});

async function migrate() {
  console.log('Iniciando migração no Supabase...');
  try {
    await client.connect();
    
    await client.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);
    console.log('PostGIS ativado.');

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        color VARCHAR NOT NULL,
        icon VARCHAR NOT NULL,
        marker_style VARCHAR NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS entities (
        id VARCHAR PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT,
        period VARCHAR,
        year VARCHAR,
        country VARCHAR,
        region VARCHAR,
        culture VARCHAR,
        latitude REAL,
        longitude REAL,
        geom geometry(Geometry, 4326) NOT NULL,
        cover_image TEXT,
        gallery JSONB,
        videos JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS media (
        id VARCHAR PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        type VARCHAR NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR PRIMARY KEY,
        title TEXT NOT NULL,
        type VARCHAR NOT NULL,
        url TEXT NOT NULL,
        metadata JSONB,
        reference_abnt TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS entity_categories (
        entity_id VARCHAR REFERENCES entities(id),
        category_id VARCHAR REFERENCES categories(id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS entity_media (
        entity_id VARCHAR REFERENCES entities(id),
        media_id VARCHAR REFERENCES media(id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS entity_documents (
        entity_id VARCHAR REFERENCES entities(id),
        document_id VARCHAR REFERENCES documents(id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS entity_tags (
        entity_id VARCHAR REFERENCES entities(id),
        tag_id VARCHAR REFERENCES tags(id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS entity_relations (
        source_id VARCHAR REFERENCES entities(id),
        target_id VARCHAR REFERENCES entities(id),
        relation_type VARCHAR
      );
    `);

    console.log('Todas as tabelas foram criadas com sucesso!');
  } catch (error) {
    console.error('Erro na migração:', error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

migrate();
