from flask import Flask, jsonify, request
from datetime import datetime, timedelta, date
import mysql.connector
from classes import Cliente, Funcionario, Produto, Fornecedor, Cupom, ServicoPersonalizado, Carrinho, Venda, TransacaoFinanceira


def conectar_banco():
    try:
        conexao = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="bd_belladonna"
        )
        print("Conexao funcionando")
        return conexao
    except mysql.connector.Error as erro:
        print(f"Erro ao conectar ao banco de dados: {erro}")
        return None

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Bem-vindo ao Flask!"})


# ...existing code...

# Rotas para Cliente
@app.route('/criar_cliente', methods=['POST'])
def criar_cliente():
    dados = request.json
    mensagem = Cliente.criarCliente(**dados)
    return jsonify({"message": mensagem})

@app.route('/editar_cliente', methods=['PUT'])
def editar_cliente():
    dados = request.json
    mensagem = Cliente.editarCliente(**dados)
    return jsonify({"message": mensagem})

@app.route('/desativar_cliente', methods=['PATCH'])
def desativar_cliente():
    dados = request.json
    mensagem = Cliente.desativarCliente(**dados)
    return jsonify({"message": mensagem})

@app.route('/deletar_cliente', methods=['DELETE'])
def deletar_cliente():
    dados = request.json
    mensagem = Cliente.deletarCliente(**dados)
    return jsonify({"message": mensagem})

@app.route('/listar_cliente', methods=['GET'])
def listar_cliente():
    clientes = Cliente.listarClientes()
    return jsonify(clientes)

# Repita o mesmo padrão para as outras classes:
# Funcionario, Produto, Fornecedor, Cupom, ServicoPersonalizado, Carrinho, Venda, TransacaoFinanceira

# Exemplo para Funcionario:
@app.route('/criar_funcionario', methods=['GET','POST'])
def criar_funcionario():
    dados = request.json
    mensagem = Funcionario.criarFuncionario(**dados)
    return jsonify({"message": mensagem})

@app.route('/editar_funcionario', methods=['GET', 'POST'])
def editar_funcionario():
    dados = request.json
    mensagem = Funcionario.editarFuncionario(**dados)
    return jsonify({"message": mensagem})

@app.route('/desativar_funcionario', methods=['GET', 'POST'])
def desativar_funcionario():
    dados = request.json
    mensagem = Funcionario.desativarFuncionario(**dados)
    return jsonify({"message": mensagem})

@app.route('/deletar_funcionario', methods=['GET', 'POST'])
def deletar_funcionario():
    dados = request.json
    mensagem = Funcionario.deletarFuncionario(**dados)
    return jsonify({"message": mensagem})

@app.route('/listar_funcionario', methods=['GET', 'POST'])
def listar_funcionario():
    funcionarios = Funcionario.listarFuncionarios()
    return jsonify(funcionarios)


# Rotas para Produto
@app.route('/criar_produto', methods=['GET', 'POST'])
def criar_produto():
    dados = request.json
    mensagem = Produto.criarProduto(**dados)
    return jsonify({"message": mensagem})

@app.route('/editar_produto', methods=['GET', 'POST'])
def editar_produto():
    dados = request.json
    mensagem = Produto.editarProduto(**dados)
    return jsonify({"message": mensagem})

@app.route('/desativar_produto', methods=['GET', 'POST'])
def desativar_produto():
    dados = request.json
    mensagem = Produto.desativarProduto(**dados)
    return jsonify({"message": mensagem})

@app.route('/deletar_produto', methods=['GET', 'POST'])
def deletar_produto():
    dados = request.json
    mensagem = Produto.deletarProduto(**dados)
    return jsonify({"message": mensagem})

@app.route('/listar_produto', methods=['GET', 'POST'])
def listar_produto():
    produtos = Produto.listarProdutos()
    return jsonify(produtos)

# Rotas para Fornecedor
@app.route('/criar_fornecedor', methods=['GET', 'POST'])
def criar_fornecedor():
    dados = request.json
    mensagem = Fornecedor.criarFornecedor(**dados)
    return jsonify({"message": mensagem})

@app.route('/editar_fornecedor', methods=['GET', 'POST'])
def editar_fornecedor():
    dados = request.json
    mensagem = Fornecedor.editarFornecedor(**dados)
    return jsonify({"message": mensagem})

@app.route('/desativar_fornecedor', methods=['GET', 'POST'])
def desativar_fornecedor():
    dados = request.json
    mensagem = Fornecedor.desativarFornecedor(**dados)
    return jsonify({"message": mensagem})

@app.route('/deletar_fornecedor', methods=['GET', 'POST'])
def deletar_fornecedor():
    dados = request.json
    mensagem = Fornecedor.deletarFornecedor(**dados)
    return jsonify({"message": mensagem})

@app.route('/listar_fornecedor', methods=['GET', 'POST'])
def listar_fornecedor():
    fornecedores = Fornecedor.listarFornecedores()
    return jsonify(fornecedores)

# Rotas para Cupom
@app.route('/criar_cupom', methods=['GET', 'POST'])
def criar_cupom():
    dados = request.json
    mensagem = Cupom.criarCupom(**dados)
    return jsonify({"message": mensagem})

@app.route('/editar_cupom', methods=['GET', 'POST'])
def editar_cupom():
    dados = request.json
    mensagem = Cupom.editarCupom(**dados)
    return jsonify({"message": mensagem})

