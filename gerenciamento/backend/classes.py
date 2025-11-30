from flask import Flask, jsonify, request
from datetime import datetime, timedelta, date
import pymysql
from pymysql.err import MySQLError

from flask_cors import CORS


def conectar_banco():
    try:
        conexao = pymysql.connect(
            host="localhost",
            user="root",
            password="root",
            db="bd_belladonna",
            charset='utf8mb4',
            cursorclass=pymysql.cursors.Cursor,
            autocommit=False
        )
        print("Conexao funcionando")
        return conexao
    except MySQLError as erro:
        print(f"Erro ao conectar ao banco de dados: {erro}")
        return None

class Pessoa:
    def __init__(self, id, nome, status, dataCadastro, email, telefone, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio):
        self.id = id
        self.nome = nome
        self.status = True
        self.dataCadastro = dataCadastro
        self.email = email
        self.telefone = telefone
        self.endCep = endCep
        self.endRua = endRua
        self.endNumero = endNumero
        self.endBairro = endBairro
        self.endComplemento = endComplemento
        self.endUF = endUF
        self.endMunicipio = endMunicipio

class PessoaFisica(Pessoa):
    def __init__(self, cpf, rg, sexo, dataNasc, **kwargs):
        super().__init__(**kwargs)
        self.cpf = cpf
        self.rg = rg
        self.sexo = sexo
        self.dataNasc = dataNasc

class PessoaJuridica(Pessoa):
    def __init__(self, cnpj, **kwargs):
        super().__init__(**kwargs)
        self.cnpj = cnpj

