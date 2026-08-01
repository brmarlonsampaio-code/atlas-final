-- Campos de metadados adicionais em `entities`, inspirados em Dublin Core
-- + campos interpretativos do projeto Atlas Digital Atlante.
ALTER TABLE entities
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS author VARCHAR,
  ADD COLUMN IF NOT EXISTS century VARCHAR,
  ADD COLUMN IF NOT EXISTS document_type VARCHAR,
  ADD COLUMN IF NOT EXISTS theme VARCHAR,
  ADD COLUMN IF NOT EXISTS space VARCHAR,
  ADD COLUMN IF NOT EXISTS process VARCHAR,
  ADD COLUMN IF NOT EXISTS object VARCHAR,
  ADD COLUMN IF NOT EXISTS experience TEXT,
  ADD COLUMN IF NOT EXISTS knowledges TEXT,
  ADD COLUMN IF NOT EXISTS practices TEXT,
  ADD COLUMN IF NOT EXISTS source_archive TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS bibliography TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Palavras-chave já são modeladas como tabela relacional (`tags` + `entity_tags`),
-- o que é mais correto que um campo de texto solto — mantido como está.

-- Tabela de rotas atlânticas, ligada a duas entidades já cadastradas (não duplica coordenadas).
CREATE TABLE IF NOT EXISTS routes (
  id VARCHAR PRIMARY KEY,
  source_entity_id VARCHAR NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  target_entity_id VARCHAR NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  category VARCHAR,
  intensity REAL,
  note TEXT,
  geom geometry(LineString, 4326) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_routes_geom ON routes USING GIST (geom);
