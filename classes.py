from datetime import datetime, timedelta, date
import mysql.connector

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
        self.senha = senha

    @staticmethod
    def criarCliente(nome, tipo, email, senha, telefone, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio, cpf=None, rg=None, sexo=None, dataNasc=None, cnpj=None):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO clientes (dataCadastro, nome, tipo, sexo, cpf, cnpj, rg, email, senha, telefone,
                                dataNasc, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        dataHoje = date.today().strftime('%Y-%m-%d')
        cursor.execute(query, (dataHoje, nome, tipo, sexo, cpf, cnpj, rg,
                               email, senha, telefone, dataNasc,
                               endCep, endRua, endNumero, endBairro,
                               endComplemento, endUF, endMunicipio))
        conexao.commit()
        cursor.close()
        conexao.close()
        return 'Cliente adicionado com sucesso'

    @staticmethod
    def editarCliente(id, nome=None, email=None, senha=None, telefone=None,
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
            if senha:
                campos.append("senha = %s")
                valores.append(senha)
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
        except mysql.connector.Error as e:
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
        except mysql.connector.Error as e:
            print(f"Erro ao listar clientes: {e}")
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
            "cnpj": getattr(self, "cnpj", None),
            "rg": getattr(self, "rg", None),
            "email": self.email,
            "senha": self.senha,
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
        self.senha = senha

    @staticmethod
    def criarFuncionario(nome, email, senha, telefone, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio, cpf, rg, sexo, dataNasc, funcao, salario, dataContratacao):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO funcionarios (nome, cpf, rg, data_nascimento, sexo, email, senha, estado, telefone, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio, funcao)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(query, (nome, cpf, rg, dataNasc, sexo, email, senha, True, telefone, endCep, endRua, endNumero, endBairro, endComplemento, endUF, endMunicipio, funcao))
        conexao.commit()
        cursor.close()
        conexao.close()
        return "Funcionário adicionado com sucesso"

    @staticmethod
    def editarFuncionario(id, nome=None, email=None, senha=None, telefone=None, endCep=None, endRua=None, endNumero=None, endBairro=None, endComplemento=None, endUF=None, endMunicipio=None, cpf=None, rg=None, sexo=None, dataNasc=None, funcao=None, salario=None, dataContratacao=None):
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
            if senha:
                campos.append("senha = %s")
                valores.append(senha)
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
        except mysql.connector.Error as e:
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
        except mysql.connector.Error as e:
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
            "senha": self.senha,
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
    def __init__(self, id=None, nome=None, categoria=None, marca=None, preco=None, quantidadeEstoque=None, status=True):
        self.id = id
        self.nome = nome
        self.categoria = categoria
        self.marca = marca
        self.preco = preco
        self.quantidadeEstoque = quantidadeEstoque
        self.status = status

    @staticmethod
    def criarProduto(nome, categoria, marca, preco, quantidadeEstoque):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO produtos (nome, categoria, marca, preco, quantidade_estoque, estoque_minimo, estado)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(query, (nome, categoria, marca, preco, quantidadeEstoque, 0, True))
        conexao.commit()
        cursor.close()
        conexao.close()
        return 'Produto adicionado com sucesso'

    @staticmethod
    def editarProduto(id, nome=None, categoria=None, marca=None, preco=None, quantidadeEstoque=None):
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
        except mysql.connector.Error as e:
            print(f"Erro ao listar produtos: {e}")
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
            "status": self.status
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
        except mysql.connector.Error as e:
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
                 validade=None, usos_permitidos=0, usos_realizados=0, valor_minimo=0.0, estado='ativo'):
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

    @staticmethod
    def criarCupom(codigo, tipo, descontofixo, descontoPorcentagem, descontofrete, validade, usos_permitidos, valor_minimo):
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO cupons (codigo, tipo, descontofixo, descontoPorcentagem, descontofrete, validade, usos_permitidos, valor_minimo, estado)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, TRUE)
        '''
        cursor.execute(query, (codigo, tipo, descontofixo, descontoPorcentagem, descontofrete, validade, usos_permitidos, valor_minimo))
        conexao.commit()
        cursor.close()
        conexao.close()
        return "Cupom criado com sucesso"

    @staticmethod
    def editarCupom(id, codigo=None, tipo=None, descontofixo=None, descontoPorcentagem=None, descontofrete=None,
                    validade=None, usos_permitidos=None, valor_minimo=None):
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
            query = "SELECT * FROM cupons"
            cursor.execute(query)
            resultados = cursor.fetchall()
            for row in resultados:
                print(row)
        except mysql.connector.Error as e:
            print(f"Erro ao listar cupons: {e}")
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
            "estado": self.estado
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
        except mysql.connector.Error as e:
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
        except mysql.connector.Error as e:
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

    @staticmethod
    def criarVenda(cliente, funcionario, produtos, valorTotal, dataVenda, entrega, dataEntrega):
        # Implementação básica, pode ser adaptada conforme o modelo do banco
        conexao = conectar_banco()
        cursor = conexao.cursor()
        query = '''
            INSERT INTO vendas (cliente, funcionario, produtos, valorTotal, dataVenda, entrega, dataEntrega)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(query, (cliente, funcionario, str(produtos), valorTotal, dataVenda, entrega, dataEntrega))
        conexao.commit()
        cursor.close()
        conexao.close()
        return "Venda criada com sucesso"

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
        except mysql.connector.Error as e:
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
            "dataEntrega": str(self.dataEntrega) if self.dataEntrega else None
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
            INSERT INTO transacoes_financeiras (tipo, categoria, descricao, valor, data)
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
            campos.append("data = %s")
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
        except mysql.connector.Error as e:
            print(f"Erro ao listar transações financeiras: {e}")
        finally:
            cursor.close()
            conexao.close()

    def json(self):
        return {
            "id": self.id,
            "tipo": self.tipo,
            "categoria": self.categoria,
            "descricao": self.descricao,
            "valor": self.valor,
            "data": str(self.data) if self.data else None
        }

# ...restante do