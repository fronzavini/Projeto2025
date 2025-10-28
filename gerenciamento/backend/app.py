from flask import Flask, jsonify, request
from datetime import datetime, timedelta, date
import pymysql
from classes import Cliente, Funcionario, Produto, Fornecedor, Cupom, ServicoPersonalizado, Carrinho, Venda, TransacaoFinanceira
from flask_cors import CORS
from pymysql.err import MySQLError


app = Flask(__name__)
CORS(app)  # permite todas as origens


def conectar_banco():
    try:
        conexao = pymysql.connect(
            host="localhost",
            user="root",
            password="root",
            database="bd_belladonna"
        )
        print("Conexao funcionando")
        return conexao
    except MySQLError as erro:
        print(f"Erro ao conectar ao banco de dados: {erro}")
        return None




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
        "senha": dados.get("senha", "cliente123") if dados.get("senha") else None,
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

    cliente_data = {
        "id": id,
        "nome": dados.get("nome"),
        "email": dados.get("email"),
        "senha": dados.get("senha"),
        "telefone": dados.get("telefone"),
        "endCep": dados.get("cep"),
        "endRua": dados.get("logradouro"),
        "endNumero": dados.get("numero"),
        "endBairro": dados.get("bairro"),
        "endComplemento": dados.get("complemento"),
        "endUF": dados.get("uf"),
        "endMunicipio": dados.get("cidade"),
        "cpf": dados.get("cpf"),
        "rg": dados.get("rg"),
        "sexo": dados.get("sexo"),
        "dataNasc": dados.get("data_nascimento"),
        "cnpj": dados.get("cnpj"),
    }

    editado = Cliente.editarCliente(**cliente_data)
    return jsonify({'resultado': 'ok',
                    'detalhes': editado})


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
    try:
        clientes = Cliente.listarClientes()  # supondo que retorne lista de dicts
        return jsonify({
            "resultado": "ok",
            "detalhes": clientes
        })
    except Exception as e:
        return jsonify({
            "resultado": "erro",
            "detalhes": str(e)
        }), 500


#Rotas de Funcionario
#curl -X POST http://127.0.0.1:5000/criar_funcionario -H "Content-Type: application/json" -d "{\"nome\":\"Maria Souza\",\"cpf\":\"12345678901\",\"rg\":\"1234567\",\"data_nascimento\":\"1990-05-10\",\"sexo\":\"feminino\",\"email\":\"maria.souza@email.com\",\"senha\":\"senha123\",\"telefone\":\"11988887777\",\"cep\":\"12345678\",\"logradouro\":\"Rua X\",\"numero\":\"200\",\"bairro\":\"Centro\",\"complemento\":\"Apto 5\",\"uf\":\"SP\",\"cidade\":\"São Paulo\",\"funcao\":\"vendedora\",\"salario\":2500.00,\"dataContratacao\":\"2023-01-15\"}"
@app.route('/criar_funcionario', methods=['POST'])
def criar_funcionario():
    dados = request.json
    funcionario_data = {
        "nome": dados.get("nome"),
        "email": dados.get("email"),
        "senha": dados.get("senha", "func123"),
        "telefone": dados.get("telefone"),
        "endCep": dados.get("cep"),
        "endRua": dados.get("logradouro"),
        "endNumero": dados.get("numero"),
        "endBairro": dados.get("bairro"),
        "endComplemento": dados.get("complemento"),
        "endUF": dados.get("uf"),
        "endMunicipio": dados.get("cidade"),
        "cpf": dados.get("cpf"),
        "rg": dados.get("rg"),
        "sexo": dados.get("sexo"),
        "dataNasc": dados.get("data_nascimento"),
        "funcao": dados.get("funcao"),
        "salario": dados.get("salario"),
        "dataContratacao": dados.get("dataContratacao"),
    }

    resultado = Funcionario.criarFuncionario(**funcionario_data)
    return jsonify({"message": resultado})



