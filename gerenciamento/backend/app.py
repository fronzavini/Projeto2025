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
from datetime import timezone
from dotenv import load_dotenv
import os
import requests
import uuid
from json import JSONDecodeError
from pathlib import Path


SECRET_KEY = "minha_chave_super_secreta_123!@#"  # guarde em .env idealmente

load_dotenv(dotenv_path=Path(__file__).with_name('.env'))

MP_BASE  = os.getenv("MERCADOPAGO_BASE_URL") or "https://api.mercadopago.com"
MP_TOKEN = (
    os.getenv("MERCADOPAGO_ACCESS_TOKEN")
    or os.getenv("MP_ACCESS_TOKEN")
    or os.getenv("MERCADO_PAGO_TOKEN")
    or os.getenv("MERCADOPAGO_TOKEN")
)

# debug opcional para ver se carregou
print("MP_TOKEN prefix:", (MP_TOKEN or "")[:7])  # deve imprimir 'APP_USR'


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

@app.route('/login_sistema', methods=['POST'])
def login_sistema():
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
            "exp": datetime.now(timezone.utc) + timedelta(hours=8)
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

        # ✅ PERFIL REMOVIDO (NÃO EXISTE NO SEU BANCO)
        perfil = None

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
        print("ERRO NO LOGIN:", e)
        return jsonify({'resultado': 'erro', 'detalhes': str(e)}), 500

    finally:
        cursor.close()
        conexao.close()

