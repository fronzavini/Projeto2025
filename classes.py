from datetime import datetime, timedelta
import mysql.connector


#Ajeitar depois com as informçações corretas 
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
    def __init__(self, id, nome, status, dataCadastro, email, telefone, endCep, endRua, endBairro, endComplemento, endUF):
        self.id = id
        self.nome = nome
        self.status = True
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

class Cliente(PessoaFisica, PessoaJuridica):
    def __init__(self, senha, **kwargs):
        super().__init__(**kwargs)
        self.senha = senha

    #Estrutura básica de metodos enquanto não implementamos o BD

    #Podemos criar um cliente sem endereço?
    def criarCliente(self, nome, dataCadastro, email, telefone, endCep=None, endRua=None, endBairro=None, endComplemento=None, endUF=None, cpf=None, rg=None, sexo=None, dataNasc=None, cnpj=None):
        return Cliente(nome=nome, dataCadastro=dataCadastro, email=email, telefone=telefone, endCep=endCep, endRua=endRua, endBairro=endBairro, endComplemento=endComplemento, endUF=endUF, cpf=cpf, rg=rg, sexo=sexo, dataNasc=dataNasc, cnpj=cnpj)

    def editarCliente(self, id, nome=None, dataCadastro=None, email=None, telefone=None, endCep=None, endRua=None, endBairro=None, endComplemento=None, endUF=None, cpf=None, rg=None, sexo=None, dataNasc=None, cnpj=None):
        cliente = Cliente(id=id, nome=nome, dataCadastro=dataCadastro, email=email, telefone=telefone, endCep=endCep, endRua=endRua, endBairro=endBairro, endComplemento=endComplemento, endUF=endUF, cpf=cpf, rg=rg, sexo=sexo, dataNasc=dataNasc, cnpj=cnpj)
        return cliente
    
    def desativarCliente(self, id):
        # Aqui você pode implementar a lógica para desativar o cliente com o ID fornecido
        return f"Cliente com ID {id} desativado."

    def excluirCliente(self, id):


        # Aqui você pode implementar a lógica para excluir o cliente com o ID fornecido
        return f"Cliente com ID {id} excluído."

    def listarClientes(self):

        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()
            query = "SELECT * FROM Cliente"
            cursor.execute(query)
            resultados = cursor.fetchall()
            for row in resultados:
                print(row)
        except mysql.connector.Error as e:
            print(f"Erro ao listar clientes: {e}")
        finally:
            cursor.close()
            conexao.close()


class Funcionario(PessoaFisica):
    def __init__(self, funcao, salario, dataContratacao, senha, **kwargs):
        super().__init__(**kwargs)
        self.funcao = funcao
        self.salario = salario
        self.dataContratacao = dataContratacao
        self.senha = senha

    def criarFuncionario(self, nome, dataCadastro, email, telefone, endCep, endRua, endBairro, endComplemento, endUF, cpf, rg, sexo, dataNasc, funcao, salario, dataContratacao):
        return Funcionario(nome=nome, dataCadastro=dataCadastro, email=email, telefone=telefone, endCep=endCep, endRua=endRua, endBairro=endBairro, endComplemento=endComplemento, endUF=endUF, cpf=cpf, rg=rg, sexo=sexo, dataNasc=dataNasc, funcao=funcao, salario=salario, dataContratacao=dataContratacao)   

    def editarFuncionario(self, id, nome=None, dataCadastro=None, email=None, telefone=None, endCep=None, endRua=None, endBairro=None, endComplemento=None, endUF=None, cpf=None, rg=None, sexo=None, dataNasc=None, funcao=None, salario=None, dataContratacao=None):
        funcionario = Funcionario(id=id, nome=nome, dataCadastro=dataCadastro, email=email, telefone=telefone, endCep=endCep, endRua=endRua, endBairro=endBairro, endComplemento=endComplemento, endUF=endUF, cpf=cpf, rg=rg, sexo=sexo, dataNasc=dataNasc, funcao=funcao, salario=salario, dataContratacao=dataContratacao)
        return funcionario

    def desativarFuncionario(self, id):
        # Aqui você pode implementar a lógica para desativar o funcionário com o ID fornecido
        return f"Funcionário com ID {id} desativado."
    
    def excluirFuncionario(self, id):



        #exemplo de código para alterar depois de acordo com o banco
        '''
        conexao = conectar_banco()
        try:
            cursor = conexao.cursor()

            query_funcao = "SELECT funcao FROM Funcionario WHERE id = %s"
            cursor.execute(query_funcao, (id_gerente,))
            resultado = cursor.fetchone()

            if not resultado:
                print("Funcionário não encontrado.")
                return
        
            funcao = resultado[0]

            if funcao != "Gerente":
                print("Apenas gerentes podem excluir funcionários.")
                return

            query_verificar = "SELECT id FROM Funcionario WHERE id = %s"
            cursor.execute(query_verificar, (id_funcionario,))
            if not cursor.fetchone():
                print("Funcionário não encontrado.")
                return

            query_funcionario = "DELETE FROM Funcionario WHERE id = %s"
            cursor.execute(query_funcionario, (id_funcionario,))

            query_usuario = "DELETE FROM Usuario WHERE id = %s"
            cursor.execute(query_usuario, (id_funcionario,))

            conexao.commit()
            print(f"Funcionário com ID {id_funcionario} excluído com sucesso!")
        except mysql.connector.Error as e:
            print(f"Erro ao excluir funcionário: {e}")
            conexao.rollback()
        finally:
            cursor.close()
            conexao.close()
        '''
        # Aqui você pode implementar a lógica para excluir o funcionário com o ID fornecido
        return f"Funcionário com ID {id} excluído."

class Produto:
    def __init__(self, id, nome, categoria, marca, preco, quantidadeEstoque, status):
        self.id = id
        self.nome = nome
        self.categoria = categoria
        self.marca = marca
        self.preco = preco
        self.quantidadeEstoque = quantidadeEstoque
        self.status = True

class Cupom:
    def __init__(self, id, nome, codigo, dataValidade, usosPermitidos, regrasAplicacao, status, descontoFixo, descontoPorcentagem):
        self.id = id
        self.nome = nome
        self.codigo = codigo
        self.dataValidade = dataValidade
        self.usosPermitidos = usosPermitidos
        self.regrasAplicacao = regrasAplicacao
        self.status = True
        self.descontoFixo = descontoFixo
        self.descontoPorcentagem = descontoPorcentagem

class ServicoPersonalizado:
    def __init__(self, id, nome, produtos, preco, status):
        self.id = id
        self.nome = nome
        self.produtos = produtos
        self.preco = preco
        self.status = True

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