#curl -X PUT http://127.0.0.1:5000/editar_funcionario/1 -H "Content-Type: application/json" -d "{\"nome\":\"Maria Souza\",\"email\":\"maria.nova@email.com\",\"telefone\":\"11988887777\",\"cep\":\"98765432\",\"logradouro\":\"Rua Y\",\"funcao\":\"gerente\",\"salario\":3500.00}"
@app.route('/editar_funcionario/<int:id>', methods=['PUT'])
def editar_funcionario(id):
    dados = request.json

    resultado = Funcionario.editarFuncionario(
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
        funcao=dados.get("funcao"),
        salario=dados.get("salario"),
        dataContratacao=dados.get("dataContratacao"),
    )
    return jsonify({"message": resultado})


#curl -X PATCH http://127.0.0.1:5000/desativar_funcionario/1
@app.route('/desativar_funcionario/<int:id>', methods=['PATCH'])
def desativar_funcionario(id):
    resultado = Funcionario.desativarFuncionario(id)
    return jsonify({"message": resultado})


#curl -X DELETE http://127.0.0.1:5000/deletar_funcionario/1
@app.route('/deletar_funcionario/<int:id>', methods=['DELETE'])
def deletar_funcionario(id):
    resultado = Funcionario.excluirFuncionario(id)
    return jsonify({"message": resultado})


#curl -X GET http://127.0.0.1:5000/listar_funcionarios
@app.route('/listar_funcionarios', methods=['GET'])
def listar_funcionarios():
    funcionarios = Funcionario.listarFuncionarios()
    return jsonify(funcionarios)



# Produto
#curl -X POST http://127.0.0.1:5000/criar_produto -H "Content-Type: application/json" -d "{\"nome\":\"Rosa Vermelha\",\"categoria\":\"Flores\",\"marca\":\"BellaDonna\",\"preco\":15.50,\"quantidadeEstoque\":100}"
@app.route('/criar_produto', methods=['POST'])
def criar_produto():
    dados = request.json
    resultado = Produto.criarProduto(
        nome=dados.get("nome"),
        categoria=dados.get("categoria"),
        marca=dados.get("marca"),
        preco=dados.get("preco"),
        quantidadeEstoque=dados.get("quantidadeEstoque")
    )
    return jsonify({"message": resultado})


#curl -X PUT http://127.0.0.1:5000/editar_produto/1 -H "Content-Type: application/json" -d "{\"nome\":\"Rosa Branca\",\"preco\":18.00,\"quantidadeEstoque\":80}"
@app.route('/editar_produto/<int:id>', methods=['PUT'])
def editar_produto(id):
    dados = request.json
    resultado = Produto.editarProduto(
        id=id,
        nome=dados.get("nome"),
        categoria=dados.get("categoria"),
        marca=dados.get("marca"),
        preco=dados.get("preco"),
        quantidadeEstoque=dados.get("quantidadeEstoque")
    )
    return jsonify({"message": "Produto atualizado com sucesso."})


#curl -X PATCH http://127.0.0.1:5000/desativar_produto/1
@app.route('/desativar_produto/<int:id>', methods=['PATCH'])
def desativar_produto(id):
    resultado = Produto.desativarProduto(id)
    return jsonify({"message": resultado})


#curl -X DELETE http://127.0.0.1:5000/deletar_produto/1
@app.route('/deletar_produto/<int:id>', methods=['DELETE'])
def deletar_produto(id):
    resultado = Produto.excluirProduto(id)
    return jsonify({"message": resultado})


#curl -X GET http://127.0.0.1:5000/listar_produtos
@app.route('/listar_produtos', methods=['GET'])
def listar_produtos():
    produtos = Produto.listarProdutos()
    return jsonify(produtos)

