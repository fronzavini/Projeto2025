CREATE DATABASE IF NOT EXISTS bd_belladonna;
USE bd_belladonna;

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
    endComplemento VARCHAR(50) NOT NULL,
    endUF CHAR(2) NOT NULL,
    endMunicipio VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
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
    endComplemento VARCHAR(50) NOT NULL,
    endUF CHAR(2) NOT NULL,
    endMunicipio VARCHAR(50) NOT NULL,
    funcao VARCHAR(50) NOT NULL,
    salario DECIMAL(10,2),
    dataContratacao DATE
);

CREATE TABLE IF NOT EXISTS fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome_empresa VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    endCep VARCHAR(10) NOT NULL,
    endRua VARCHAR(100) NOT NULL,
    endNumero VARCHAR(10) NOT NULL,
    endBairro VARCHAR(50) NOT NULL,
    endComplemento VARCHAR(50) NOT NULL,
    endUF CHAR(2) NOT NULL,
    endMunicipio VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS produtos (
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

CREATE TABLE IF NOT EXISTS imagens_produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    imagem LONGBLOB NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS servicos_personalizados (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    produtos TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    status BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE IF NOT EXISTS carrinho_de_compra (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idCliente INT NOT NULL,
    valorTotal DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (idCliente) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS vendas (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    cliente INT,
    funcionario INT,
    pedido INT
    produtos TEXT NOT NULL,
    valorTotal DECIMAL(10,2) NOT NULL,
    dataVenda DATE,
    #--entrega VARCHAR(100),
    #--dataEntrega DATE,
    pago BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (cliente) REFERENCES clientes(id),
    FOREIGN KEY (funcionario) REFERENCES funcionarios(id),
    FOREIGN KEY (pedido) REFERENCES pedidos(id)
);

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
    estado BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    funcionario_id INT,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    forma_pagamento ENUM('dinheiro', 'pix'),#--, 'cartao_credito', 'cartao_debito'),
    estado ENUM('recebido', 'em_preparacao', 'enviado', 'entregue', 'cancelado'),
    canal ENUM('presencial', 'online'),
    valor_total DECIMAL(10,2),
    tipo_entrega ENUM('retirada', 'entrega'),
    data_entrega DATE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

CREATE TABLE IF NOT EXISTS itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_id INT,
    quantidade INT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS transacoes_financeiras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_transacao DATETIME DEFAULT CURRENT_TIMESTAMP, 
    tipo ENUM('entrada', 'saida'),
    categoria VARCHAR(50),
    descricao TEXT,
    valor DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS usuarios_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    funcionario_id INT NOT NULL UNIQUE,
    tipo_usuario ENUM('Administrador', 'Vendedor', 'Estoque') NOT NULL,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    tema_preferido VARCHAR(50) DEFAULT 'claro',
    --idioma VARCHAR(10) DEFAULT 'pt_BR',
    --notificacoes_email BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

CREATE TABLE IF NOT EXISTS usuarios_loja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL UNIQUE,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
