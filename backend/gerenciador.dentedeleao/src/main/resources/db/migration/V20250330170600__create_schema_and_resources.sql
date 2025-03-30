CREATE SCHEMA IF NOT EXISTS dente_de_leao_manager;

CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');

CREATE TYPE movement_type_enum AS ENUM ('ENTRY', 'EXIT');

-- extensão para criar uuid's automaticamente caso seja necessário, para valor default
CREATE EXTENSION IF NOT EXISTS "pgcrypto";