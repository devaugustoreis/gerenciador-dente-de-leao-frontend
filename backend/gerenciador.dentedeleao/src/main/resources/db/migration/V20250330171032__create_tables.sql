DROP TABLE IF EXISTS dente_de_leao_manager.categories;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.categories(
    id          UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    label       VARCHAR(255) NOT NULL UNIQUE,
    excluded    BOOLEAN NOT NULL DEFAULT FALSE
);

DROP TABLE IF EXISTS dente_de_leao_manager.materials;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.materials(
    id          UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    excluded    BOOLEAN NOT NULL DEFAULT FALSE,
    category_id UUID NOT NULL,

    CONSTRAINT fk_material_category FOREIGN KEY (category_id) REFERENCES dente_de_leao_manager.categories (id)
);

DROP TABLE IF EXISTS dente_de_leao_manager.users;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.users(
    id           UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    login        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(1000) NOT NULL,
    full_name    VARCHAR(255) NOT NULL,
    user_role         VARCHAR(10) NOT NULL DEFAULT 'USER',
    excluded     BOOLEAN NOT NULL DEFAULT FALSE
);

DROP TABLE IF EXISTS dente_de_leao_manager.consultation_types;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.consultation_types(
     id          UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
     label       VARCHAR(255) NOT NULL UNIQUE,
     excluded    BOOLEAN NOT NULL DEFAULT FALSE
);

DROP TABLE IF EXISTS dente_de_leao_manager.consultations;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.consultations(
    id                      UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name            VARCHAR(255) NOT NULL,
    start_date              TIMESTAMP NOT NULL,
    end_date                TIMESTAMP NOT NULL,
    concluded               BOOLEAN NOT NULL DEFAULT FALSE,
    consultation_type_id    UUID NOT NULL,

    CONSTRAINT fk_consultation_consultation_type FOREIGN KEY (consultation_type_id) REFERENCES dente_de_leao_manager.consultation_types (id)
);

DROP TABLE IF EXISTS dente_de_leao_manager.consultation_materials;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.consultation_materials(
    consultation_id     UUID NOT NULL DEFAULT gen_random_uuid(),
    material_id         UUID NOT NULL DEFAULT gen_random_uuid(),
    quantity            INT NOT NULL,

    PRIMARY KEY (consultation_id, material_id),
    CONSTRAINT fk_consultation_material_consultation FOREIGN KEY (consultation_id) REFERENCES dente_de_leao_manager.consultations (id),
    CONSTRAINT fk_consultation_material_material FOREIGN KEY (material_id) REFERENCES dente_de_leao_manager.materials (id)
);

DROP TABLE IF EXISTS dente_de_leao_manager.materials_groups;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.materials_groups(
     id         UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
     label      VARCHAR(255) NOT NULL UNIQUE,
     excluded   BOOLEAN NOT NULL DEFAULT FALSE
);

DROP TABLE IF EXISTS dente_de_leao_manager.materials_groups_items;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.materials_groups_items(
    material_group_id   UUID NOT NULL DEFAULT gen_random_uuid(),
    material_id         UUID NOT NULL DEFAULT gen_random_uuid(),
    quantity            INT NOT NULL,

    PRIMARY KEY (material_group_id, material_id),
    CONSTRAINT fk_material_group_item_material_group FOREIGN KEY (material_group_id) REFERENCES dente_de_leao_manager.materials_groups (id),
    CONSTRAINT fk_material_group_item_material FOREIGN KEY (material_id) REFERENCES dente_de_leao_manager.materials (id)
);

DROP TABLE IF EXISTS dente_de_leao_manager.notifications;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.notifications(
     id         UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
     message    VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS dente_de_leao_manager.materials_stock;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.materials_stock(
    id                      UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_quantity          INT NOT NULL,
    scheduled_quantity      INT NOT NULL,
    alert_quantity          INT NOT NULL DEFAULT 5,
    material_id             UUID NOT NULL,

    CONSTRAINT fk_material_stock_material FOREIGN KEY (material_id) REFERENCES dente_de_leao_manager.materials (id)
);

DROP TABLE IF EXISTS dente_de_leao_manager.materials_historic;
CREATE TABLE IF NOT EXISTS dente_de_leao_manager.materials_historic(
    id                      UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    movement_type           VARCHAR(10) NOT NULL,
    quantity                INT NOT NULL,
    movement_date           TIMESTAMP NOT NULL,
    material_stock_id       UUID NOT NULL,

    CONSTRAINT fk_material_historic_material_stock FOREIGN KEY (material_stock_id) REFERENCES dente_de_leao_manager.materials_stock (id)
);