@app.route('/desativar_cupom', methods=['GET', 'POST'])
def desativar_cupom():
    dados = request.json
    mensagem = Cupom.desativarCupom(**dados)
    return jsonify({"message": mensagem})

@app.route('/deletar_cupom', methods=['GET', 'POST'])
def deletar_cupom():
    dados = request.json
    mensagem = Cupom.deletarCupom(**dados)
    return jsonify({"message": mensagem})

@app.route('/listar_cupom', methods=['GET', 'POST'])
def listar_cupom():
    cupons = Cupom.listarCupons()
    return jsonify(cupons)

# Rotas para ServicoPersonalizado
@app.route('/criar_servicopersonalizado', methods=['GET', 'POST'])
def criar_servicopersonalizado():
    dados = request.json
    mensagem = ServicoPersonalizado.criarServicoPersonalizado(**dados)
    return jsonify({"message": mensagem})

@app.route('/editar_servicopersonalizado', methods=['GET', 'POST'])
def editar_servicopersonalizado():
    dados = request.json
    mensagem = ServicoPersonalizado.editarServicoPersonalizado(**dados)
    return jsonify({"message": mensagem})

@app.route('/desativar_servicopersonalizado', methods=['GET', 'POST'])
def desativar_servicopersonalizado():
    dados = request.json
    mensagem = ServicoPersonalizado.desativarServicoPersonalizado(**dados)
    return jsonify({"message": mensagem})

@app.route('/deletar_servicopersonalizado', methods=['GET', 'POST'])
def deletar_servicopersonalizado():
    dados = request.json
    mensagem = ServicoPersonalizado.deletarServicoPersonalizado(**dados)
    return jsonify({"message": mensagem})

@app.route('/listar_servicopersonalizado', methods=['GET', 'POST'])
def listar_servicopersonalizado():
    servicos = ServicoPersonalizado.listarServicosPersonalizados()
    return jsonify(servicos)

# Rotas para Carrinho
@app.route('/criar_carrinho', methods=['GET', 'POST'])
def criar_carrinho():
    dados = request.json
    mensagem = Carrinho.criarCarrinho(**dados)
    return jsonify({"message": mensagem})

@app.route('/editar_carrinho', methods=['GET', 'POST'])
def editar_carrinho():
    dados = request.json
    mensagem = Carrinho.editarCarrinho(**dados)
    return jsonify({"message": mensagem})

@app.route('/desativar_carrinho', methods=['GET', 'POST'])
def desativar_carrinho():
    dados = request.json
    mensagem = Carrinho.desativarCarrinho(**dados)
    return jsonify({"message": mensagem})

@app.route('/deletar_carrinho', methods=['GET', 'POST'])
def deletar_carrinho():
    dados = request.json
    mensagem = Carrinho.deletarCarrinho(**dados)
    return jsonify({"message": mensagem})

@app.route('/listar_carrinho', methods=['GET', 'POST'])
def listar_carrinho():
    carrinhos = Carrinho.listarCarrinhos()
    return jsonify(carrinhos)

# Rotas para Venda
@app.route('/criar_venda', methods=['GET', 'POST'])
def criar_venda():
    dados = request.json
    mensagem = Venda.criarVenda(**dados)
    return jsonify({"message": mensagem})

@app.route('/editar_venda', methods=['GET', 'POST'])
def editar_venda():
    dados = request.json
    mensagem = Venda.editarVenda(**dados)
    return jsonify({"message": mensagem})

@app.route('/desativar_venda', methods=['GET', 'POST'])
def desativar_venda():
    dados = request.json
    mensagem = Venda.desativarVenda(**dados)
    return jsonify({"message": mensagem})

@app.route('/deletar_venda', methods=['GET', 'POST'])
def deletar_venda():
    dados = request.json
    mensagem = Venda.deletarVenda(**dados)
    return jsonify({"message": mensagem})

@app.route('/listar_venda', methods=['GET', 'POST'])
def listar_venda():
    vendas = Venda.listarVendas()
    return jsonify(vendas)

# Rotas para TransacaoFinanceira
@app.route('/criar_transacaofinanceira', methods=['GET', 'POST'])
def criar_transacaofinanceira():
    dados = request.json
    mensagem = TransacaoFinanceira.criarTransacaoFinanceira(**dados)
    return jsonify({"message": mensagem})

@app.route('/editar_transacaofinanceira', methods=['GET', 'POST'])
def editar_transacaofinanceira():
    dados = request.json
    mensagem = TransacaoFinanceira.editarTransacaoFinanceira(**dados)
    return jsonify({"message": mensagem})

@app.route('/desativar_transacaofinanceira', methods=['GET', 'POST'])
def desativar_transacaofinanceira():
    dados = request.json
    mensagem = TransacaoFinanceira.desativarTransacaoFinanceira(**dados)
    return jsonify({"message": mensagem})

@app.route('/deletar_transacaofinanceira', methods=['GET', 'POST'])
def deletar_transacaofinanceira():
    dados = request.json
    mensagem = TransacaoFinanceira.deletarTransacaoFinanceira(**dados)
    return jsonify({"message": mensagem})

@app.route('/listar_transacaofinanceira', methods=['GET', 'POST'])
def listar_transacaofinanceira():
    transacoes = TransacaoFinanceira.listarTransacoesFinanceiras()
    return jsonify(transacoes)