class Cliente(PessoaFisica, PessoaJuridica):
    def __init__(self, senha, **kwargs):
        super().__init__(**kwargs)
        #self.senha = senha

    @staticmethod
    def criarCliente(nome, tipo, email, telefone, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio, cpf=None, rg=None, sexo=None, dataNasc=None, cnpj=None):
        # Ajuste: tabela clientes não possui coluna 'senha' (nem obrigatoriamente 'email' como campo sensível).
        conexao = conectar_banco()
        if not conexao:
            return {"error": "Não foi possível conectar ao banco de dados."}
        try:
            cursor = conexao.cursor()
            query = '''
                INSERT INTO clientes (dataCadastro, nome, tipo, sexo, cpf, cnpj, rg, email, telefone,
                                      dataNasc, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            '''
            valores = (
                datetime.now(), nome, tipo, sexo, cpf, cnpj, rg, email, telefone,
                dataNasc, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio
            )
            cursor.execute(query, valores)
            conexao.commit()
            return {"message": "Cliente criado com sucesso."}
        except MySQLError as erro:
            print(f"Erro ao inserir cliente no banco de dados: {erro}")
            return {"error": "Erro ao criar cliente no banco de dados."}
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def editarCliente(id, nome=None, email=None, telefone=None,
                    endCep=None, endRua=None, endNumero=None, endBairro=None, endComplemento=None, endUF=None, endMunicipio=None,
                    cpf=None, rg=None, sexo=None, dataNasc=None, cnpj=None):
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            campos = []
            valores = []
            if nome:
                campos.append("nome = %s")
                valores.append(nome)
            if email:
                campos.append("email = %s")
                valores.append(email)
            # senha não é tratada aqui - não existe coluna senha na tabela clientes
            if telefone:
                campos.append("telefone = %s")
                valores.append(telefone)
            if endCep:
                campos.append("endCep = %s")
                valores.append(endCep)
            if endRua:
                campos.append("endRua = %s")
                valores.append(endRua)
            if endNumero:
                campos.append("endNumero = %s")
                valores.append(endNumero)
            if endBairro:
                campos.append("endBairro = %s")
                valores.append(endBairro)
            if endComplemento:
                campos.append("endComplemento = %s")
                valores.append(endComplemento)
            if endUF:
                campos.append("endUF = %s")
                valores.append(endUF)
            if endMunicipio:
                campos.append("endMunicipio = %s")
                valores.append(endMunicipio)
            if cpf:
                campos.append("cpf = %s")
                valores.append(cpf)
            if rg:
                campos.append("rg = %s")
                valores.append(rg)
            if sexo:
                campos.append("sexo = %s")
                valores.append(sexo)
            if dataNasc:
                campos.append("dataNasc = %s")
                valores.append(dataNasc)
            if cnpj:
                campos.append("cnpj = %s")
                valores.append(cnpj)
            if not campos:
                print("Nenhuma informação fornecida para atualização.")
                return
            cursor.execute("SELECT id FROM clientes WHERE id = %s", (id,))
            if not cursor.fetchone():
                print("Cliente não encontrado.")
                return
            query = f"UPDATE clientes SET {', '.join(campos)} WHERE id = %s"
            valores.append(id)
            cursor.execute(query, valores)
            conexao.commit()
            print(f"Cliente com ID {id} atualizado com sucesso!")
        except MySQLError as e:
            print(f"Erro ao editar cliente: {e}")
            conexao.rollback()
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def desativarCliente(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("SELECT estado FROM clientes WHERE id = %s", (id,))
        resultado = cursor.fetchone()
        if resultado:
            novo_estado = not resultado[0]
            cursor.execute("UPDATE clientes SET estado = %s WHERE id = %s", (novo_estado, id))
            conexao.commit()
        cursor.close()
        conexao.close()
        return f"Cliente com ID {id} desativado."

    @staticmethod
    def excluirCliente(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM clientes WHERE id = %s", (id,))
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Cliente com ID {id} excluído."

    @staticmethod
    def listarClientes():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT * FROM clientes"
            cursor.execute(query)
            resultados = cursor.fetchall()
            for row in resultados:
                print(row)
            return resultados
        except MySQLError as e:
            print(f"Erro ao listar clientes: {e}")
        finally:
            cursor.close()
            conexao.close()

    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            #"sexo": self.sexo,
            "estado": self.status,
            "cpf": getattr(self, "cpf", None),
            "cnpj": getattr(self, "cnpj", None),
            "rg": getattr(self, "rg", None),
            "email": self.email,
            #"senha": self.senha,
            "telefone": self.telefone,
            "data_nascimento": str(getattr(self, "dataNasc", None)) if getattr(self, "dataNasc", None) else None,
            "data_cadastro": str(self.dataCadastro),
            "cep": self.endCep,
            "rua": self.endRua,
            "numero": self.endNumero,
            "bairro": self.endBairro,
            "complemento": self.endComplemento,
            "municipio": self.endMunicipio,
            "uf": self.endUF
        }

class Funcionario(PessoaFisica):
    def __init__(self, funcao, salario, dataContratacao, senha, **kwargs):
        super().__init__(**kwargs)
        self.funcao = funcao
        self.salario = salario
        self.dataContratacao = dataContratacao
        #self.senha = senha

    @staticmethod
    def criarFuncionario(
        nome, cpf, rg, dataNasc, sexo, email, estado, telefone,
        endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio,
        funcao, salario, dataContratacao
    ):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO funcionarios
            (nome, cpf, rg, data_nascimento, sexo, email, estado, telefone, endCep, endRua,
            endNumero, endBairro, endComplemento, endUF, endMunicipio, funcao, salario, dataContratacao)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(query, (
            nome, cpf, rg, dataNasc, sexo, email, estado, telefone, endCep, endRua, endNumero,
            endBairro, endComplemento, endUF, endMunicipio, funcao, salario, dataContratacao
        ))
        conexao.commit()
        cursor.close()
        conexao.close()
        return "Funcionário adicionado com sucesso"

    @staticmethod
    def editarFuncionario(id, nome=None, email=None, telefone=None, endCep=None, endRua=None, endNumero=None, endBairro=None, endComplemento=None, endUF=None, endMunicipio=None, cpf=None, rg=None, sexo=None, dataNasc=None, funcao=None, salario=None, dataContratacao=None):
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            campos = []
            valores = []
            if nome:
                campos.append("nome = %s")
                valores.append(nome)
            if email:
                campos.append("email = %s")
                valores.append(email)
            #if senha:
            #    campos.append("senha = %s")
            #    valores.append(senha)
            if telefone:
                campos.append("telefone = %s")
                valores.append(telefone)
            if endCep:
                campos.append("endCep = %s")
                valores.append(endCep)
            if endRua:
                campos.append("endRua = %s")
                valores.append(endRua)
            if endNumero:
                campos.append("endNumero = %s")
                valores.append(endNumero)
            if endBairro:
                campos.append("endBairro = %s")
                valores.append(endBairro)
            if endComplemento:
                campos.append("endComplemento = %s")
                valores.append(endComplemento)
            if endUF:
                campos.append("endUF = %s")
                valores.append(endUF)
            if endMunicipio:
                campos.append("endMunicipio = %s")
                valores.append(endMunicipio)
            if cpf:
                campos.append("cpf = %s")
                valores.append(cpf)
            if rg:
                campos.append("rg = %s")
                valores.append(rg)
            if sexo:
                campos.append("sexo = %s")
                valores.append(sexo)
            if dataNasc:
                campos.append("data_nascimento = %s")
                valores.append(dataNasc)
            if funcao:
                campos.append("funcao = %s")
                valores.append(funcao)
            if salario:
                campos.append("salario = %s")
                valores.append(salario)
            if dataContratacao:
                campos.append("dataContratacao = %s")
                valores.append(dataContratacao)
            if not campos:
                print("Nenhuma informação fornecida para atualização.")
                return
            cursor.execute("SELECT id FROM funcionarios WHERE id = %s", (id,))
            if not cursor.fetchone():
                print("Funcionário não encontrado.")
                return
            query = f"UPDATE funcionarios SET {', '.join(campos)} WHERE id = %s"
            valores.append(id)
            cursor.execute(query, valores)
            conexao.commit()
            print(f"Funcionário com ID {id} atualizado com sucesso!")
        except MySQLError as e:
                print(f"Erro ao editar funcionário: {e}")
                conexao.rollback()
        finally:
                cursor.close()
                conexao.close()

    @staticmethod
    def desativarFuncionario(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("SELECT estado FROM funcionarios WHERE id = %s", (id,))
        resultado = cursor.fetchone()
        if resultado:
            novo_estado = not resultado[0]
            cursor.execute("UPDATE funcionarios SET estado = %s WHERE id = %s", (novo_estado, id))
            conexao.commit()
        cursor.close()
        conexao.close()
        return f"Funcionário com ID {id} desativado."

    @staticmethod
    def excluirFuncionario(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM funcionarios WHERE id = %s", (id,))
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Funcionário com ID {id} excluído."

    @staticmethod
    def listarFuncionarios():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT * FROM funcionarios"
            cursor.execute(query)
            resultados = cursor.fetchall()
            for row in resultados:
                print(row)
            return resultados
        except MySQLError as e:
            print(f"Erro ao listar funcionários: {e}")
        finally:
            cursor.close()
            conexao.close()

    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "sexo": self.sexo,
            "estado": self.status,
            "cpf": getattr(self, "cpf", None),
            "rg": getattr(self, "rg", None),
            "email": self.email,
            #"senha": self.senha,
            "telefone": self.telefone,
            "data_nascimento": str(getattr(self, "dataNasc", None)) if getattr(self, "dataNasc", None) else None,
            "data_cadastro": str(self.dataCadastro) if hasattr(self, "dataCadastro") else None,
            "cep": self.endCep,
            "rua": self.endRua,
            "numero": self.endNumero,
            "bairro": self.endBairro,
            "complemento": self.endComplemento,
            "municipio": self.endMunicipio,
            "uf": self.endUF,
            "funcao": self.funcao,
            "salario": self.salario,
            "dataContratacao": str(self.dataContratacao) if self.dataContratacao else None
        }

class Produto:
    def __init__(self, id=None, nome=None, categoria=None, marca=None, preco=None, quantidadeEstoque=None, estoqueMinimo=None, estado=True, fornecedor_id=None, imagem_1=None, imagem_2=None, imagem_3=None):
        self.id = id
        self.nome = nome
        self.categoria = categoria
        self.marca = marca
        self.preco = preco
        self.quantidadeEstoque = quantidadeEstoque
        self.estoqueMinimo = estoqueMinimo
        self.estado = estado
        self.fornecedor_id = fornecedor_id
        self.imagem_1 = imagem_1
        self.imagem_2 = imagem_2
        self.imagem_3 = imagem_3

    @staticmethod
    def criarProduto(nome, categoria, marca, preco, quantidadeEstoque, estoqueMinimo, estado, fornecedor_id, imagem_1=None, imagem_2=None, imagem_3=None):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO produtos (nome, categoria, marca, preco, quantidade_estoque, estoque_minimo, estado, fornecedor_id, imagem_1, imagem_2, imagem_3)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(query, (nome, categoria, marca, preco, quantidadeEstoque, estoqueMinimo, estado, fornecedor_id, imagem_1, imagem_2, imagem_3))
        conexao.commit()
        produto_id = cursor.lastrowid  # <-- pega o ID do produto criado
        cursor.close()
        conexao.close()
        return {"message": "Produto adicionado com sucesso", "id": produto_id}  # <-- retorna ID

    @staticmethod
    def editarProduto(id, nome=None, categoria=None, marca=None, preco=None, quantidadeEstoque=None, estoqueMinimo=None, estado=None, imagem_1=None, imagem_2=None, imagem_3=None):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        campos = []
        valores = []
        if nome:
            campos.append("nome = %s")
            valores.append(nome)
        if categoria:
            campos.append("categoria = %s")
            valores.append(categoria)
        if marca:
            campos.append("marca = %s")
            valores.append(marca)
        if preco:
            campos.append("preco = %s")
            valores.append(preco)
        if quantidadeEstoque:
            campos.append("quantidade_estoque = %s")
            valores.append(quantidadeEstoque)
        if estoqueMinimo:
            campos.append("estoque_minimo = %s")
            valores.append(estoqueMinimo)
        if estado is not None:
            campos.append("estado = %s")
            valores.append(estado)
        if imagem_1:
            campos.append("imagem_1 = %s")
            valores.append(imagem_1)
        if imagem_2:
            campos.append("imagem_2 = %s")
            valores.append(imagem_2)
        if imagem_3:
            campos.append("imagem_3 = %s")
            valores.append(imagem_3)
        if not campos:
            print("Nenhuma informacao para atualizar")
            return
        cursor.execute(f"UPDATE produtos SET {', '.join(campos)} WHERE id = %s", valores + [id])
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Produto com ID {id} atualizado com sucesso"

    @staticmethod
    def desativarProduto(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("SELECT estado FROM produtos WHERE id = %s", (id,))
        resultado = cursor.fetchone()
        if resultado:
            novo_estado = not resultado[0]
            cursor.execute("UPDATE produtos SET estado = %s WHERE id = %s", (novo_estado, id))
            conexao.commit()
        cursor.close()
        conexao.close()
        return f"Produto com ID {id} teve estado alterado."

    @staticmethod
    def excluirProduto(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM produtos WHERE id = %s", (id,))
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Produto com ID {id} excluido."

    @staticmethod
    def listarProdutos():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT * FROM produtos"
            cursor.execute(query)
            resultados = cursor.fetchall()
            for row in resultados:
                print(row)
            return resultados
        except MySQLError as e:
            print(f"Erro ao listar produtos: {e}")
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def obterProduto(nome):
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT * FROM produtos WHERE nome = %s"
            cursor.execute(query, (nome,))
            resultado = cursor.fetchone()
            if resultado:
                produto = {
                    "id": resultado[0],
                    "nome": resultado[1],
                    "categoria": resultado[2],
                    "marca": resultado[3],
                    "preco": float(resultado[4]),
                    "quantidadeEstoque": resultado[5],
                    "estoqueMinimo": resultado[6],
                    "estado": bool(resultado[7])
                }
                return produto
            else:
                return None
        except MySQLError as e:
            print(f"Erro ao obter produto: {e}")
            return None
        finally:
            cursor.close()
            conexao.close()

    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "categoria": self.categoria,
            "marca": self.marca,
            "preco": self.preco,
            "quantidadeEstoque": self.quantidadeEstoque,
            "estoqueMinimo": self.estoqueMinimo,
            "estado": self.estado
        }


class Fornecedor:
    def __init__(self, id=None, nome_empresa=None, cnpj=None, telefone=None, email=None, endCep=None, endRua=None,
                 endNumero=None, endBairro=None, endComplemento=None, endUF=None, endMunicipio=None):
        self.id = id
        self.nome_empresa = nome_empresa
        self.cnpj = cnpj
        self.telefone = telefone
        self.email = email
        self.endCep = endCep
        self.endRua = endRua
        self.endNumero = endNumero
        self.endBairro = endBairro
        self.endComplemento = endComplemento
        self.endUF = endUF
        self.endMunicipio = endMunicipio

    @staticmethod
    def criarFornecedor(nome_empresa, cnpj, telefone, email, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO fornecedores (nome_empresa, cnpj, telefone, email, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(query, (nome_empresa, cnpj, telefone, email, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio))
        conexao.commit()
        cursor.close()
        conexao.close()
        return "Fornecedor adicionado com sucesso"

    @staticmethod
    def editarFornecedor(id, nome_empresa=None, cnpj=None, telefone=None, email=None, endCep=None, endRua=None,
                         endNumero=None, endBairro=None, endComplemento=None, endUF=None, endMunicipio=None):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        campos = []
        valores = []
        if nome_empresa:
            campos.append("nome_empresa = %s")
            valores.append(nome_empresa)
        if cnpj:
            campos.append("cnpj = %s")
            valores.append(cnpj)
        if telefone:
            campos.append("telefone = %s")
            valores.append(telefone)
        if email:
            campos.append("email = %s")
            valores.append(email)
        if endCep:
            campos.append("endCep = %s")
            valores.append(endCep)
        if endRua:
            campos.append("endRua = %s")
            valores.append(endRua)
        if endNumero:
            campos.append("endNumero = %s")
            valores.append(endNumero)
        if endBairro:
            campos.append("endBairro = %s")
            valores.append(endBairro)
        if endComplemento:
            campos.append("endComplemento = %s")
            valores.append(endComplemento)
        if endUF:
            campos.append("endUF = %s")
            valores.append(endUF)
        if endMunicipio:
            campos.append("endMunicipio = %s")
            valores.append(endMunicipio)
        if not campos:
            return "Nenhuma informacao para atualizar"
        cursor.execute(f"UPDATE fornecedores SET {', '.join(campos)} WHERE id = %s", valores + [id])
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Fornecedor com ID {id} atualizado com sucesso"

    @staticmethod
    def excluirFornecedor(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM fornecedores WHERE id = %s", (id,))
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Fornecedor com ID {id} excluido."

    @staticmethod
    def listarFornecedores():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT * FROM fornecedores"
            cursor.execute(query)
            resultados = cursor.fetchall()
            for row in resultados:
                print(row)
            return resultados
            
        except MySQLError as e:
                print(f"Erro ao listar fornecedores: {e}")
        finally:
                cursor.close()
                conexao.close()

    def json(self):
        return {
            "id": self.id,
            "nome_empresa": self.nome_empresa,
            "cnpj": self.cnpj,
            "telefone": self.telefone,
            "email": self.email,
            "cep": self.endCep,
            "rua": self.endRua,
            "numero": self.endNumero,
            "bairro": self.endBairro,
            "complemento": self.endComplemento,
            "municipio": self.endMunicipio,
            "uf": self.endUF
        }

class Cupom:
    def __init__(self, id=None, codigo=None, tipo=None, descontofixo=0.0, descontoPorcentagem=0.0, descontofrete=0.0,
                 validade=None, usos_permitidos=0, usos_realizados=0, valor_minimo=0.0, estado='ativo', produto=None):
        self.id = id
        self.codigo = codigo
        self.tipo = tipo
        self.descontofixo = descontofixo
        self.descontoPorcentagem = descontoPorcentagem
        self.descontofrete = descontofrete
        self.validade = validade
        self.usos_permitidos = usos_permitidos
        self.usos_realizados = usos_realizados
        self.valor_minimo = valor_minimo
        self.estado = estado
        self.produto = produto  # Nome do produto ou tipo

    @staticmethod
    def criarCupom(codigo, tipo, descontofixo, descontoPorcentagem, descontofrete, validade, usos_permitidos, valor_minimo, produto):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO cupons (codigo, tipo, descontofixo, descontoPorcentagem, descontofrete, validade, usos_permitidos, valor_minimo, estado, produto)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, TRUE, %s)
        '''
        cursor.execute(query, (codigo, tipo, descontofixo, descontoPorcentagem, descontofrete, validade, usos_permitidos, valor_minimo, produto))
        conexao.commit()
        cursor.close()
        conexao.close()
        return "Cupom criado com sucesso"

    @staticmethod
    def editarCupom(id, codigo=None, tipo=None, descontofixo=None, descontoPorcentagem=None, descontofrete=None,
                    validade=None, usos_permitidos=None, valor_minimo=None, produto=None):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        campos = []
        valores = []
        if codigo:
            campos.append("codigo = %s")
            valores.append(codigo)
        if tipo:
            campos.append("tipo = %s")
            valores.append(tipo)
        if descontofixo is not None:
            campos.append("descontofixo = %s")
            valores.append(descontofixo)
        if descontoPorcentagem is not None:
            campos.append("descontoPorcentagem = %s")
            valores.append(descontoPorcentagem)
        if descontofrete is not None:
            campos.append("descontofrete = %s")
            valores.append(descontofrete)
        if validade:
            campos.append("validade = %s")
            valores.append(validade)
        if usos_permitidos is not None:
            campos.append("usos_permitidos = %s")
            valores.append(usos_permitidos)
        if valor_minimo is not None:
            campos.append("valor_minimo = %s")
            valores.append(valor_minimo)
        if produto is not None:
            campos.append("produto = %s")
            valores.append(produto)
        if not campos:
            return "Nenhuma informacao para atualizar"
        cursor.execute(f"UPDATE cupons SET {', '.join(campos)} WHERE id = %s", valores + [id])
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Cupom com ID {id} atualizado com sucesso"

    @staticmethod
    def desativarCupom(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("SELECT estado FROM cupons WHERE id = %s", (id,))
        resultado = cursor.fetchone()
        if resultado:
            novo_estado = not resultado[0]
            cursor.execute("UPDATE cupons SET estado = %s WHERE id = %s", (novo_estado, id))
            conexao.commit()
        cursor.close()
        conexao.close()
        return f"Cupom com ID {id} teve estado alterado."

    @staticmethod
    def excluirCupom(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM cupons WHERE id = %s", (id,))
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Cupom com ID {id} excluido."

    @staticmethod
    def listarCupons():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = """
            SELECT id, codigo, tipo, descontofixo, descontoPorcentagem, descontofrete,
                validade, estado, produto, usos_permitidos, usos_realizados, valor_minimo
            FROM cupons
            """
            cursor.execute(query)
            resultados = cursor.fetchall()

            cupons = []
            for row in resultados:
                cupons.append({
                    "id": row[0],
                    "codigo": row[1],
                    "tipo": row[2],
                    "descontofixo": row[3],
                    "descontoPorcentagem": row[4],
                    "descontofrete": row[5],
                    "validade": row[6].strftime("%Y-%m-%d") if row[6] else None,
                    "estado": "ativo" if row[7] else "inativo",
                    "produto": row[8],  # Nome do produto ou tipo
                    "usos_permitidos": row[9] if row[9] is not None else 0,
                    "usos_realizados": row[10] if row[10] is not None else 0,
                    "valor_minimo": float(row[11]) if row[11] is not None else 0.0
                })

            return cupons
        except MySQLError as e:
            print(f"Erro ao listar cupons: {e}")
            return []
        finally:
            cursor.close()
            conexao.close()


    def json(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "tipo": self.tipo,
            "descontofixo": self.descontofixo,
            "descontoPorcentagem": self.descontoPorcentagem,
            "descontofrete": self.descontofrete,
            "validade": str(self.validade) if self.validade else None,
            "usos_permitidos": self.usos_permitidos,
            "usos_realizados": self.usos_realizados,
            "valor_minimo": self.valor_minimo,
            "estado": self.estado,
            "produto": self.produto  # Nome do produto ou tipo
        }

class ServicoPersonalizado:
    def __init__(self, id, nome, produtos, preco, status):
        self.id = id
        self.nome = nome
        self.produtos = produtos
        self.preco = preco
        self.status = status

    @staticmethod
    def criarServicoPersonalizado(nome, produtos, preco):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO servicos_personalizados (nome, produtos, preco, status)
            VALUES (%s, %s, %s, TRUE)
        '''
        cursor.execute(query, (nome, str(produtos), preco))
        conexao.commit()
        cursor.close()
        conexao.close()
        return "Serviço personalizado criado com sucesso"

    @staticmethod
    def editarServicoPersonalizado(id, nome=None, produtos=None, preco=None, status=None):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        campos = []
        valores = []
        if nome:
            campos.append("nome = %s")
            valores.append(nome)
        if produtos:
            campos.append("produtos = %s")
            valores.append(str(produtos))
        if preco is not None:
            campos.append("preco = %s")
            valores.append(preco)
        if status is not None:
            campos.append("status = %s")
            valores.append(status)
        if not campos:
            return "Nenhuma informacao para atualizar"
        cursor.execute(f"UPDATE servicos_personalizados SET {', '.join(campos)} WHERE id = %s", valores + [id])
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Serviço personalizado com ID {id} atualizado com sucesso"

    @staticmethod
    def desativarServicoPersonalizado(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("SELECT status FROM servicos_personalizados WHERE id = %s", (id,))
        resultado = cursor.fetchone()
        if resultado:
            novo_status = not resultado[0]
            cursor.execute("UPDATE servicos_personalizados SET status = %s WHERE id = %s", (novo_status, id))
            conexao.commit()
        cursor.close()
        conexao.close()
        return f"Serviço personalizado com ID {id} teve status alterado."

    @staticmethod
    def excluirServicoPersonalizado(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM servicos_personalizados WHERE id = %s", (id,))
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Serviço personalizado com ID {id} excluído."

    @staticmethod
    def listarServicosPersonalizados():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT * FROM servicos_personalizados"
            cursor.execute(query)
            resultados = cursor.fetchall()
            for row in resultados:
                print(row)
            return resultados
            
        except MySQLError as e:
            print(f"Erro ao listar serviços personalizados: {e}")
        finally:
            cursor.close()
            conexao.close()

    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "produtos": self.produtos,
            "preco": self.preco,
            "status": self.status
        }

class Carrinho:
    def __init__(self, id, idCliente):
        self.id = id
        self.idCliente = idCliente
        self.produtos = []
        self.valorTotal = 0.0

    @staticmethod
    def criarCarrinho(idCliente):
        # Implementação básica, pode ser adaptada conforme o modelo do banco
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO carrinho_de_compra (idCliente, valorTotal)
            VALUES (%s, %s)
        '''
        cursor.execute(query, (idCliente, 0.0))
        conexao.commit()
        cursor.close()
        conexao.close()
        return "Carrinho criado com sucesso"

    @staticmethod
    def excluirCarrinho(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM carrinho_de_compra WHERE id = %s", (id,))
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Carrinho com ID {id} excluído."

    @staticmethod
    def listarCarrinhos():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT * FROM carrinho_de_compra"
            cursor.execute(query)
            resultados = cursor.fetchall()
            for row in resultados:
                print(row)
            return resultados
            
        except MySQLError as e:
            print(f"Erro ao listar carrinhos: {e}")
        finally:
            cursor.close()
            conexao.close()

    def json(self):
        return {
            "id": self.id,
            "idCliente": self.idCliente,
            "produtos": self.produtos,
            "valorTotal": self.valorTotal
        }

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
        self.pago = False

    @staticmethod
    def criarVenda(cliente, funcionario, produtos, valorTotal, dataVenda, entrega, dataEntrega, pago=False):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        # inclui o campo 'pago' (BOOLEAN) no INSERT
        query = "INSERT INTO vendas (cliente, funcionario, produtos, valorTotal, dataVenda, entrega, dataEntrega, pago) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (cliente, funcionario, str(produtos), valorTotal, dataVenda, entrega, dataEntrega, 1 if pago else 0))
        conexao.commit()
        last_id = cursor.lastrowid
        cursor.close()
        conexao.close()
        return {"id": last_id}

    @staticmethod
    def excluirVenda(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM vendas WHERE id = %s", (id,))
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Venda com ID {id} excluída."

    @staticmethod
    def listarVendas():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT * FROM vendas"
            cursor.execute(query)
            resultados = cursor.fetchall()
            for row in resultados:
                print(row)
            return resultados
            
        except MySQLError as e:
            print(f"Erro ao listar vendas: {e}")
        finally:
            cursor.close()
            conexao.close()
    def json(self):
        return {
            "id": self.id,
            "cliente": self.cliente,
            "funcionario": self.funcionario,
            "produtos": self.produtos,
            "valorTotal": self.valorTotal,
            "dataVenda": str(self.dataVenda) if self.dataVenda else None,
            "entrega": self.entrega,
            "dataEntrega": str(self.dataEntrega) if self.dataEntrega else None,
            "pago": self.pago
        }
    

    # ...código existente...

class TransacaoFinanceira:
    def __init__(self, id=None, tipo=None, categoria=None, descricao=None, valor=None, data=None):
        self.id = id
        self.tipo = tipo
        self.categoria = categoria
        self.descricao = descricao
        self.valor = valor
        self.data = data

    @staticmethod
    def criarTransacao(tipo, categoria, descricao, valor, data):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO transacoes_financeiras (tipo, categoria, descricao, valor, data_transacao)
            VALUES (%s, %s, %s, %s, %s)
        '''
        cursor.execute(query, (tipo, categoria, descricao, valor, data))
        conexao.commit()
        cursor.close()
        conexao.close()
        return "Transação financeira criada com sucesso"

    @staticmethod
    def editarTransacao(id, tipo=None, categoria=None, descricao=None, valor=None, data=None):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        campos = []
        valores = []
        if tipo:
            campos.append("tipo = %s")
            valores.append(tipo)
        if categoria:
            campos.append("categoria = %s")
            valores.append(categoria)
        if descricao:
            campos.append("descricao = %s")
            valores.append(descricao)
        if valor is not None:
            campos.append("valor = %s")
            valores.append(valor)
        if data:
            campos.append("data_transacao = %s")
            valores.append(data)
        if not campos:
            return "Nenhuma informação para atualizar"
        cursor.execute(f"UPDATE transacoes_financeiras SET {', '.join(campos)} WHERE id = %s", valores + [id])
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Transação financeira com ID {id} atualizada com sucesso"

    @staticmethod
    def excluirTransacao(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM transacoes_financeiras WHERE id = %s", (id,))
        conexao.commit()
        cursor.close()
        conexao.close()
        return f"Transação financeira com ID {id} excluída."

    @staticmethod
    def listarTransacoes():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT * FROM transacoes_financeiras"
            cursor.execute(query)
            resultados = cursor.fetchall()
            for row in resultados:
                print(row)
            return resultados
            
        except MySQLError as e:
            print(f"Erro ao listar transações financeiras: {e}")
        finally:
            cursor.close()
            conexao.close()

    def json(self):
        return {
            "id": self.id,
            "data": str(self.data) if self.data else None,
            "tipo": self.tipo,
            "categoria": self.categoria,
            "descricao": self.descricao,
            "valor": self.valor,
        }

class UsuarioSistema:
    def __init__(self, id=None, funcionario_id=None, tipo_usuario=None, usuario=None, senha=None, tema_preferido='claro'):
        self.id = id
        self.funcionario_id = funcionario_id
        self.tipo_usuario = tipo_usuario  # 'Administrador', 'Vendedor' ou 'Estoque'
        self.usuario = usuario
        self.senha = senha
        self.tema_preferido = tema_preferido

    @staticmethod
    def criarUsuarioSistema(funcionario_id, tipo_usuario, usuario, senha, tema_preferido='claro'):
        """
        Insere um novo registro em usuarios_sistema.
        Observação: não faz hashing de senha aqui — armazene o valor que for passado.
        """
        conexao = conectar_banco()
        cursor = conexao.cursor()
        try:
            query = '''
                INSERT INTO usuarios_sistema
                (funcionario_id, tipo_usuario, usuario, senha, tema_preferido)
                VALUES (%s, %s, %s, %s, %s)
            '''
            cursor.execute(query, (funcionario_id, tipo_usuario, usuario, senha, tema_preferido))
            conexao.commit()
            return "Usuário do sistema adicionado com sucesso"
        except MySQLError as e:
            conexao.rollback()
            print(f"Erro ao criar usuário do sistema: {e}")
            return f"Erro: {e}"
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def editarUsuarioSistema(id, funcionario_id=None, tipo_usuario=None, usuario=None, senha=None, tema_preferido=None):
        """
        Atualiza campos fornecidos do usuário do sistema identificado por id.
        """
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            campos = []
            valores = []
            if funcionario_id is not None:
                campos.append("funcionario_id = %s")
                valores.append(funcionario_id)
            if tipo_usuario is not None:
                campos.append("tipo_usuario = %s")
                valores.append(tipo_usuario)
            if usuario is not None:
                campos.append("usuario = %s")
                valores.append(usuario)
            if senha is not None:
                campos.append("senha = %s")
                valores.append(senha)
            if tema_preferido is not None:
                campos.append("tema_preferido = %s")
                valores.append(tema_preferido)
            if not campos:
                print("Nenhuma informação fornecida para atualização.")
                return "Nenhuma alteração realizada"

            cursor.execute("SELECT id FROM usuarios_sistema WHERE id = %s", (id,))
            if not cursor.fetchone():
                print("Usuário do sistema não encontrado.")
                return "Usuário não encontrado"

            query = f"UPDATE usuarios_sistema SET {', '.join(campos)} WHERE id = %s"
            valores.append(id)
            cursor.execute(query, valores)
            conexao.commit()
            return f"Usuário do sistema com ID {id} atualizado com sucesso!"
        except MySQLError as e:
            conexao.rollback()
            print(f"Erro ao editar usuário do sistema: {e}")
            return f"Erro: {e}"
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def excluirUsuarioSistema(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        try:
            cursor.execute("DELETE FROM usuarios_sistema WHERE id = %s", (id,))
            conexao.commit()
            return f"Usuário do sistema com ID {id} excluído."
        except MySQLError as e:
            conexao.rollback()
            print(f"Erro ao excluir usuário do sistema: {e}")
            return f"Erro: {e}"
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def listarUsuarios():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT id, funcionario_id, tipo_usuario, usuario, senha, tema_preferido FROM usuarios_sistema"
            cursor.execute(query)
            resultados = cursor.fetchall()
            usuarios = []
            for row in resultados:
                usuarios.append({
                    "id": row[0],
                    "funcionario_id": row[1],
                    "tipo_usuario": row[2],
                    "usuario": row[3],
                    "senha": row[4],
                    "tema_preferido": row[5]
                })
            return usuarios
        except MySQLError as e:
            print(f"Erro ao listar usuários do sistema: {e}")
            return []
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def buscarPorId(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        try:
            cursor.execute("SELECT id, funcionario_id, tipo_usuario, usuario, senha, tema_preferido FROM usuarios_sistema WHERE id = %s", (id,))
            row = cursor.fetchone()
            if not row:
                return None
            return UsuarioSistema(id=row[0], funcionario_id=row[1], tipo_usuario=row[2], usuario=row[3], senha=row[4], tema_preferido=row[5])
        except MySQLError as e:
            print(f"Erro ao buscar usuário por id: {e}")
            return None
        finally:
            cursor.close()
            conexao.close()

    def json(self):
        return {
            "id": self.id,
            "funcionario_id": self.funcionario_id,
            "tipo_usuario": self.tipo_usuario,
            "usuario": self.usuario,
            "senha": self.senha,
            "tema_preferido": self.tema_preferido
        }

class UsuarioLoja:
    def __init__(self, id=None, cliente_id=None, usuario=None, senha=None):
        self.id = id
        self.cliente_id = cliente_id
        self.usuario = usuario
        self.senha = senha  # atenção: armazenamento/retorno da senha deve ser tratado com cuidado (hash)

    @staticmethod
    def criarUsuarioLoja(cliente_id, usuario, senha):
        """
        Insere um novo registro em usuarios_loja.
        Observação: não faz hashing de senha aqui — armazene o valor que for passado.
        """
        conexao = conectar_banco()
        cursor = conexao.cursor()
        try:
            query = '''
                INSERT INTO usuarios_loja (cliente_id, usuario, senha)
                VALUES (%s, %s, %s)
            '''
            cursor.execute(query, (cliente_id, usuario, senha))
            conexao.commit()
            return "Usuário da loja adicionado com sucesso"
        except MySQLError as e:
            conexao.rollback()
            print(f"Erro ao criar usuário da loja: {e}")
            return f"Erro: {e}"
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def editarUsuarioLoja(id, cliente_id=None, usuario=None, senha=None):
        """
        Atualiza campos fornecidos do usuário da loja identificado por id.
        """
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            campos = []
            valores = []
            if cliente_id is not None:
                campos.append("cliente_id = %s")
                valores.append(cliente_id)
            if usuario is not None:
                campos.append("usuario = %s")
                valores.append(usuario)
            if senha is not None:
                campos.append("senha = %s")
                valores.append(senha)
            if not campos:
                print("Nenhuma informação fornecida para atualização.")
                return "Nenhuma alteração realizada"

            cursor.execute("SELECT id FROM usuarios_loja WHERE id = %s", (id,))
            if not cursor.fetchone():
                print("Usuário da loja não encontrado.")
                return "Usuário não encontrado"

            query = f"UPDATE usuarios_loja SET {', '.join(campos)} WHERE id = %s"
            valores.append(id)
            cursor.execute(query, valores)
            conexao.commit()
            return f"Usuário da loja com ID {id} atualizado com sucesso!"
        except MySQLError as e:
            conexao.rollback()
            print(f"Erro ao editar usuário da loja: {e}")
            return f"Erro: {e}"
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def excluirUsuarioLoja(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        try:
            cursor.execute("DELETE FROM usuarios_loja WHERE id = %s", (id,))
            conexao.commit()
            return f"Usuário da loja com ID {id} excluído."
        except MySQLError as e:
            conexao.rollback()
            print(f"Erro ao excluir usuário da loja: {e}")
            return f"Erro: {e}"
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def listarUsuariosLoja():
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT id, cliente_id, usuario, senha FROM usuarios_loja"
            cursor.execute(query)
            resultados = cursor.fetchall()
            usuarios = []
            for row in resultados:
                usuarios.append({
                    "id": row[0],
                    "cliente_id": row[1],
                    "usuario": row[2],
                    "senha": row[3]
                })
            return usuarios
        except MySQLError as e:
            print(f"Erro ao listar usuários da loja: {e}")
            return []
        finally:
            cursor.close()
            conexao.close()

    @staticmethod
    def buscarPorId(id):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        try:
            cursor.execute("SELECT id, cliente_id, usuario, senha FROM usuarios_loja WHERE id = %s", (id,))
            row = cursor.fetchone()
            if not row:
                return None
            return UsuarioLoja(id=row[0], cliente_id=row[1], usuario=row[2], senha=row[3])
        except MySQLError as e:
            print(f"Erro ao buscar usuário da loja por id: {e}")
            return None
        finally:
            cursor.close()
            conexao.close()

    def json(self):
        return {
            "id": self.id,
            "cliente_id": self.cliente_id,
            "usuario": self.usuario,
            "senha": self.senha
        }


conectar_banco()
