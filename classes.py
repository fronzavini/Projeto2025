class Pessoa:
    def __init__(self, id, nome, status, dataCadastro, email, telefone, endCep, endRua, endBairro, endComplemento, endUF):
        self.id = id
        self.nome = nome
        self.status = status
        self.dataCadastro = dataCadastro
        self.email = email
        self.telefone = telefone
        self.endCep = endCep
        self.endRua = endRua
        self.endBairro = endBairro
        self.endComplemento = endComplemento
        self.endUF = endUF

class PessoaFisica(Pessoa):
    def __init__(self, cpf, rg, sexo, dataNasc, **kwargs): #**kwargs é uma forma do Python permitir que você passe um número variável de argumentos nomeados (ou seja, com chave e valor) para uma função ou método.    
        super().__init__(**kwargs)
        self.cpf = cpf
        self.rg = rg
        self.sexo = sexo
        self.dataNasc = dataNasc

class PessoaJuridica(Pessoa):
    def __init__(self, cnpj, **kwargs):
        super().__init__(**kwargs)
        self.cnpj = cnpj

class Cliente(PessoaFisica):
    def __init__(self, senha, **kwargs):
        super().__init__(**kwargs)
        self.senha = senha

class Funcionario(PessoaFisica):
    def __init__(self, funcao, salario, dataContratacao, senha, **kwargs):
        super().__init__(**kwargs)
        self.funcao = funcao
        self.salario = salario
        self.dataContratacao = dataContratacao
        self.senha = senha

class Produto:
    def __init__(self, id, nome, categoria, marca, preco, quantidadeEstoque, status):
        self.id = id
        self.nome = nome
        self.categoria = categoria
        self.marca = marca
        self.preco = preco
        self.quantidadeEstoque = quantidadeEstoque
        self.status = status

class Cupom:
    def __init__(self, id, nome, codigo, dataValidade, usosPermitidos, regrasAplicacao, status, descontoFixo, descontoPorcentagem):
        self.id = id
        self.nome = nome
        self.codigo = codigo
        self.dataValidade = dataValidade
        self.usosPermitidos = usosPermitidos
        self.regrasAplicacao = regrasAplicacao
        self.status = status
        self.descontoFixo = descontoFixo
        self.descontoPorcentagem = descontoPorcentagem

class ServicoPersonalizado:
    def __init__(self, id, nome, produtos, preco, status):
        self.id = id
        self.nome = nome
        self.produtos = produtos
        self.preco = preco
        self.status = status

class Carrinho:
    def __init__(self, id, idCliente):
        self.id = id
        self.idCliente = idCliente
        self.produtos = []
        self.valorTotal = 0.0

class Venda:
    def __init__(self, id, cliente, funcionario, produtos, valorTotal, dataVenda, entrega, dataEntrega):
        self.id = id
        self.cliente = cliente
        self.funcionario = funcionario
        self.produtos = produtos
        self.valorTotal = valorTotal
        self.dataVenda = dataVenda
        self.entrega = entrega
        self.dataEntrega = dataEntrega

class Fornecedor:
    def __init__(self, id):
        self.id = id
        self.produtos_fornecidos = []