#curl -X POST http://127.0.0.1:5000/criar_fornecedor -H "Content-Type: application/json" -d '{"nome_empresa":"Fornecedora X","cnpj":"12345678000199","telefone":"11977776666","email":"fornecedor@email.com","cep":"12345678","logradouro":"Rua Z","numero":"50","bairro":"Centro","complemento":"Sala 2","uf":"SP","cidade":"São Paulo"}'
@app.route('/criar_fornecedor', methods=['POST'])
def criar_fornecedor():
    dados = request.json
    # nome_empresa ou nome
    nome_empresa = dados.get("nome_empresa") or dados.get("nome")
    resultado = Fornecedor.criarFornecedor(
        nome_empresa=nome_empresa,
        cnpj=dados.get("cnpj"),
        telefone=dados.get("telefone"),
        email=dados.get("email"),
        endCep=dados.get("cep"),
        endRua=dados.get("logradouro"),
        endNumero=dados.get("numero"),
        endBairro=dados.get("bairro"),
        endComplemento=dados.get("complemento"),
        endUF=dados.get("uf"),
        endMunicipio=dados.get("cidade")
    )
    return jsonify({"message": resultado})


#curl -X PUT http://127.0.0.1:5000/editar_fornecedor/1 -H "Content-Type: application/json" -d '{"nome_empresa":"Fornecedora Y","cnpj":"12345678000199","telefone":"11977776666","email":"fornecedor@email.com","cep":"87654321","logradouro":"Rua W","numero":"60","bairro":"Centro","complemento":"Sala 3","uf":"SP","cidade":"São Paulo"}'
@app.route('/editar_fornecedor/<int:id>', methods=['PUT'])
def editar_fornecedor(id):
    dados = request.json
    # a função editarFornecedor já aceita kwargs
    resultado = Fornecedor.editarFornecedor(
        id=id,
        nome_empresa=dados.get("nome_empresa") or dados.get("nome"),
        cnpj=dados.get("cnpj"),
        telefone=dados.get("telefone"),
        email=dados.get("email"),
        endCep=dados.get("cep"),
        endRua=dados.get("logradouro"),
        endNumero=dados.get("numero"),
        endBairro=dados.get("bairro"),
        endComplemento=dados.get("complemento"),
        endUF=dados.get("uf"),
        endMunicipio=dados.get("cidade")
    )
    return jsonify({"message": "Fornecedor atualizado com sucesso."})

#curl -X DELETE http://127.0.0.1:5000/deletar_fornecedor/1
@app.route('/deletar_fornecedor/<int:id>', methods=['DELETE'])
def deletar_fornecedor(id):
    resultado = Fornecedor.excluirFornecedor(id)
    return jsonify({"message": resultado})

#curl -X GET http://127.0.0.1:5000/listar_fornecedores
@app.route('/listar_fornecedores', methods=['GET'])
def listar_fornecedores():
    fornecedores = Fornecedor.listarFornecedores()
    return jsonify(fornecedores)


# ROTAS DE CUPOM
#curl -X POST http://127.0.0.1:5000/criar_cupom -H "Content-Type: application/json" -d '{"codigo":"PROMO10","tipo":"percentual","descontofixo":null,"descontoPorcentagem":10,"descontofrete":null,"validade":"2025-12-31","usos_permitidos":100,"valor_minimo":50}'
@app.route('/criar_cupom', methods=['POST'])
def criar_cupom():
    dados = request.json
    resultado = Cupom.criarCupom(
        codigo=dados.get("codigo"),
        tipo=dados.get("tipo"),
        descontofixo=dados.get("descontofixo"),
        descontoPorcentagem=dados.get("descontoPorcentagem"),
        descontofrete=dados.get("descontofrete"),
        validade=dados.get("validade"),
        usos_permitidos=dados.get("usos_permitidos"),
        valor_minimo=dados.get("valor_minimo"),
        produto=dados.get("produto")  # Nome do produto ou tipo
    )
    return jsonify({"message": resultado})