@app.route('/login_loja', methods=['POST'])
def login_loja():
    dados = request.json or {}

    email = dados.get('email')
    senha = dados.get('senha')

    if not email or not senha:
        return jsonify({'resultado': 'erro', 'detalhes': 'Email e senha são obrigatórios'}), 400

    conexao = conectar_banco()
    if not conexao:
        return jsonify({'resultado': 'erro', 'detalhes': 'Erro ao conectar ao banco'}), 500

    cursor = conexao.cursor()
    try:
        # 1️⃣ Buscar cliente pelo email
        query_cliente = '''
            SELECT id, nome, email, estado
            FROM clientes
            WHERE email = %s
        '''
        cursor.execute(query_cliente, (email,))
        cliente = cursor.fetchone()

        if not cliente:
            return jsonify({'resultado': 'erro', 'detalhes': 'Email não encontrado'}), 401

        cliente_id = cliente[0]
        cliente_nome = cliente[1]
        cliente_email = cliente[2]
        cliente_estado = bool(cliente[3])

        if not cliente_estado:
            return jsonify({'resultado': 'erro', 'detalhes': 'Conta desativada'}), 403

        # 2️⃣ Buscar usuário_loja vinculado ao cliente
        query_usuario = '''
            SELECT id, usuario, senha
            FROM usuarios_loja
            WHERE cliente_id = %s
        '''
        cursor.execute(query_usuario, (cliente_id,))
        usuario_row = cursor.fetchone()

        if not usuario_row:
            return jsonify({'resultado': 'erro', 'detalhes': 'Usuário não encontrado'}), 401

        usuario_id = usuario_row[0]
        usuario_login = usuario_row[1]  # nome de usuário criado automaticamente
        usuario_senha = usuario_row[2]

        # 3️⃣ Validar senha
        if senha != usuario_senha:
            return jsonify({'resultado': 'erro', 'detalhes': 'Senha incorreta'}), 401

        # 4️⃣ Criar token JWT
        payload = {
            "usuario_id": usuario_id,
            "cliente_id": cliente_id,
            "exp": datetime.utcnow() + timedelta(hours=8)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "resultado": "ok",
            "token": token,
            "usuario": {
                "id": usuario_id,
                "cliente_id": cliente_id,
                "nome": cliente_nome,
                "email": cliente_email,
                "usuario_login": usuario_login
            }
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
        aplicacao=dados.get("aplicacao"),
        tipo_produto=dados.get("tipo_produto")
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
        aplicacao=dados.get("aplicacao"),
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

# Rota para calcular desconto de um cupom
@app.route('/calcular_desconto', methods=['POST'])
def calcular_desconto():
    dados = request.json or {}
    valor_total = float(dados.get('valor_total', 0))
    codigo_cupom = dados.get('codigo_cupom')

    if not codigo_cupom:
        return jsonify({"resultado": "erro", "detalhes": "Código do cupom não informado"}), 400

    # Buscar cupom no banco
    conexao = conectar_banco()
    if not conexao:
        return jsonify({'resultado': 'erro', 'detalhes': 'Erro ao conectar ao banco'}), 500

    try:
        cursor = conexao.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM cupons WHERE codigo=%s AND estado=1", (codigo_cupom,))
        cupom = cursor.fetchone()
        if not cupom:
            return jsonify({"resultado": "erro", "detalhes": "Cupom inválido ou desativado"}), 404

        desconto = 0
        if cupom['tipo'] == 'percentual' and cupom['descontoPorcentagem']:
            desconto = valor_total * (cupom['descontoPorcentagem'] / 100)
        elif cupom['tipo'] == 'fixo' and cupom['descontofixo']:
            desconto = cupom['descontofixo']
        elif cupom['tipo'] == 'frete' and cupom['descontofrete']:
            desconto = cupom['descontofrete']

        valor_final = max(0, valor_total - desconto)

        return jsonify({
            "resultado": "ok",
            "valor_total": valor_total,
            "desconto": desconto,
            "valor_final": valor_final
        })

    except Exception as e:
        return jsonify({'resultado': 'erro', 'detalhes': str(e)}), 500
    finally:
        cursor.close()
        conexao.close()

@app.route('/cupons_disponiveis', methods=['GET'])
def cupons_disponiveis():
    """
    Retorna todos os cupons ativos, distinguindo
    se são para tipo de produto ou produto específico.
    """
    try:
        conexao = conectar_banco()
        if not conexao:
            return jsonify({'resultado': 'erro', 'detalhes': 'Erro ao conectar ao banco'}), 500

        cursor = conexao.cursor(pymysql.cursors.DictCursor)
        cursor.execute("""
            SELECT id, codigo, tipo, aplicacao, tipo_produto, produto, descontofixo, descontoPorcentagem, descontofrete, validade, usos_permitidos, valor_minimo
            FROM cupons
            WHERE estado = 1 AND validade >= CURDATE()
        """)
        cupons = cursor.fetchall()

        # Separar por tipo
        for c in cupons:
            if c['aplicacao'] == 'produto_especifico':
                c['aplicavel'] = c['produto']  # ex: ["Rosa Vermelha", "Lírio"]
            elif c['aplicacao'] == 'tipo_produto':
                c['aplicavel'] = c['tipo_produto']  # ex: "flores"
            else:
                c['aplicavel'] = "geral"

        return jsonify({'resultado': 'ok', 'cupons': cupons})
    
    except Exception as e:
        return jsonify({'resultado': 'erro', 'detalhes': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conexao:
            conexao.close()

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


# --- Criar carrinho ---
# curl -X POST http://127.0.0.1:5000/criar_carrinho -H "Content-Type: application/json" -d '{"idUsuario":1}'
@app.route('/criar_carrinho', methods=['POST'])
def criar_carrinho():
    dados = request.json
    id_usuario = dados.get("idUsuario") or dados.get("id_usuario")
    carrinho = Carrinho.criarCarrinho(id_usuario)
    return jsonify({"message": "Carrinho criado com sucesso", "carrinho": carrinho.json()}), 201

# --- Deletar carrinho ---
# curl -X DELETE http://127.0.0.1:5000/deletar_carrinho/1
@app.route('/deletar_carrinho/<int:id>', methods=['DELETE'])
def deletar_carrinho(id):
    resultado = Carrinho.excluirCarrinho(id)
    return jsonify({"message": resultado})

# --- Listar todos os carrinhos ---
# curl -X GET http://127.0.0.1:5000/listar_carrinhos
@app.route('/listar_carrinhos', methods=['GET'])
def listar_carrinhos():
    carrinhos = Carrinho.listarCarrinhos()
    return jsonify([c.json() for c in carrinhos])

# --- Listar carrinho específico pelo ID ---
# curl -X GET http://127.0.0.1:5000/carrinho/1
@app.route('/carrinho/<int:id>', methods=['GET'])
def listar_carrinho(id):
    conexao = conectar_banco()
    cursor = conexao.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("SELECT * FROM carrinho_de_compra WHERE id = %s", (id,))
        c = cursor.fetchone()
        if not c:
            return jsonify({"message": "Carrinho não encontrado"}), 404

        carrinho = Carrinho(c['id'], c['idUsuario'])
        carrinho.valorTotal = float(c['valorTotal'])

        cursor.execute("SELECT produto_id, quantidade, preco_unitario FROM itens_carrinho WHERE carrinho_id = %s", (c['id'],))
        itens = cursor.fetchall()
        carrinho.produtos = [
            {"produto_id": i['produto_id'], "quantidade": i['quantidade'], "preco_unitario": float(i['preco_unitario'])}
            for i in itens
        ]
        return jsonify(carrinho.json())
    finally:
        cursor.close()
        conexao.close()

# --- Listar carrinho de um usuário específico ---
# curl -X GET http://127.0.0.1:5000/carrinho/usuario/1
@app.route('/carrinho/usuario/<int:id_usuario>', methods=['GET'])
def listar_carrinho_usuario(id_usuario):
    conexao = conectar_banco()
    cursor = conexao.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("SELECT * FROM carrinho_de_compra WHERE idUsuario = %s", (id_usuario,))
        c = cursor.fetchone()
        if not c:
            return jsonify({"message": "Carrinho não encontrado"}), 404

        carrinho = Carrinho(c['id'], c['idUsuario'])
        carrinho.valorTotal = float(c['valorTotal'])

        cursor.execute("SELECT produto_id, quantidade, preco_unitario FROM itens_carrinho WHERE carrinho_id = %s", (c['id'],))
        itens = cursor.fetchall()
        carrinho.produtos = [
            {"produto_id": i['produto_id'], "quantidade": i['quantidade'], "preco_unitario": float(i['preco_unitario'])}
            for i in itens
        ]
        return jsonify(carrinho.json())
    finally:
        cursor.close()
        conexao.close()

# --- Adicionar item ao carrinho ---
# curl -X POST http://127.0.0.1:5000/carrinho/1/adicionar_item -H "Content-Type: application/json" -d '{"produto_id":2,"quantidade":3,"preco_unitario":50.0}'
@app.route('/carrinho/<int:id>/adicionar_item', methods=['POST'])
def adicionar_item(id):
    dados = request.json
    produto_id = dados.get("produto_id")
    quantidade = dados.get("quantidade", 1)
    preco_unitario = dados.get("preco_unitario")
    
    carrinho = Carrinho(id, None)
    carrinho.adicionarItem(produto_id, quantidade, preco_unitario)
    return jsonify({"message": "Item adicionado", "carrinho": carrinho.json()})

# --- Remover item do carrinho ---
# curl -X DELETE http://127.0.0.1:5000/carrinho/1/remover_item/2
@app.route('/carrinho/<int:id>/remover_item/<int:produto_id>', methods=['DELETE'])
def remover_item(id, produto_id):
    carrinho = Carrinho(id, None)
    carrinho.removerItem(produto_id)
    return jsonify({"message": "Item removido", "carrinho": carrinho.json()})

# --- Atualizar quantidade de item ---
# curl -X PUT http://127.0.0.1:5000/carrinho/1/atualizar_item -H "Content-Type: application/json" -d '{"produto_id":2,"quantidade":5}'
@app.route('/carrinho/<int:id>/atualizar_item', methods=['PUT'])
def atualizar_item(id):
    dados = request.json
    produto_id = dados.get("produto_id")
    quantidade = dados.get("quantidade")

    # Remove o item antigo
    carrinho = Carrinho(id, None)
    carrinho.removerItem(produto_id)

    if quantidade > 0:
        # Busca o preço atual do produto
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("SELECT preco FROM produtos WHERE id = %s", (produto_id,))
        preco = cursor.fetchone()[0]
        cursor.close()
        conexao.close()

        carrinho.adicionarItem(produto_id, quantidade, preco)

    return jsonify({"message": "Item atualizado", "carrinho": carrinho.json()})
# ROTAS DE VENDA
#curl -X POST http://127.0.0.1:5000/criar_venda -H "Content-Type: application/json" -d '{"cliente":1,"funcionario":1,"produtos":[{"id":1,"quantidade":2}],"valorTotal":100.00,"dataVenda":"2025-09-11","entrega":true,"dataEntrega":"2025-09-15"}'
from datetime import datetime
import pymysql

def _parse_date(d):
    if not d:
        return None
    try:
        if "-" in d:
            return datetime.strptime(d, "%Y-%m-%d").date()
        return datetime.strptime(d, "%d/%m/%Y").date()
    except Exception:
        return None

@app.route("/criar_venda", methods=["POST"])
def criar_venda():
    body = request.get_json(silent=True) or {}
    print("\n[CRIAR_VENDA] payload:", body)  # <-- loga o que chegou

    # 1) validação do payload (nomes esperados pelo front)
    cliente = body.get("cliente")
    funcionario = body.get("funcionario")
    itens = body.get("produtos") or []
    total = body.get("valorTotal")
    forma_pagamento = body.get("formaPagamento")
    entrega_flag = body.get("entrega", 0)
    data_entrega = _parse_date(body.get("dataEntrega"))
    data_venda = _parse_date(body.get("dataVenda"))
    cupom = body.get("cupom")

    faltando = []
    if not cliente: faltando.append("cliente")
    if not funcionario: faltando.append("funcionario")
    if not itens: faltando.append("produtos")
    if total is None: faltando.append("valorTotal")
    if not forma_pagamento: faltando.append("formaPagamento")
    if entrega_flag and not data_entrega:
        faltando.append("dataEntrega (YYYY-MM-DD)")
    if faltando:
        print("[CRIAR_VENDA] faltando:", faltando)
        return jsonify({"ok": False, "erro": "Campos ausentes/invalidos", "campos": faltando}), 400

    # 2) conecta com DictCursor
    conexao = conectar_banco()
    if not conexao:
        return jsonify({"ok": False, "erro": "Falha ao conectar ao banco"}), 500

    try:
        with conexao.cursor(pymysql.cursors.DictCursor) as c:
            # 3) valida FK cliente/funcionário (seus nomes de coluna/tabela)
            c.execute("SELECT id FROM clientes WHERE id=%s", (cliente,))
            row_cli = c.fetchone()
            if not row_cli:
                return jsonify({"ok": False, "erro": f"Cliente {cliente} inexistente"}), 400

            c.execute("SELECT id FROM funcionarios WHERE id=%s", (funcionario,))
            row_fun = c.fetchone()
            if not row_fun:
                return jsonify({"ok": False, "erro": f"Funcionário {funcionario} inexistente"}), 400

            # 4) valida produtos e coleta preço atual (suas colunas: cod_produto, preco, quantidade_estoque)
            itens_validos = []
            for it in itens:
                pid = it.get("id")
                qtd = int(it.get("quantidade") or 0)
                if not pid or qtd <= 0:
                    return jsonify({"ok": False, "erro": "Produto sem id ou quantidade inválida"}), 400

                c.execute("SELECT id, preco, quantidade_estoque FROM produtos WHERE id=%s", (pid,))
                prod = c.fetchone()
                if not prod:
                    return jsonify({"ok": False, "erro": f"Produto {pid} inexistente"}), 400

                itens_validos.append({
                    "id": prod["id"],            # <-- usa 'id' que veio do SELECT
                    "qtd": qtd,
                    "preco": float(prod["preco"])
                })

            produtos_json = json.dumps([
                {"id": it["id"], "quantidade": it["qtd"], "preco": it["preco"]}
                for it in itens_validos
            ])

            # 5) cria a venda usando as colunas REAIS de 'vendas'
            c.execute("""
                INSERT INTO vendas (cliente, funcionario, produtos, valorTotal, dataVenda, pago)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                int(cliente),
                int(funcionario),
                produtos_json,                           # salva os itens como JSON no campo TEXT
                float(total),
                (data_venda or datetime.today().date()),
                0 if not body.get("pago") else 1
            ))
            venda_id = c.lastrowid
            print("[CRIAR_VENDA] venda_id:", venda_id)


            # 6) insere itens (sua tabela/colunas: itens_venda (idVenda, idProduto, quantidade, preco_unitario))
            '''for it in itens_validos:
                c.execute("SELECT preco FROM produtos WHERE id=%s", (it["id"],))
                preco_unit = float(c.fetchone()["preco"])
                c.execute("""
                    INSERT INTO itens_venda (idVenda, idProduto, quantidade, preco_unitario)
                    VALUES (%s, %s, %s, %s)
                """, (venda_id, it["id"], it["qtd"], preco_unit))'''


            conexao.commit()

        # 7) retorno com id (o front usa como external_reference)
        return jsonify({"ok": True, "id": venda_id}), 201

    except pymysql.err.IntegrityError as e:
        conexao.rollback()
        print("[CRIAR_VENDA][IntegrityError]", str(e))
        return jsonify({"ok": False, "erro": "IntegrityError", "detalhe": str(e)}), 400
    except Exception as e:
        conexao.rollback()
        import traceback; traceback.print_exc()
        print("[CRIAR_VENDA][Exception]", str(e))
        return jsonify({"ok": False, "erro": "Exception", "detalhe": str(e)}), 500
    finally:
        conexao.close()

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

@app.route("/create_pix_payment", methods=["POST"])
def create_pix_payment():
    dados = request.get_json(silent=True) or {}
    order_id = str(dados.get("order_id") or dados.get("pedido_id") or "")
    amount   = dados.get("amount")
    email    = dados.get("email") or "cliente@teste.com"

    print("\n[PIX] payload recebido:", dados)

    # 0) sanity checks
    if not MP_TOKEN:
        print("[PIX][ERRO] Token ausente. Defina MERCADOPAGO_ACCESS_TOKEN no .env")
        return jsonify({"erro": "MERCADOPAGO_ACCESS_TOKEN ausente no .env"}), 500
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return jsonify({"erro": "amount inválido"}), 400
    if amount <= 0:
        return jsonify({"erro": "amount deve ser > 0"}), 400
    if not order_id:
        return jsonify({"erro": "order_id obrigatório"}), 400

    # 1) monta payload
    body = {
        "transaction_amount": amount,
        "payment_method_id": "pix",
        "description": f"Pedido {order_id}",
        "external_reference": order_id,
        "payer": {"email": email},
    }
    headers = {
        "Authorization": f"Bearer {MP_TOKEN}",
        "Content-Type": "application/json",
        "X-Idempotency-Key": str(uuid.uuid4()),
    }

    print("[PIX] BASE:", MP_BASE)
    print("[PIX] HEADERS OK, chamando MP /v1/payments ...")

    try:
        resposta = requests.post(
            f"{MP_BASE}/v1/payments",
            json=body,
            headers=headers,
            timeout=30
        )
        status = resposta.status_code
        texto  = resposta.text

        print("[PIX] MP STATUS:", status)
        print("[PIX] MP BODY  :", texto)

        # 2) se MP devolver erro, não estoure 500 — repasse o erro
        if status >= 300:
            # tente parsear JSON pra devolver estruturado
            try:
                err_json = resposta.json()
            except JSONDecodeError:
                err_json = {"raw": texto}
            return jsonify({"erro": "Erro do Mercado Pago", "detalhe": err_json}), 400

        # 3) sucesso: extraia com segurança
        mp = resposta.json()
        tx = (mp.get("point_of_interaction") or {}).get("transaction_data") or {}

        return jsonify({
            "ok": True,
            "payment_id": mp.get("id"),
            "status": mp.get("status"),
            "external_reference": mp.get("external_reference"),
            "qr_code": tx.get("qr_code"),
            "qr_code_base64": tx.get("qr_code_base64"),
            "ticket_url": tx.get("ticket_url"),
            "expires_at": tx.get("expires_at")
        }), 201

    except requests.Timeout:
        print("[PIX][ERRO] Timeout chamando Mercado Pago")
        return jsonify({"erro": "Timeout falando com o Mercado Pago"}), 504
    except Exception as e:
        # qualquer exceção agora vira 500 com detalhe e log
        import traceback; traceback.print_exc()
        return jsonify({"erro": "Falha interna ao criar pagamento", "detalhe": str(e)}), 500

# GET /pix/status/<payment_id> — consulta status no MP
@app.route("/pix/status/<int:payment_id>", methods=["GET"])
def pix_status(payment_id):
    if not MP_TOKEN:
        return jsonify({"erro": "MERCADOPAGO_ACCESS_TOKEN ausente"}), 500

    r = requests.get(
        f"{MP_BASE}/v1/payments/{payment_id}",
        headers={"Authorization": f"Bearer {MP_TOKEN}"},
        timeout=20
    )
    data = r.json()
    return jsonify({
        "id": data.get("id"),
        "status": data.get("status"),
        "status_detail": data.get("status_detail"),
        "external_reference": data.get("external_reference")
    }), r.status_code


# POST /webhooks/mercadopago — recebe notificação e atualiza o pedido
@app.route("/webhooks/mercadopago", methods=["POST"])
def webhook_mp():
    body = request.get_json(silent=True) or {}
    payment_id = (body.get("data") or {}).get("id") or body.get("id")
    if not payment_id:
        return jsonify({"ok": False, "motivo": "sem payment id"}), 400

    # Confirma status consultando a API (fonte da verdade)
    r = requests.get(
        f"{MP_BASE}/v1/payments/{payment_id}",
        headers={"Authorization": f"Bearer {MP_TOKEN}"},
        timeout=20
    )
    info = r.json()
    status = info.get("status")               # approved | pending | ...
    external_ref = info.get("external_reference")  # usamos como id do pedido

    # Atualiza banco (pedidos)
    conexao = conectar_banco()
    if not conexao:
        return jsonify({"ok": False, "motivo": "sem conexao banco"}), 500

    try:
        with conexao.cursor() as c:
            # Marca forma_pagamento, estado e guarda o id/status do MP
            c.execute("""
                UPDATE pedidos
                   SET forma_pagamento = 'pix',
                       estado = CASE WHEN %s='approved' THEN 'recebido' ELSE estado END,
                       mp_payment_id = %s,
                       mp_status = %s
                 WHERE id = %s
            """, (status, str(payment_id), status, external_ref))
        conexao.commit()
    except Exception as e:
        conexao.rollback()
        return jsonify({"ok": False, "motivo": str(e)}), 500
    finally:
        conexao.close()

    # Opcional: também marcar vendas como pagas se você vincula venda ao pedido
    # (Descomente e ajuste se necessário)
    # try:
    #     conexao = conectar_banco()
    #     with conexao.cursor() as c:
    #         c.execute("UPDATE vendas SET pago = %s WHERE pedido = %s", (1 if status == "approved" else 0, external_ref))
    #     conexao.commit()
    # finally:
    #     conexao.close()

    return jsonify({"ok": True, "payment_id": payment_id, "status": status})

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

    # 1) Criar usuário
    usuario_id = UsuarioLoja.criarUsuarioLoja(cliente_id, usuario, senha)
    if not usuario_id:
        return jsonify({"message": "Erro ao criar usuário"}), 500

    # 2) Criar carrinho
    carrinho_data = Carrinho.criarCarrinho(usuario_id)
    if not carrinho_data:
        return jsonify({"message": "Erro ao criar carrinho"}), 500

    # 3) Retornar apenas dados serializáveis
    return jsonify({
        "message": "Usuário e carrinho criados com sucesso",
        "usuario": {
            "id": usuario_id,
            "usuario": usuario,
            "cliente_id": cliente_id
        },
        "carrinho": carrinho_data
    })



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
