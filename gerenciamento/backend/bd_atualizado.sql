-- ======================================================================
-- BD BellaDonna - schema completo e coerente com seu backend atual
-- MySQL 8.x
-- ======================================================================

CREATE DATABASE IF NOT EXISTS bd_belladonna
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE bd_belladonna;

SET FOREIGN_KEY_CHECKS = 0;

-- ======================================================================
-- 1) Tabelas base
-- ======================================================================
CREATE TABLE IF NOT EXISTS clientes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    dataCadastro    DATE,
    nome            VARCHAR(100) NOT NULL,
    tipo            ENUM('fisico', 'juridico') NOT NULL,
    sexo            ENUM('masculino', 'feminino', 'outro'),
    cpf             VARCHAR(14),
    cnpj            VARCHAR(18),
    rg              VARCHAR(20),
    email           VARCHAR(100) NOT NULL,
    telefone        VARCHAR(20) NOT NULL,
    dataNasc        DATE,
    estado          BOOLEAN DEFAULT TRUE NOT NULL,
    endCep          VARCHAR(10) NOT NULL,
    endRua          VARCHAR(100) NOT NULL,
    endNumero       VARCHAR(10) NOT NULL,
    endBairro       VARCHAR(50) NOT NULL,
    endComplemento  VARCHAR(50) NOT NULL,
    endUF           CHAR(2) NOT NULL,
    endMunicipio    VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

ALTER TABLE clientes
  MODIFY telefone VARCHAR(20) NULL,
  MODIFY endCep VARCHAR(10) NULL,
  MODIFY endRua VARCHAR(100) NULL,
  MODIFY endNumero VARCHAR(10) NULL,
  MODIFY endBairro VARCHAR(50) NULL,
  MODIFY endComplemento VARCHAR(50) NULL,
  MODIFY endUF CHAR(2) NULL,
  MODIFY endMunicipio VARCHAR(50) NULL;