#curl -X PUT http://127.0.0.1:5000/editar_cupom/1 -H "Content-Type: application/json" -d '{"codigo":"PROMO20","tipo":"percentual","descontofixo":null,"descontoPorcentagem":20,"descontofrete":null,"validade":"2025-12-31","usos_permitidos":50,"valor_minimo":100}'
@app.route('/editar_cupom/<int:id>', methods=['PUT'])
def editar_cupom(id):
    dados = request.json
    resultado = Cupom.editarCupom(
        id=id,
        codigo=dados.get("codigo"),
        tipo=dados.get("tipo"),
        descontofixo=dados.get("descontofixo"),
        descontoPorcentagem=dados.get("descontoPorcentagem"),
        descontofrete=dados.get("descontofrete"),
        validade=dados.get("validade"),
        usos_permitidos=dados.get("usos_permitidos"),
        valor_minimo=dados.get("valor_minimo"),
        produto=dados.get("produto")  # Nome do produto ou tipo
    )
    return jsonify({"message": resultado})

#curl -X PATCH http://127.0.0.1:5000/desativar_cupom/1
@app.route('/desativar_cupom/<int:id>', methods=['PATCH'])
def desativar_cupom(id):
    resultado = Cupom.desativarCupom(id)
    return jsonify({"message": resultado})

#curl -X DELETE http://127.0.0.1:5000/deletar_cupom/1
@app.route('/deletar_cupom/<int:id>', methods=['DELETE'])
def deletar_cupom(id):
    resultado = Cupom.excluirCupom(id)
    return jsonify({"message": resultado})

#curl -X GET http://127.0.0.1:5000/listar_cupons
@app.route('/listar_cupons', methods=['GET'])
def listar_cupons():
    cupons = Cupom.listarCupons()
    return jsonify(cupons)


# ROTAS DE SERVIÇO PERSONALIZADO

#curl -X POST http://127.0.0.1:5000/criar_servicopersonalizado -H "Content-Type: application/json" -d '{"nome":"Buquê Especial","produtos":["Rosa Vermelha","Lírio"],"preco":120.00}'
@app.route('/criar_servicopersonalizado', methods=['POST'])
def criar_servicopersonalizado():
    dados = request.json
    resultado = ServicoPersonalizado.criarServicoPersonalizado(
        nome=dados.get("nome"),
        produtos=dados.get("produtos"),
        preco=dados.get("preco")
    )
    return jsonify({"message": resultado})

#curl -X PUT http://127.0.0.1:5000/editar_servicopersonalizado/1 -H "Content-Type: application/json" -d '{"nome":"Buquê Deluxe","produtos":["Rosa Branca","Tulipa"],"preco":150.00,"status":"ativo"}'
@app.route('/editar_servicopersonalizado/<int:id>', methods=['PUT'])
def editar_servicopersonalizado(id):
    dados = request.json
    resultado = ServicoPersonalizado.editarServicoPersonalizado(
        id=id,
        nome=dados.get("nome"),
        produtos=dados.get("produtos"),
        preco=dados.get("preco"),
        status=dados.get("status")
    )
    return jsonify({"message": "Serviço atualizado com sucesso."})

#curl -X PATCH http://127.0.0.1:5000/desativar_servicopersonalizado/1
@app.route('/desativar_servicopersonalizado/<int:id>', methods=['PATCH'])
def desativar_servicopersonalizado(id):
    resultado = ServicoPersonalizado.desativarServicoPersonalizado(id)
    return jsonify({"message": resultado})

#curl -X DELETE http://127.0.0.1:5000/deletar_servicopersonalizado/1
@app.route('/deletar_servicopersonalizado/<int:id>', methods=['DELETE'])
def deletar_servicopersonalizado(id):
    resultado = ServicoPersonalizado.excluirServicoPersonalizado(id)
    return jsonify({"message": resultado})

#curl -X GET http://127.0.0.1:5000/listar_servicopersonalizado
@app.route('/listar_servicopersonalizado', methods=['GET'])
def listar_servicopersonalizado():
    servicos = ServicoPersonalizado.listarServicosPersonalizados()
    return jsonify(servicos)


# ROTAS DE CARRINHO
#curl -X POST http://127.0.0.1:5000/criar_carrinho -H "Content-Type: application/json" -d '{"idCliente":1}'
@app.route('/criar_carrinho', methods=['POST'])
def criar_carrinho():
    dados = request.json
    id_cliente = dados.get("idCliente") or dados.get("id_cliente")
    resultado = Carrinho.criarCarrinho(id_cliente)
    return jsonify({"message": resultado})

