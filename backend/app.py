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


#Rotas de Cliente
#curl -X POST http://127.0.0.1:5000/criar_cliente -H "Content-Type: application/json" -d "{\"nome\":\"João Silva\",\"tipo\":\"fisico\",\"email\":\"joao.silva@email.com\",\"senha\":\"senha123\",\"telefone\":\"11999999999\",\"cep\":\"12345678\",\"logradouro\":\"Rua A\",\"numero\":\"100\",\"bairro\":\"Centro\",\"complemento\":\"Apto 1\",\"uf\":\"SP\",\"cidade\":\"São Paulo\",\"cpf\":\"12345678900\",\"rg\":\"1234567\",\"sexo\":\"masculino\",\"data_nascimento\":\"2000-01-01\"}"
@app.route('/criar_cliente', methods=['POST'])
def criar_cliente():
    dados = request.json

    cliente_data = {
        "nome": dados.get("nome"),
        "tipo": dados.get("tipo"),
        "email": dados.get("email"),
        "senha": dados.get("senha", "cliente123"),
        "telefone": dados.get("telefone"),
        "endCep": dados.get("cep"),
        "endRua": dados.get("logradouro"),
        "endNumero": dados.get("numero"),
        "endBairro": dados.get("bairro"),
        "endComplemento": dados.get("complemento"),
        "endUF": dados.get("uf", ""),
        "endMunicipio": dados.get("cidade"),
        "cpf": dados.get("cpf") if dados.get("tipo") == "fisico" else None,
        "rg": dados.get("rg") if dados.get("tipo") == "fisico" else None,
        "sexo": dados.get("sexo", None),
        "dataNasc": dados.get("data_nascimento") if dados.get("tipo") == "fisico" else None,
        "cnpj": dados.get("cnpj") if dados.get("tipo") == "juridico" else None,
    }

    resultado = Cliente.criarCliente(**cliente_data)
    return jsonify(resultado)

#lembre de trocar o id caso esteja errado
#curl -X PUT http://127.0.0.1:5000/editar_cliente/1 -H "Content-Type: application/json" -d "{\"nome\":\"João Silva\",\"email\":\"joao.silva@email.com\",\"telefone\":\"11999999999\",\"cep\":\"12345678\",\"logradouro\":\"Rua B\",\"cpf\":\"12345678900\",\"rg\":\"1234567\",\"sexo\":\"masculino\",\"data_nascimento\":\"2000-01-01\"}"
@app.route('/editar_cliente/<int:id>', methods=['PUT'])
def editar_cliente(id):
    dados = request.json

    resultado = Cliente.editarCliente(
        id=id,
        nome=dados.get("nome"),
        email=dados.get("email"),
        senha=dados.get("senha"),
        telefone=dados.get("telefone"),
        endCep=dados.get("cep"),
        endRua=dados.get("logradouro"),
        endNumero=dados.get("numero"),
        endBairro=dados.get("bairro"),
        endComplemento=dados.get("complemento"),
        endUF=dados.get("uf"),
        endMunicipio=dados.get("cidade"),
        cpf=dados.get("cpf"),
        rg=dados.get("rg"),
        sexo=dados.get("sexo"),
        dataNasc=dados.get("data_nascimento"),
        cnpj=dados.get("cnpj")
    )
    return jsonify({"message": "Cliente atualizado com sucesso."})

#lembre de trocar o id caso esteja errado
#curl -X PATCH http://127.0.0.1:5000/desativar_cliente/1
@app.route('/desativar_cliente/<int:id>', methods=['PATCH'])
def desativar_cliente(id):
    resultado = Cliente.desativarCliente(id)
    return jsonify({"message": resultado})

#lembre de trocar o id caso esteja errado
#curl -X DELETE http://127.0.0.1:5000/deletar_cliente/1
@app.route('/deletar_cliente/<int:id>', methods=['DELETE'])
def deletar_cliente(id):
    resultado = Cliente.excluirCliente(id)
    return jsonify({"message": resultado})


#curl -X GET http://127.0.0.1:5000/listar_cliente
@app.route('/listar_clientes', methods=['GET'])
def listar_clientes():
    clientes = Cliente.listarClientes()
    return jsonify(clientes)


# Funcionario
@app.route('/criar_funcionario', methods=['GET','POST'])
def criar_funcionario():
    dados = request.json
    Funcionario.criarFuncionario(**dados)
    return jsonify({"message": "Funcionario criado com sucesso"})


