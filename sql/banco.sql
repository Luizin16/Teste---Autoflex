-- Tabela de Produtos
CREATE TABLE product (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value DECIMAL(10,2) NOT NULL
);

-- Tabela de Matérias-Primas
CREATE TABLE raw_material (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stock_quantity DECIMAL(10,3) NOT NULL DEFAULT 0
);

-- Tabela de Associação Produto <-> Matéria-Prima
CREATE TABLE product_raw_material (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    raw_material_id BIGINT NOT NULL REFERENCES raw_material(id) ON DELETE CASCADE,
    required_quantity DECIMAL(10,3) NOT NULL,
    UNIQUE(product_id, raw_material_id)
);