#curl -X DELETE http://127.0.0.1:5000/deletar_carrinho/1
@app.route('/deletar_carrinho/<int:id>', methods=['DELETE'])
def deletar_carrinho(id):
    resultado = Carrinho.excluirCarrinho(id)
    return jsonify({"message": resultado})

#curl -X GET http://127.0.0.1:5000/listar_carrinhos
@app.route('/listar_carrinhos', methods=['GET'])
def listar_carrinhos():
    carrinhos = Carrinho.listarCarrinhos()
    return jsonify(carrinhos)


# ROTAS DE VENDA
#curl -X POST http://127.0.0.1:5000/criar_venda -H "Content-Type: application/json" -d '{"cliente":1,"funcionario":1,"produtos":[{"id":1,"quantidade":2}],"valorTotal":100.00,"dataVenda":"2025-09-11","entrega":true,"dataEntrega":"2025-09-15"}'
@app.route('/criar_venda', methods=['POST'])
def criar_venda():
    dados = request.json
    resultado = Venda.criarVenda(
        cliente=dados.get("cliente"),
        funcionario=dados.get("funcionario"),
        produtos=dados.get("produtos"),
        valorTotal=dados.get("valorTotal"),
        dataVenda=dados.get("dataVenda"),
        entrega=dados.get("entrega"),
        dataEntrega=dados.get("dataEntrega")
    )
    return jsonify({"message": resultado})

#curl -X DELETE http://127.0.0.1:5000/deletar_venda/1
@app.route('/deletar_venda/<int:id>', methods=['DELETE'])
def deletar_venda(id):
    resultado = Venda.excluirVenda(id)
    return jsonify({"message": resultado})

#curl -X GET http://127.0.0.1:5000/listar_vendas
@app.route('/listar_vendas', methods=['GET'])
def listar_vendas():
    vendas = Venda.listarVendas()
    return jsonify(vendas)

# ROTAS DE TRANSAÇÃO FINANCEIRA
#curl -X POST http://127.0.0.1:5000/criar_transacaofinanceira -H "Content-Type: application/json" -d '{"tipo":"entrada","categoria":"venda","descricao":"Venda de produtos","valor":100.00,"data":"2025-09-11"}'
@app.route('/criar_transacaofinanceira', methods=['POST'])
def criar_transacaofinanceira():
    dados = request.json
    resultado = TransacaoFinanceira.criarTransacao(
        tipo=dados.get("tipo"),
        categoria=dados.get("categoria"),
        descricao=dados.get("descricao"),
        valor=dados.get("valor"),
        data=dados.get("data")
    )
    return jsonify({"message": resultado})

#curl -X PUT http://127.0.0.1:5000/editar_transacaofinanceira/1 -H "Content-Type: application/json" -d '{"tipo":"entrada","categoria":"venda","descricao":"Venda atualizada","valor":120.00,"data":"2025-09-11"}'
@app.route('/editar_transacaofinanceira/<int:id>', methods=['PUT'])
def editar_transacaofinanceira(id):
    dados = request.json
    resultado = TransacaoFinanceira.editarTransacao(
        id=id,
        tipo=dados.get("tipo"),
        categoria=dados.get("categoria"),
        descricao=dados.get("descricao"),
        valor=dados.get("valor"),
        data=dados.get("data")
    )
    return jsonify({"message": "Transação atualizada com sucesso."})

#curl -X DELETE http://127.0.0.1:5000/deletar_transacaofinanceira/1
@app.route('/deletar_transacaofinanceira/<int:id>', methods=['DELETE'])
def deletar_transacaofinanceira(id):
    resultado = TransacaoFinanceira.excluirTransacao(id)
    return jsonify({"message": resultado})

#curl -X GET http://127.0.0.1:5000/listar_transacaofinanceira
@app.route('/listar_transacaofinanceira', methods=['GET'])
def listar_transacaofinanceira():
    transacoes = TransacaoFinanceira.listarTransacoes()
    return jsonify(transacoes)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000) # , debug=True)