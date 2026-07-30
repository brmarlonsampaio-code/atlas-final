-- Ativa a extensão espacial PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tabela de Configuração Visual de Categorias
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  color VARCHAR NOT NULL,
  icon VARCHAR NOT NULL,
  marker_style VARCHAR NOT NULL
);

-- Tabela Central de Entidades (Pontos, Linhas, Polígonos Históricos)
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

-- Tabela de Mídias Auxiliares
CREATE TABLE IF NOT EXISTS media (
  id VARCHAR PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR NOT NULL
);

-- Tabela de Acervo Documental e Bibliográfico
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR PRIMARY KEY,
  title TEXT NOT NULL,
  type VARCHAR NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB,
  reference_abnt TEXT
);

-- Tabela de Tags/Palavras-chave
CREATE TABLE IF NOT EXISTS tags (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL
);

-- Tabelas de Relação (N:N)
CREATE TABLE IF NOT EXISTS entity_categories (
  entity_id VARCHAR REFERENCES entities(id) ON DELETE CASCADE,
  category_id VARCHAR REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (entity_id, category_id)
);

CREATE TABLE IF NOT EXISTS entity_media (
  entity_id VARCHAR REFERENCES entities(id) ON DELETE CASCADE,
  media_id VARCHAR REFERENCES media(id) ON DELETE CASCADE,
  PRIMARY KEY (entity_id, media_id)
);

CREATE TABLE IF NOT EXISTS entity_documents (
  entity_id VARCHAR REFERENCES entities(id) ON DELETE CASCADE,
  document_id VARCHAR REFERENCES documents(id) ON DELETE CASCADE,
  PRIMARY KEY (entity_id, document_id)
);

CREATE TABLE IF NOT EXISTS entity_tags (
  entity_id VARCHAR REFERENCES entities(id) ON DELETE CASCADE,
  tag_id VARCHAR REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entity_id, tag_id)
);

-- Relações entre diferentes Entidades Históricas (ex: Porto conectado a Quilombo)
CREATE TABLE IF NOT EXISTS entity_relations (
  source_id VARCHAR REFERENCES entities(id) ON DELETE CASCADE,
  target_id VARCHAR REFERENCES entities(id) ON DELETE CASCADE,
  relation_type VARCHAR,
  PRIMARY KEY (source_id, target_id)
);

-- Índices de Performance Geoespacial e Textual
CREATE INDEX idx_entities_geom ON entities USING GIST (geom);
