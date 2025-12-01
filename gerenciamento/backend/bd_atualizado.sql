CREATE DATABASE IF NOT EXISTS bd_belladonna;
USE bd_belladonna;

SET FOREIGN_KEY_CHECKS = 0;

-- ==============================================
--  CLIENTES
-- ==============================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dataCadastro DATE,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('fisico', 'juridico') NOT NULL,
    sexo ENUM('masculino', 'feminino', 'outro'),
    cpf VARCHAR(14),
    cnpj VARCHAR(18),
    rg VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    dataNasc DATE,
    estado BOOLEAN DEFAULT TRUE NOT NULL,
    endCep VARCHAR(10) NOT NULL,
    endRua VARCHAR(100) NOT NULL,
    endNumero VARCHAR(10) NOT NULL,
    endBairro VARCHAR(50) NOT NULL,
    endComplemento VARCHAR(50),
    endUF CHAR(2) NOT NULL,
    endMunicipio VARCHAR(50) NOT NULL
);

-- ==============================================
--  FUNCIONÁRIOS
-- ==============================================
CREATE TABLE IF NOT EXISTS funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    rg VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo ENUM('masculino', 'feminino', 'outro') NOT NULL,
    email VARCHAR(100) NOT NULL,
    estado BOOLEAN DEFAULT TRUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endCep VARCHAR(10) NOT NULL,
    endRua VARCHAR(100) NOT NULL,
    endNumero VARCHAR(10) NOT NULL,
    endBairro VARCHAR(50) NOT NULL,
    endComplemento VARCHAR(50),
    endUF CHAR(2) NOT NULL,
    endMunicipio VARCHAR(50) NOT NULL,
    funcao VARCHAR(50) NOT NULL,
    salario DECIMAL(10,2),
    dataContratacao DATE
);

-- ==============================================
--  FORNECEDORES
-- ==============================================
CREATE TABLE IF NOT EXISTS fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_empresa VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    endCep VARCHAR(10) NOT NULL,
    endRua VARCHAR(100) NOT NULL,
    endNumero VARCHAR(10) NOT NULL,
    endBairro VARCHAR(50) NOT NULL,
    endComplemento VARCHAR(50),
    endUF CHAR(2) NOT NULL,
    endMunicipio VARCHAR(50) NOT NULL
);

-- ==============================================
--  PRODUTOS
-- ==============================================
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade_estoque INT NOT NULL,
    estoque_minimo INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE NOT NULL,
    fornecedor_id INT,
    imagem_1 TEXT,
    imagem_2 TEXT,
    imagem_3 TEXT,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

-- ==============================================
--  SERVIÇOS PERSONALIZADOS
-- ==============================================
CREATE TABLE IF NOT EXISTS servicos_personalizados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    produtos TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    status BOOLEAN DEFAULT TRUE NOT NULL
);

-- ==============================================
--  CARRINHO DE COMPRA
-- ==============================================
CREATE TABLE IF NOT EXISTS carrinho_de_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    valorTotal DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (idUsuario) REFERENCES clientes(id)
);

-- ==============================================
--  ITENS DO CARRINHO
-- ==============================================
CREATE TABLE IF NOT EXISTS itens_carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrinho_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (carrinho_id) REFERENCES carrinho_de_compra(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- ==============================================
--  PEDIDOS
-- ==============================================
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    funcionario_id INT,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    forma_pagamento ENUM('dinheiro', 'pix') NOT NULL,
    estado ENUM('recebido', 'em_preparacao', 'enviado', 'entregue', 'cancelado'),
    canal ENUM('presencial', 'online'),
    valor_total DECIMAL(10,2),
    tipo_entrega ENUM('retirada', 'entrega'),
    data_entrega DATE,
    mp_payment_id VARCHAR(64),
    mp_status VARCHAR(32),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

-- ==============================================
--  ITENS DO PEDIDO
-- ==============================================
CREATE TABLE IF NOT EXISTS itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_id INT,
    quantidade INT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- ==============================================
--  VENDAS
-- ==============================================
CREATE TABLE IF NOT EXISTS vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente INT,
    funcionario INT,
    pedido INT,
    produtos TEXT NOT NULL,
    valorTotal DECIMAL(10,2) NOT NULL,
    dataVenda DATE,
    pago BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (cliente) REFERENCES clientes(id),
    FOREIGN KEY (funcionario) REFERENCES funcionarios(id),
    FOREIGN KEY (pedido) REFERENCES pedidos(id)
);

-- ==============================================
--  CUPONS
-- ==============================================
CREATE TABLE IF NOT EXISTS cupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE,
    tipo ENUM('percentual', 'valor_fixo'),
    descontofixo DECIMAL(10,2),
    descontoPorcentagem DECIMAL(10,2),
    descontofrete DECIMAL(10,2),
    validade DATE,
    usos_permitidos INT,
    usos_realizados INT DEFAULT 0,
    valor_minimo DECIMAL(10,2),
    estado BOOLEAN DEFAULT TRUE NOT NULL,
    aplicacao VARCHAR(64),
    tipo_produto VARCHAR(255)
);

-- ==============================================
--  TRANSAÇÕES FINANCEIRAS
-- ==============================================
CREATE TABLE IF NOT EXISTS transacoes_financeiras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_transacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('entrada', 'saida'),
    categoria VARCHAR(50),
    descricao TEXT,
    valor DECIMAL(10,2)
);

-- ==============================================
--  USUÁRIOS DO SISTEMA (FUNCIONÁRIOS)
-- ==============================================
CREATE TABLE IF NOT EXISTS usuarios_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    funcionario_id INT NOT NULL UNIQUE,
    tipo_usuario ENUM('Administrador', 'Vendedor', 'Estoque') NOT NULL,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    tema_preferido VARCHAR(50) DEFAULT 'claro',
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

-- ==============================================
--  USUÁRIOS DA LOJA (CLIENTES)
-- ==============================================
CREATE TABLE IF NOT EXISTS usuarios_loja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL UNIQUE,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================
--  DADOS DE EXEMPLO
-- ==============================================

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
    'joao.pereira@email.com', TRUE, '(31) 98888-7777', '30123-789', 'Av. Brasil', 
    '456', 'Centro', 'Sala 2', 'MG', 'Belo Horizonte', 'Administrador', 4500.00, CURDATE()
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

INSERT INTO usuarios_sistema (
    funcionario_id, tipo_usuario, usuario, senha, tema_preferido
) VALUES (
    1, 'Administrador', 'joaop', 'senha123', 'claro'
);

-- ==============================================
--  ÍNDICES E CONSULTAS DE TESTE
-- ==============================================
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_cupons_codigo ON cupons(codigo);
CREATE INDEX idx_produtos_nome ON produtos(nome);

-- Consultas rápidas de verificação
SELECT * FROM clientes;
SELECT * FROM produtos;
SELECT * FROM cupons;
SELECT * FROM carrinho_de_compra;
SELECT * FROM itens_carrinho;