@app.route('/editar_funcionario', methods=['GET', 'POST'])
def editar_funcionario():
    dados = request.json
    Funcionario.editarFuncionario(**dados)
    return jsonify({"message": "Funcionario atualizado com sucesso"})


@app.route('/desativar_funcionario', methods=['GET', 'POST'])
def desativar_funcionario():
    dados = request.json
    Funcionario.desativarFuncionario(**dados)
    return jsonify({"message": "Funcionario desativado com sucesso"})


@app.route('/deletar_funcionario', methods=['GET', 'POST'])
def deletar_funcionario():
    dados = request.json
    Funcionario.deletarFuncionario(**dados)
    return jsonify({"message": "Funcionario deletado com sucesso"})


@app.route('/listar_funcionario', methods=['GET', 'POST'])
def listar_funcionario():
    funcionarios = Funcionario.listarFuncionarios()
    return jsonify(funcionarios)


# Produto
@app.route('/criar_produto', methods=['GET', 'POST'])
def criar_produto():
    dados = request.json
    Produto.criarProduto(**dados)
    return jsonify({"message": "Produto criado com sucesso"})


@app.route('/editar_produto', methods=['GET', 'POST'])
def editar_produto():
    dados = request.json
    Produto.editarProduto(**dados)
    return jsonify({"message": "Produto atualizado com sucesso"})


@app.route('/desativar_produto', methods=['GET', 'POST'])
def desativar_produto():
    dados = request.json
    Produto.desativarProduto(**dados)
    return jsonify({"message": "Produto desativado com sucesso"})


@app.route('/deletar_produto', methods=['GET', 'POST'])
def deletar_produto():
    dados = request.json
    Produto.deletarProduto(**dados)
    return jsonify({"message": "Produto deletado com sucesso"})


@app.route('/listar_produto', methods=['GET', 'POST'])
def listar_produto():
    produtos = Produto.listarProdutos()
    return jsonify(produtos)


# Fornecedor
@app.route('/criar_fornecedor', methods=['GET', 'POST'])
def criar_fornecedor():
    dados = request.json
    Fornecedor.criarFornecedor(**dados)
    return jsonify({"message": "Fornecedor criado com sucesso"})


@app.route('/editar_fornecedor', methods=['GET', 'POST'])
def editar_fornecedor():
    dados = request.json
    Fornecedor.editarFornecedor(**dados)
    return jsonify({"message": "Fornecedor atualizado com sucesso"})


@app.route('/desativar_fornecedor', methods=['GET', 'POST'])
def desativar_fornecedor():
    dados = request.json
    Fornecedor.desativarFornecedor(**dados)
    return jsonify({"message": "Fornecedor desativado com sucesso"})


@app.route('/deletar_fornecedor', methods=['GET', 'POST'])
def deletar_fornecedor():
    dados = request.json
    Fornecedor.deletarFornecedor(**dados)
    return jsonify({"message": "Fornecedor deletado com sucesso"})


@app.route('/listar_fornecedor', methods=['GET', 'POST'])
def listar_fornecedor():
    fornecedores = Fornecedor.listarFornecedores()
    return jsonify(fornecedores)


# Cupom
@app.route('/criar_cupom', methods=['GET', 'POST'])
def criar_cupom():
    dados = request.json
    Cupom.criarCupom(**dados)
    return jsonify({"message": "Cupom criado com sucesso"})


@app.route('/editar_cupom', methods=['GET', 'POST'])
def editar_cupom():
    dados = request.json
    Cupom.editarCupom(**dados)
    return jsonify({"message": "Cupom atualizado com sucesso"})


@app.route('/desativar_cupom', methods=['GET', 'POST'])
def desativar_cupom():
    dados = request.json
    Cupom.desativarCupom(**dados)
    return jsonify({"message": "Cupom desativado com sucesso"})


@app.route('/deletar_cupom', methods=['GET', 'POST'])
def deletar_cupom():
    dados = request.json
    Cupom.deletarCupom(**dados)
    return jsonify({"message": "Cupom deletado com sucesso"})


@app.route('/listar_cupom', methods=['GET', 'POST'])
def listar_cupom():
    cupons = Cupom.listarCupons()
    return jsonify(cupons)


# ServicoPersonalizado
@app.route('/criar_servicopersonalizado', methods=['GET', 'POST'])
def criar_servicopersonalizado():
    dados = request.json
    ServicoPersonalizado.criarServicoPersonalizado(**dados)
    return jsonify({"message": "Serviço personalizado criado com sucesso"})


@app.route('/editar_servicopersonalizado', methods=['GET', 'POST'])
def editar_servicopersonalizado():
    dados = request.json
    ServicoPersonalizado.editarServicoPersonalizado(**dados)
    return jsonify({"message": "Serviço personalizado atualizado com sucesso"})


