#Criação do banco de dados
CREATE DATABASE IF NOT EXISTS bd_belladonna;
USE bd_belladonna;

-- Tabela: clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('fisico', 'juridico') NOT NULL,
    estado BOOLEAN DEFAULT TRUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14),
    cnpj VARCHAR(18),
    rg VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    senha varchar(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    data_nascimento DATE,
    cep VARCHAR(10),
    logradouro VARCHAR(100),
    numero VARCHAR(10),
    bairro VARCHAR(50),
    complemento VARCHAR(50),
    uf CHAR(2)
);

-- Tabela: funcionarios
CREATE TABLE funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    rg VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo ENUM('masculino', 'feminino', 'outro') NOT NULL,
    email VARCHAR(100) NOT NULL,
	senha varchar(100) NOT NULL,
    estado BOOLEAN DEFAULT TRUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    cep VARCHAR(10),
    logradouro VARCHAR(100),
    numero VARCHAR(10),
    bairro VARCHAR(50),
    complemento VARCHAR(50),
    uf CHAR(2),
    funcao VARCHAR(50) NOT NULL
);

-- Tabela: fornecedores
CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome_empresa VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    complemento VARCHAR(50) NOT NULL,
    uf CHAR(2) NOT NULL
);

-- Tabela: produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade_estoque INT NOT NULL,
    estoque_minimo INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE NOT NULL,
    fornecedor_id INT,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);


-- Tabela: pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    funcionario_id INT,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    forma_pagamento ENUM('dinheiro', 'pix', 'cartao_credito', 'cartao_debito'),
    estado ENUM('recebido', 'em_preparacao', 'enviado', 'entregue', 'cancelado'),
    canal ENUM('presencial', 'online'),
    valor_total DECIMAL(10,2),
    tipo_entrega ENUM('retirada', 'entrega'),
    data_entrega DATE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

-- como conectamos essas tabelas?

-- Tabela: itens_pedido
CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_id INT,
    quantidade INT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Tabela: transacoes_financeiras
CREATE TABLE transacoes_financeiras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('entrada', 'saida'),
    categoria VARCHAR(50),
    descricao TEXT,
    valor DECIMAL(10,2),
    data DATE
);

-- Tabela: cupons
CREATE TABLE cupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE,
    tipo ENUM('percentual', 'valor_fixo'),
    descontofixo DECIMAL(10,2),
    descontoPorcentagem decimal(1,2),
    descontofrete decimal(10,2),
    validade DATE,
    usos_permitidos INT,
    usos_realizados INT DEFAULT 0,
    valor_minimo DECIMAL(10,2),
    estado ENUM('ativo', 'inativo')
);
