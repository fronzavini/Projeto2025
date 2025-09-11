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

# Rotas para Clientes
@app.route('/clientes', methods=['GET'])
def listar_clientes():
    Cliente.listarClientes()
    return jsonify({"message": "Lista de clientes exibida no console."})

@app.route('/clientes', methods=['POST'])
def criar_cliente():
    dados = request.json
    mensagem = Cliente.criarCliente(**dados)
    return jsonify({"message": mensagem})

# Rotas para Funcionários
@app.route('/funcionarios', methods=['GET'])
def listar_funcionarios():
    Funcionario.listarFuncionarios()
    return jsonify({"message": "Lista de funcionários exibida no console."})

@app.route('/funcionarios', methods=['POST'])
def criar_funcionario():
    dados = request.json
    mensagem = Funcionario.criarFuncionario(**dados)
    return jsonify({"message": mensagem})

# Rotas para Produtos
@app.route('/produtos', methods=['GET'])
def listar_produtos():
    Produto.listarProdutos()
    return jsonify({"message": "Lista de produtos exibida no console."})

@app.route('/produtos', methods=['POST'])
def criar_produto():
    dados = request.json
    mensagem = Produto.criarProduto(**dados)
    return jsonify({"message": mensagem})

# Rotas para Fornecedores
@app.route('/fornecedores', methods=['GET'])
def listar_fornecedores():
    Fornecedor.listarFornecedores()
    return jsonify({"message": "Lista de fornecedores exibida no console."})

@app.route('/fornecedores', methods=['POST'])
def criar_fornecedor():
    dados = request.json
    mensagem = Fornecedor.criarFornecedor(**dados)
    return jsonify({"message": mensagem})

# Rotas para Cupons
@app.route('/cupons', methods=['GET'])
def listar_cupons():
    Cupom.listarCupons()
    return jsonify({"message": "Lista de cupons exibida no console."})

@app.route('/cupons', methods=['POST'])
def criar_cupom():
    dados = request.json
    mensagem = Cupom.criarCupom(**dados)
    return jsonify({"message": mensagem})

# Rotas para Serviços Personalizados
@app.route('/servicos', methods=['GET'])
def listar_servicos():
    ServicoPersonalizado.listarServicosPersonalizados()
    return jsonify({"message": "Lista de serviços personalizados exibida no console."})

@app.route('/servicos', methods=['POST'])
def criar_servico():
    dados = request.json
    mensagem = ServicoPersonalizado.criarServicoPersonalizado(**dados)
    return jsonify({"message": mensagem})

# Rotas para Carrinhos
@app.route('/carrinhos', methods=['GET'])
def listar_carrinhos():
    Carrinho.listarCarrinhos()
    return jsonify({"message": "Lista de carrinhos exibida no console."})

@app.route('/carrinhos', methods=['POST'])
def criar_carrinho():
    dados = request.json
    mensagem = Carrinho.criarCarrinho(**dados)
    return jsonify({"message": mensagem})

# Rotas para Vendas
@app.route('/vendas', methods=['GET'])
def listar_vendas():
    Venda.listarVendas()
    return jsonify({"message": "Lista de vendas exibida no console."})

@app.route('/vendas', methods=['POST'])
def criar_venda():
    dados = request.json
    mensagem = Venda.criarVenda(**dados)
    return jsonify({"message": mensagem})

# Rotas para Transações Financeiras
@app.route('/transacoes', methods=['GET'])
def listar_transacoes():
    TransacaoFinanceira.listarTransacoes()
    return jsonify({"message": "Lista de transações financeiras exibida no console."})

@app.route('/transacoes', methods=['POST'])
def criar_transacao():
    dados = request.json
    mensagem = TransacaoFinanceira.criarTransacao(**dados)
    return jsonify({"message": mensagem})


if __name__ == '__main__':
    app.run(debug=True)