-- Criar banco Pokemon
CREATE DATABASE pokemon_collector_db;

-- Criar banco Pokemon
CREATE DATABASE tcg_collection_db;

-- =========================
-- Estrutura Pokemon
-- =========================

\connect pokemon_collector_db;

CREATE TABLE IF NOT EXISTS saves (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id VARCHAR(1000) NOT NULL,
    pokemon_id INTEGER NOT NULL,
    have BOOLEAN DEFAULT FALSE,
    UNIQUE (user_id, pokemon_id)
);


-- =========================
-- Estrutura TCG
-- =========================

\connect tcg_collection_db;

CREATE TABLE cards (
  card_id VARCHAR(20) UNIQUE NOT NULL,
  card_name varchar(150),
  card_url VARCHAR(200),
  card_code VARCHAR(20),
  rarity VARCHAR(30),
  set_id VARCHAR(20),
  set_name VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  hash VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favorite_cards (
  id SERIAL PRIMARY KEY,
  user_hash VARCHAR(64) NOT NULL,
  card_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_favorite_user
    FOREIGN KEY (user_hash)
    REFERENCES users(hash)
    ON DELETE CASCADE,
  
  CONSTRAINT fk_card_favorited
    FOREIGN KEY (card_id)
    REFERENCES cards(card_id)
    ON DELETE CASCADE,

  CONSTRAINT unique_favorite
    UNIQUE (user_hash, card_id)
);

CREATE TABLE obtained_cards (
  id SERIAL PRIMARY KEY,
  user_hash VARCHAR(64) NOT NULL,
  card_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_obtained_user
    FOREIGN KEY (user_hash)
    REFERENCES users(hash)
    ON DELETE CASCADE,

  CONSTRAINT fk_card_obtained
    FOREIGN KEY (card_id)
    REFERENCES cards(card_id)
    ON DELETE CASCADE,

  CONSTRAINT unique_obtained
    UNIQUE (user_hash, card_id)
);

-- índices
CREATE INDEX idx_users_hash ON users(hash);
CREATE INDEX idx_card_id ON cards(card_id);
CREATE INDEX idx_card_name ON cards(card_name);
CREATE INDEX idx_favorite_user ON favorite_cards(user_hash);
CREATE INDEX idx_obtained_user ON obtained_cards(user_hash);