CREATE TABLE IF NOT EXISTS funcionarios (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    nome              VARCHAR(100) NOT NULL,
    cpf               VARCHAR(14) NOT NULL,
    rg                VARCHAR(20) NOT NULL,
    data_nascimento   DATE NOT NULL,
    sexo              ENUM('masculino', 'feminino', 'outro') NOT NULL,
    email             VARCHAR(100) NOT NULL,
    estado            BOOLEAN DEFAULT TRUE NOT NULL,
    telefone          VARCHAR(20) NOT NULL,
    endCep            VARCHAR(10) NOT NULL,
    endRua            VARCHAR(100) NOT NULL,
    endNumero         VARCHAR(10) NOT NULL,
    endBairro         VARCHAR(50) NOT NULL,
    endComplemento    VARCHAR(50) NOT NULL,
    endUF             CHAR(2) NOT NULL,
    endMunicipio      VARCHAR(50) NOT NULL,
    funcao            VARCHAR(50) NOT NULL,
    salario           DECIMAL(10,2),
    dataContratacao   DATE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fornecedores (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nome_empresa     VARCHAR(100) NOT NULL,
    cnpj             VARCHAR(18) NOT NULL,
    telefone         VARCHAR(20) NOT NULL,
    email            VARCHAR(100) NOT NULL,
    endCep           VARCHAR(10) NOT NULL,
    endRua           VARCHAR(100) NOT NULL,
    endNumero        VARCHAR(10) NOT NULL,
    endBairro        VARCHAR(50) NOT NULL,
    endComplemento   VARCHAR(50) NOT NULL,
    endUF            CHAR(2) NOT NULL,
    endMunicipio     VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produtos (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    nome                 VARCHAR(100) NOT NULL,
    categoria            VARCHAR(50) NOT NULL,
    marca                VARCHAR(50) NOT NULL,
    preco                DECIMAL(10,2) NOT NULL,
    quantidade_estoque   INT NOT NULL,
    estoque_minimo       INT NOT NULL,
    estado               BOOLEAN DEFAULT TRUE NOT NULL,
    fornecedor_id        INT,
    imagem_1             TEXT,
    imagem_2             TEXT,
    imagem_3             TEXT,
    CONSTRAINT fk_prod_fornec FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS servicos_personalizados (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    nome     VARCHAR(100) NOT NULL,
    produtos TEXT NOT NULL,
    preco    DECIMAL(10,2) NOT NULL,
    status   BOOLEAN DEFAULT TRUE NOT NULL
) ENGINE=InnoDB;

-- ======================================================================
-- 2) Usuários da loja / Carrinho
-- ======================================================================
CREATE TABLE IF NOT EXISTS usuarios_loja (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id  INT NOT NULL UNIQUE,
    usuario     VARCHAR(100) NOT NULL UNIQUE,
    senha       VARCHAR(100) NOT NULL,
    CONSTRAINT fk_uloja_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS carrinho_de_compra (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario   INT NOT NULL,            -- referencia usuarios_loja.id
    valorTotal  DECIMAL(10,2) DEFAULT 0,
    CONSTRAINT fk_carrinho_usuario FOREIGN KEY (idUsuario) REFERENCES usuarios_loja(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS itens_carrinho (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  carrinho_id    INT NOT NULL,
  produto_id     INT NOT NULL,
  quantidade     INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_ic_carrinho FOREIGN KEY (carrinho_id) REFERENCES carrinho_de_compra(id),
  CONSTRAINT fk_ic_produto  FOREIGN KEY (produto_id)   REFERENCES produtos(id)
) ENGINE=InnoDB;

-- ======================================================================
-- 3) Pedidos / Vendas / Itens do pedido
-- ======================================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id         INT,
    funcionario_id     INT,
    data_pedido        DATETIME DEFAULT CURRENT_TIMESTAMP,
    forma_pagamento    ENUM('dinheiro','pix'),
    estado             ENUM('recebido','em_preparacao','enviado','entregue','cancelado'),
    canal              ENUM('presencial','online'),
    valor_total        DECIMAL(10,2),

    tipo_entrega       ENUM('retirada','entrega'),
    data_entrega       DATE,

    -- Endereço de entrega
    entrega_logradouro   VARCHAR(100),
    entrega_numero       VARCHAR(10),
    entrega_bairro       VARCHAR(50),
    entrega_cep          VARCHAR(10),
    entrega_municipio    VARCHAR(50),
    entrega_uf           CHAR(2),
    entrega_complemento  VARCHAR(50),

    -- Integração MP
    mp_payment_id       VARCHAR(64),
    mp_status           VARCHAR(32),

    CONSTRAINT fk_ped_cliente     FOREIGN KEY (cliente_id)    REFERENCES clientes(id),
    CONSTRAINT fk_ped_funcionario FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS itens_pedido (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id   INT,
    produto_id  INT,
    quantidade  INT,
    CONSTRAINT fk_ip_pedido  FOREIGN KEY (pedido_id)  REFERENCES pedidos(id),
    CONSTRAINT fk_ip_produto FOREIGN KEY (produto_id) REFERENCES produtos(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vendas (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    cliente     INT,
    funcionario INT,
    pedido      INT,
    produtos    TEXT NOT NULL,       -- JSON dos itens (id/quantidade/preco) que você salva
    valorTotal  DECIMAL(10,2) NOT NULL,
    dataVenda   DATE,
    pago        BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_v_cli  FOREIGN KEY (cliente)     REFERENCES clientes(id),
    CONSTRAINT fk_v_func FOREIGN KEY (funcionario) REFERENCES funcionarios(id),
    CONSTRAINT fk_v_ped  FOREIGN KEY (pedido)      REFERENCES pedidos(id)
) ENGINE=InnoDB;

-- ======================================================================
-- 4) Cupons / Financeiro / Usuários do sistema
-- ======================================================================
CREATE TABLE IF NOT EXISTS cupons (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    codigo               VARCHAR(20) UNIQUE,
    tipo                 ENUM('percentual', 'valor_fixo'),
    descontofixo         DECIMAL(10,2),
    descontoPorcentagem  DECIMAL(10,2),
    descontofrete        DECIMAL(10,2),
    validade             DATE,
    usos_permitidos      INT,
    usos_realizados      INT DEFAULT 0,
    valor_minimo         DECIMAL(10,2),
    estado               BOOLEAN DEFAULT TRUE NOT NULL,
    aplicacao            VARCHAR(64),
    tipo_produto         VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transacoes_financeiras (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    data_transacao   DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo             ENUM('entrada','saida'),
    categoria        VARCHAR(50),
    descricao        TEXT,
    valor            DECIMAL(10,2)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios_sistema (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    funcionario_id   INT NOT NULL UNIQUE,
    tipo_usuario     ENUM('Administrador','Vendedor','Estoque') NOT NULL,
    usuario          VARCHAR(100) NOT NULL UNIQUE,
    senha            VARCHAR(100) NOT NULL,
    tema_preferido   VARCHAR(50) DEFAULT 'claro',
    CONSTRAINT fk_us_func FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
) ENGINE=InnoDB;

ALTER TABLE clientes ADD COLUMN google_id VARCHAR(50) NULL UNIQUE;
ALTER TABLE clientes ADD UNIQUE (email);

-- ======================================================================
-- 5) Índices úteis
-- ======================================================================
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_cupons_codigo  ON cupons(codigo);
CREATE INDEX idx_produtos_nome  ON produtos(nome);

SET FOREIGN_KEY_CHECKS = 1;

-- ======================================================================
-- 6) Dados de exemplo (coerentes)
-- ======================================================================
INSERT INTO clientes (
    dataCadastro, nome, tipo, sexo, cpf, rg, email, telefone,
    dataNasc, estado, endCep, endRua, endNumero, endBairro,
    endComplemento, endUF, endMunicipio
) VALUES (
    CURDATE(), 'Maria Silva', 'fisico', 'feminino', '123.456.789-00', 'MG-12.345.678',
    'maria.silva@email.com', '(31) 99999-8888', '1990-05-20', TRUE, '30123-456',
    'Rua das Flores', '123', 'Centro', 'Apto 101', 'MG', 'Belo Horizonte'
);

INSERT INTO funcionarios (
    nome, cpf, rg, data_nascimento, sexo, email, estado, telefone,
    endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio,
    funcao, salario, dataContratacao
) VALUES (
    'João Pereira', '987.654.321-00', 'MG-87.654.321', '1985-08-15', 'masculino',
    'joao.pereira@email.com', TRUE, '(31) 98888-7777',
    '30123-789', 'Av. Brasil', '456', 'Centro', 'Sala 2', 'MG', 'Belo Horizonte',
    'Administrador', 4500.00, CURDATE()
);

INSERT INTO fornecedores (
    nome_empresa, cnpj, telefone, email, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio
) VALUES (
    'Flores do Brasil Ltda', '12.345.678/0001-90', '(31) 3222-3344', 'contato@floresdobrasil.com',
    '30111-222', 'Rua das Orquídeas', '50', 'Jardim Botânico', '', 'MG', 'Belo Horizonte'
);

INSERT INTO produtos (
    nome, categoria, marca, preco, quantidade_estoque, estoque_minimo, estado, fornecedor_id, imagem_1
) VALUES (
    'Rosa Vermelha', 'Flores', 'BellaFlor', 12.50, 100, 10, TRUE, 1, 'rosa_vermelha.jpg'
);

INSERT INTO cupons (
    codigo, tipo, descontofixo, descontoPorcentagem, descontofrete, validade, usos_permitidos, valor_minimo, estado, aplicacao
) VALUES (
    'BEMVINDO10', 'percentual', NULL, 10.00, NULL, '2025-12-31', 100, 50.00, TRUE, 'loja'
);

-- primeiro funcionário tem id=1 (inserido acima)
INSERT INTO usuarios_sistema (
    funcionario_id, tipo_usuario, usuario, senha, tema_preferido
) VALUES (
    1, 'Administrador', 'joaop', 'senha123', 'claro'
);

-- Usuário de loja (ligado ao cliente 1) para o carrinho funcionar
INSERT INTO usuarios_loja (cliente_id, usuario, senha)
VALUES (1, 'maria.silva', 'senha123');

-- carrinho da usuária da loja (id = 1)
INSERT INTO carrinho_de_compra (idUsuario, valorTotal)
VALUES (1, 0.00);

-- Conferências rápidas
SELECT * FROM clientes;
SELECT * FROM produtos;
SELECT * FROM cupons;
SELECT * FROM usuarios_sistema;
SELECT * FROM usuarios_loja;
SELECT * FROM carrinho_de_compra;
