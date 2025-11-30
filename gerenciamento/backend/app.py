from flask import Flask, jsonify, request
from datetime import datetime, timedelta, date
import pymysql
import csv
import io
import json
import re
from classes import Cliente, Funcionario, Produto, Fornecedor, Cupom, ServicoPersonalizado, Carrinho, Venda, TransacaoFinanceira, UsuarioSistema,UsuarioLoja
from flask_cors import CORS
from pymysql.err import MySQLError
import jwt

SECRET_KEY = "minha_chave_super_secreta_123!@#"  # guarde em .env idealmente



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
        #"senha": dados.get("senha", "cliente123") if dados.get("senha") else None,
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
        #"senha": dados.get("senha"),
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
    dados = request.json or {}

    funcionario_data = {
        "nome": dados.get("nome"),
        "cpf": dados.get("cpf"),
        "rg": dados.get("rg"),
        "data_nascimento": dados.get("data_nascimento"),  # nome correto
        "sexo": dados.get("sexo"),
        "email": dados.get("email"),
        "estado": True,
        "telefone": dados.get("telefone"),

        # Endereço (nomes corrigidos)
        "endCep": dados.get("endCep"),
        "endRua": dados.get("endRua"),
        "endNumero": dados.get("endNumero"),
        "endBairro": dados.get("endBairro"),
        "endComplemento": dados.get("endComplemento"),
        "endUF": dados.get("endUF"),
        "endMunicipio": dados.get("endMunicipio"),

        # Outros campos
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
        #senha=dados.get("senha"),
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

@app.route('/login', methods=['POST'])
def login():
    dados = request.json or {}

    usuario = dados.get('usuario')
    senha = dados.get('senha')

    if not usuario or not senha:
        return jsonify({'resultado': 'erro', 'detalhes': 'Usuário e senha são obrigatórios'}), 400

    conexao = conectar_banco()
    if not conexao:
        return jsonify({'resultado': 'erro', 'detalhes': 'Erro ao conectar ao banco'}), 500

    cursor = conexao.cursor()
    try:
        # Buscar usuário no banco
        query_user = '''
            SELECT id, funcionario_id, tipo_usuario, usuario, senha, tema_preferido
            FROM usuarios_sistema
            WHERE usuario = %s
        '''
        cursor.execute(query_user, (usuario,))
        row = cursor.fetchone()

        if not row:
            return jsonify({'resultado': 'erro', 'detalhes': 'Usuário não encontrado'}), 401

        usuario_sistema = {
            'id': row[0],
            'funcionario_id': row[1],
            'tipo_usuario': row[2],
            'usuario': row[3],
            'senha': row[4],
            'tema_preferido': row[5]
        }

        # Verificar senha
        if senha != usuario_sistema['senha']:
            return jsonify({'resultado': 'erro', 'detalhes': 'Senha incorreta'}), 401

        # Criar token JWT
        payload = {
            "usuario_id": usuario_sistema['id'],
            "funcionario_id": usuario_sistema['funcionario_id'],
            "exp": datetime.utcnow() + timedelta(hours=8)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        # Buscar dados do funcionário
        query_func = '''
            SELECT id, nome, email, funcao, estado, telefone
            FROM funcionarios
            WHERE id = %s
        '''
        cursor.execute(query_func, (usuario_sistema['funcionario_id'],))
        func = cursor.fetchone()
        funcionario = {
            'id': func[0],
            'nome': func[1],
            'email': func[2],
            'funcao': func[3],
            'estado': bool(func[4]),
            'telefone': func[5]
        }

        # Perfil (se existir)
        perfil = None
        if funcionario.get('perfil_id'):
            cursor.execute('SELECT id, nome, permissoes, ativo FROM perfis WHERE id = %s', 
                           (funcionario['perfil_id'],))
            p = cursor.fetchone()
            if p:
                perfil = {
                    'id': p[0],
                    'nome': p[1],
                    'permissoes': p[2],
                    'ativo': bool(p[3])
                }

        return jsonify({
            "resultado": "ok",
            "token": token,
            "usuario_sistema": {
                "id": usuario_sistema['id'],
                "usuario": usuario_sistema['usuario'],
                "tipo_usuario": usuario_sistema['tipo_usuario'],
                "tema_preferido": usuario_sistema['tema_preferido'],
            },
            "funcionario": funcionario,
            "perfil": perfil
        })

    except Exception as e:
        return jsonify({'resultado': 'erro', 'detalhes': str(e)}), 500

    finally:
        cursor.close()
        conexao.close()



# Produto
@app.route('/criar_produto', methods=['POST'])
def criar_produto():
    dados = request.json
    resultado = Produto.criarProduto(
        dados.get("nome"),
        dados.get("categoria"),
        dados.get("marca"),
        dados.get("preco"),
        dados.get("quantidadeEstoque"),
        dados.get("estoqueMinimo"),
        dados.get("estado"),
        dados.get("fornecedor_id"),
        dados.get("imagem_1"),
        dados.get("imagem_2"),
        dados.get("imagem_3")
    )
    return jsonify(resultado), 201


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
        quantidadeEstoque=dados.get("quantidadeEstoque"),
        estoqueMinimo=dados.get("estoqueMinimo"),
        estado=dados.get("estado"),
        fornecedor_id=dados.get("fornecedor_id"),
        imagem_1=dados.get("imagem_1"),
        imagem_2=dados.get("imagem_2"),
        imagem_3=dados.get("imagem_3")
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

@app.route('/produto_id/<int:produto_id>', methods=['GET'])
def obter_produto_id(produto_id):
    conexao = conectar_banco()
    try:
        cursor = conexao.cursor()
        cursor.execute("SELECT * FROM produtos WHERE id=%s", (produto_id,))
        resultado = cursor.fetchone()  # vai retornar uma tupla
        if resultado:
            # mapeando manualmente os campos do banco para um dicionário
            colunas = [desc[0] for desc in cursor.description]
            produto = dict(zip(colunas, resultado))
        else:
            produto = None
    finally:
        cursor.close()
        conexao.close()

    if produto:
        return jsonify(produto)
    else:
        return jsonify({"message": "Produto não encontrado"}), 404


@app.route('/obter_produto/<nome_produto>', methods=['GET'])
def obter_produto(nome_produto):
    produto = Produto.obterProduto(nome_produto)
    if produto:
        return jsonify(produto)
    else:
        return jsonify({"message": "Produto não encontrado"}), 404
    




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
        endCep=dados.get("endCep"),
        endRua=dados.get("endRua"),
        endNumero=dados.get("endNumero"),
        endBairro=dados.get("endBairro"),
        endComplemento=dados.get("endComplemento"),
        endUF=dados.get("endUF"),
        endMunicipio=dados.get("endMunicipio")
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
        endCep=dados.get("endCep"),
        endRua=dados.get("endRua"),
        endNumero=dados.get("endNumero"),
        endBairro=dados.get("endBairro"),
        endComplemento=dados.get("endComplemento"),
        endUF=dados.get("endUF"),
        endMunicipio=dados.get("endMunicipio")
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


# Endpoint genérico para importar CSV para tabelas permitidas
@app.route('/importar_csv', methods=['POST'])
def importar_csv():
    # Expecting multipart/form-data with fields:
    # - file: the csv file
    # - target: target table name (ex: produtos, clientes)
    # - mapping (optional): JSON string mapping CSV header -> DB column
    # - delimiter (optional): CSV delimiter, default ','
    if 'file' not in request.files:
        return jsonify({'resultado': 'erro', 'detalhes': 'Arquivo não enviado (campo "file" ausente)'}), 400

    file = request.files['file']
    target = request.form.get('target')
    mapping_raw = request.form.get('mapping')
    delimiter = request.form.get('delimiter') or ','

    if not target:
        return jsonify({'resultado': 'erro', 'detalhes': 'Parametro "target" é obrigatório'}), 400

    # whitelist de tabelas permitidas para evitar SQL injection
    allowed_tables = {
        'clientes', 'funcionarios', 'fornecedores', 'produtos', 'cupons',
        'servicos_personalizados', 'vendas', 'transacoes_financeiras', 'itens_pedido'
    }

    if target not in allowed_tables:
        return jsonify({'resultado': 'erro', 'detalhes': f'Tabela alvo "{target}" não permitida'}), 400

    try:
        content = file.read().decode('utf-8-sig')
    except Exception:
        try:
            content = file.read().decode('latin-1')
        except Exception as e:
            return jsonify({'resultado': 'erro', 'detalhes': f'Falha ao ler arquivo: {e}'}), 400

    sio = io.StringIO(content)
    try:
        reader = csv.DictReader(sio, delimiter=delimiter)
    except Exception as e:
        return jsonify({'resultado': 'erro', 'detalhes': f'Falha ao parsear CSV: {e}'}), 400

    rows = list(reader)
    if not rows:
        return jsonify({'resultado': 'erro', 'detalhes': 'CSV vazio ou sem linhas'}), 400

    # optional mapping: CSV header -> DB column name
    mapping = None
    if mapping_raw:
        try:
            mapping = json.loads(mapping_raw)
        except Exception as e:
            return jsonify({'resultado': 'erro', 'detalhes': f'Mapping JSON inválido: {e}'}), 400

    # build normalized rows with db column names
    normalized = []
    for r in rows:
        nr = {}
        for key, val in r.items():
            col = mapping.get(key, key) if mapping else key
            nr[col.strip()] = val
        normalized.append(nr)

    # validate column names (safe identifier)
    colname_re = re.compile(r'^[A-Za-z0-9_]+$')
    cols = list(normalized[0].keys())
    for c in cols:
        if not colname_re.match(c):
            return jsonify({'resultado': 'erro', 'detalhes': f'Nome de coluna inválido: "{c}"'}), 400

    # perform inserts in a transaction
    conexao = conectar_banco()
    if not conexao:
        return jsonify({'resultado': 'erro', 'detalhes': 'Não foi possível conectar ao banco'}), 500

    placeholders = ','.join(['%s'] * len(cols))
    cols_sql = ','.join([f"{c}" for c in cols])
    insert_sql = f"INSERT INTO {target} ({cols_sql}) VALUES ({placeholders})"

    cursor = conexao.cursor()
    inserted = 0
    errors = []
    try:
        for i, row in enumerate(normalized, start=1):
            vals = [None if row.get(c, '') == '' else row.get(c) for c in cols]
            try:
                cursor.execute(insert_sql, vals)
                inserted += 1
            except Exception as e:
                conexao.rollback()
                errors.append({'linha': i, 'erro': str(e), 'dados': row})
        # commit successful inserts
        conexao.commit()
    except Exception as e:
        conexao.rollback()
        return jsonify({'resultado': 'erro', 'detalhes': f'Erro na inserção: {e}'}), 500
    finally:
        cursor.close()
        conexao.close()

    return jsonify({'resultado': 'ok', 'inseridos': inserted, 'erros': errors})


@app.route('/colunas_tabela', methods=['GET'])
def colunas_tabela():
    table = request.args.get('table')
    if not table:
        return jsonify({'resultado': 'erro', 'detalhes': 'Parametro "table" é obrigatório'}), 400

    allowed_tables = {
        'clientes', 'funcionarios', 'fornecedores', 'produtos', 'cupons',
        'servicos_personalizados', 'vendas', 'transacoes_financeiras', 'itens_pedido'
    }

    if table not in allowed_tables:
        return jsonify({'resultado': 'erro', 'detalhes': f'Tabela "{table}" não permitida'}), 400

    conexao = conectar_banco()
    if not conexao:
        return jsonify({'resultado': 'erro', 'detalhes': 'Não foi possível conectar ao banco'}), 500

    try:
        cursor = conexao.cursor()
        cursor.execute(f"SHOW COLUMNS FROM `{table}`")
        rows = cursor.fetchall()
        cols = [r[0] for r in rows]
        return jsonify({'resultado': 'ok', 'colunas': cols})
    except Exception as e:
        return jsonify({'resultado': 'erro', 'detalhes': str(e)}), 500
    finally:
        cursor.close()
        conexao.close()


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
    dados = request.json or {}
    try:
        cliente = dados.get("cliente")
        funcionario = dados.get("funcionario")
        produtos = dados.get("produtos", [])
        valorTotal = dados.get("valorTotal")
        dataVenda = dados.get("dataVenda")
        entrega = dados.get("entrega")
        dataEntrega = dados.get("dataEntrega")
        pago = dados.get("pago", False)

        resultado = Venda.criarVenda(
            cliente, funcionario, produtos, valorTotal, dataVenda, entrega, dataEntrega, pago
        )

        return jsonify({"message": "Venda criada.", "resultado": resultado}), 201
    except Exception as e:
        return jsonify({"message": "Erro ao criar venda.", "erro": str(e)}), 500


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


# Rotas para usuarios_sistema
# curl -X POST http://127.0.0.1:5000/criar_usuario_sistema -H "Content-Type: application/json" -d '{"funcionario_id":1,"tipo_usuario":"Vendedor","usuario":"joao","senha":"senha123","tema_preferido":"escuro"}'
@app.route('/criar_usuario_sistema', methods=['POST'])
def criar_usuario_sistema():
    dados = request.json or {}
    funcionario_id = dados.get("funcionario_id")
    tipo_usuario = dados.get("tipo_usuario")
    usuario = dados.get("usuario")
    senha = dados.get("senha")
    tema_preferido = dados.get("tema_preferido", "claro")

    resultado = UsuarioSistema.criarUsuarioSistema(
        funcionario_id=funcionario_id,
        tipo_usuario=tipo_usuario,
        usuario=usuario,
        senha=senha,
        tema_preferido=tema_preferido
    )
    return jsonify({"message": resultado})

# curl -X PUT http://127.0.0.1:5000/editar_usuario_sistema/1 -H "Content-Type: application/json" -d '{"tipo_usuario":"Administrador","usuario":"joao_novo","senha":"nova_senha","tema_preferido":"claro"}'
@app.route('/editar_usuario_sistema/<int:id>', methods=['PUT'])
def editar_usuario_sistema(id):
    dados = request.json or {}
    resultado = UsuarioSistema.editarUsuarioSistema(
        id=id,
        funcionario_id=dados.get("funcionario_id"),
        tipo_usuario=dados.get("tipo_usuario"),
        usuario=dados.get("usuario"),
        senha=dados.get("senha"),
        tema_preferido=dados.get("tema_preferido")
    )
    return jsonify({"message": resultado})

# curl -X DELETE http://127.0.0.1:5000/deletar_usuario_sistema/1
@app.route('/deletar_usuario_sistema/<int:id>', methods=['DELETE'])
def deletar_usuario_sistema(id):
    resultado = UsuarioSistema.excluirUsuarioSistema(id)
    return jsonify({"message": resultado})

# curl -X GET http://127.0.0.1:5000/listar_usuarios_sistema
@app.route('/listar_usuarios_sistema', methods=['GET'])
def listar_usuarios_sistema():
    usuarios = UsuarioSistema.listarUsuarios()
    return jsonify(usuarios)

# curl -X GET http://127.0.0.1:5000/buscar_usuario_sistema/1
@app.route('/buscar_usuario_sistema/<int:id>', methods=['GET'])
def buscar_usuario_sistema(id):
    usuario = UsuarioSistema.buscarPorId(id)
    if not usuario:
        return jsonify({'resultado': 'erro', 'detalhes': 'Usuário não encontrado'}), 404
    return jsonify(usuario.json())


# Rotas para usuarios_loja
# curl -X POST http://127.0.0.1:5000/criar_usuario_loja -H "Content-Type: application/json" -d '{"cliente_id":1,"usuario":"cliente1","senha":"senha123"}'
@app.route('/criar_usuario_loja', methods=['POST'])
def criar_usuario_loja():
    dados = request.json or {}
    cliente_id = dados.get("cliente_id")
    usuario = dados.get("usuario")
    senha = dados.get("senha")

    resultado = UsuarioLoja.criarUsuarioLoja(
        cliente_id=cliente_id,
        usuario=usuario,
        senha=senha
    )
    return jsonify({"message": resultado})

# curl -X PUT http://127.0.0.1:5000/editar_usuario_loja/1 -H "Content-Type: application/json" -d '{"cliente_id":2,"usuario":"cliente_novo","senha":"nova_senha"}'
@app.route('/editar_usuario_loja/<int:id>', methods=['PUT'])
def editar_usuario_loja(id):
    dados = request.json or {}
    resultado = UsuarioLoja.editarUsuarioLoja(
        id=id,
        cliente_id=dados.get("cliente_id"),
        usuario=dados.get("usuario"),
        senha=dados.get("senha")
    )
    return jsonify({"message": resultado})

# curl -X DELETE http://127.0.0.1:5000/deletar_usuario_loja/1
@app.route('/deletar_usuario_loja/<int:id>', methods=['DELETE'])
def deletar_usuario_loja(id):
    resultado = UsuarioLoja.excluirUsuarioLoja(id)
    return jsonify({"message": resultado})

# curl -X GET http://127.0.0.1:5000/listar_usuarios_loja
@app.route('/listar_usuarios_loja', methods=['GET'])
def listar_usuarios_loja():
    usuarios = UsuarioLoja.listarUsuariosLoja()
    return jsonify(usuarios)

# curl -X GET http://127.0.0.1:5000/buscar_usuario_loja/1
@app.route('/buscar_usuario_loja/<int:id>', methods=['GET'])
def buscar_usuario_loja(id):
    usuario = UsuarioLoja.buscarPorId(id)
    if not usuario:
        return jsonify({'resultado': 'erro', 'detalhes': 'Usuário não encontrado'}), 404
    return jsonify(usuario.json())



"""# Exemplos de requisições CURL para popular o banco de dados# --- CLIENTES (3)
curl -X POST "http://127.0.0.1:5000/criar_cliente" -H "Content-Type: application/json" -d "{\"nome\":\"João Silva\",\"tipo\":\"fisico\",\"email\":\"joao.silva@example.com\",\"telefone\":\"11999990001\",\"cep\":\"01001000\",\"logradouro\":\"Rua A\",\"numero\":\"100\",\"bairro\":\"Centro\",\"complemento\":\"Apto 1\",\"uf\":\"SP\",\"cidade\":\"São Paulo\",\"cpf\":\"12345678901\",\"rg\":\"1234567\",\"sexo\":\"masculino\",\"data_nascimento\":\"1990-01-01\"}"
curl -X POST "http://127.0.0.1:5000/criar_cliente" -H "Content-Type: application/json" -d "{\"nome\":\"Maria Oliveira\",\"tipo\":\"fisico\",\"email\":\"maria.oliveira@example.com\",\"telefone\":\"11999990002\",\"cep\":\"02002000\",\"logradouro\":\"Av B\",\"numero\":\"200\",\"bairro\":\"Jardim\",\"complemento\":\"Casa\",\"uf\":\"SP\",\"cidade\":\"São Paulo\",\"cpf\":\"10987654321\",\"rg\":\"7654321\",\"sexo\":\"feminino\",\"data_nascimento\":\"1985-05-20\"}"
curl -X POST "http://127.0.0.1:5000/criar_cliente" -H "Content-Type: application/json" -d "{\"nome\":\"Empresa X Ltda\",\"tipo\":\"juridico\",\"email\":\"contato@empresax.com\",\"telefone\":\"11999990003\",\"cep\":\"03003000\",\"logradouro\":\"Rua C\",\"numero\":\"50\",\"bairro\":\"Industrial\",\"complemento\":\"Sala 10\",\"uf\":\"SP\",\"cidade\":\"Guarulhos\",\"cnpj\":\"12345678000199\"}"
"""