@app.route('/desativar_servicopersonalizado', methods=['GET', 'POST'])
def desativar_servicopersonalizado():
    dados = request.json
    ServicoPersonalizado.desativarServicoPersonalizado(**dados)
    return jsonify({"message": "Serviço personalizado desativado com sucesso"})


@app.route('/deletar_servicopersonalizado', methods=['GET', 'POST'])
def deletar_servicopersonalizado():
    dados = request.json
    ServicoPersonalizado.deletarServicoPersonalizado(**dados)
    return jsonify({"message": "Serviço personalizado deletado com sucesso"})


@app.route('/listar_servicopersonalizado', methods=['GET', 'POST'])
def listar_servicopersonalizado():
    servicos = ServicoPersonalizado.listarServicosPersonalizados()
    return jsonify(servicos)


# Carrinho
@app.route('/criar_carrinho', methods=['GET', 'POST'])
def criar_carrinho():
    dados = request.json
    Carrinho.criarCarrinho(**dados)
    return jsonify({"message": "Carrinho criado com sucesso"})


@app.route('/editar_carrinho', methods=['GET', 'POST'])
def editar_carrinho():
    dados = request.json
    Carrinho.editarCarrinho(**dados)
    return jsonify({"message": "Carrinho atualizado com sucesso"})


@app.route('/desativar_carrinho', methods=['GET', 'POST'])
def desativar_carrinho():
    dados = request.json
    Carrinho.desativarCarrinho(**dados)
    return jsonify({"message": "Carrinho desativado com sucesso"})


@app.route('/deletar_carrinho', methods=['GET', 'POST'])
def deletar_carrinho():
    dados = request.json
    Carrinho.deletarCarrinho(**dados)
    return jsonify({"message": "Carrinho deletado com sucesso"})


@app.route('/listar_carrinho', methods=['GET', 'POST'])
def listar_carrinho():
    carrinhos = Carrinho.listarCarrinhos()
    return jsonify(carrinhos)


# Venda
@app.route('/criar_venda', methods=['GET', 'POST'])
def criar_venda():
    dados = request.json
    Venda.criarVenda(**dados)
    return jsonify({"message": "Venda criada com sucesso"})


@app.route('/editar_venda', methods=['GET', 'POST'])
def editar_venda():
    dados = request.json
    Venda.editarVenda(**dados)
    return jsonify({"message": "Venda atualizada com sucesso"})


@app.route('/desativar_venda', methods=['GET', 'POST'])
def desativar_venda():
    dados = request.json
    Venda.desativarVenda(**dados)
    return jsonify({"message": "Venda desativada com sucesso"})


@app.route('/deletar_venda', methods=['GET', 'POST'])
def deletar_venda():
    dados = request.json
    Venda.deletarVenda(**dados)
    return jsonify({"message": "Venda deletada com sucesso"})


@app.route('/listar_venda', methods=['GET', 'POST'])
def listar_venda():
    vendas = Venda.listarVendas()
    return jsonify(vendas)


# TransacaoFinanceira
@app.route('/criar_transacaofinanceira', methods=['GET', 'POST'])
def criar_transacaofinanceira():
    dados = request.json
    TransacaoFinanceira.criarTransacaoFinanceira(**dados)
    return jsonify({"message": "Transação financeira criada com sucesso"})


@app.route('/editar_transacaofinanceira', methods=['GET', 'POST'])
def editar_transacaofinanceira():
    dados = request.json
    TransacaoFinanceira.editarTransacaoFinanceira(**dados)
    return jsonify({"message": "Transação financeira atualizada com sucesso"})


@app.route('/desativar_transacaofinanceira', methods=['GET', 'POST'])
def desativar_transacaofinanceira():
    dados = request.json
    TransacaoFinanceira.desativarTransacaoFinanceira(**dados)
    return jsonify({"message": "Transação financeira desativada com sucesso"})


@app.route('/deletar_transacaofinanceira', methods=['GET', 'POST'])
def deletar_transacaofinanceira():
    dados = request.json
    TransacaoFinanceira.deletarTransacaoFinanceira(**dados)
    return jsonify({"message": "Transação financeira deletada com sucesso"})


@app.route('/listar_transacaofinanceira', methods=['GET', 'POST'])
def listar_transacaofinanceira():
    transacoes = TransacaoFinanceira.listarTransacoesFinanceiras()
    return jsonify(transacoes)

if __name__ == "__main__":
    app.run(debug=True)