#
# IMPORTAÇÕES
#
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime

#
# CONFIGURAÇÕES
#

app = Flask(__name__)

# Configuração para usar SQLite (arquivo local)
caminho = os.path.dirname(os.path.abspath(__file__))
arquivobd = os.path.join(caminho, 'bd_belladonna.db')
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///" + arquivobd
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

#
# TABELA: clientes (exemplo)
#
class Cliente(db.Model):
    __tablename__ = 'clientes'

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(10), nullable=False)  # ENUM adaptado para string
    estado = db.Column(db.Boolean, default=True, nullable=False)
    cidade = db.Column(db.String(50))
    nome = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14))
    cnpj = db.Column(db.String(18))
    rg = db.Column(db.String(20))
    email = db.Column(db.String(100), nullable=False)
    senha = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    data_nascimento = db.Column(db.Date)
    cep = db.Column(db.String(10))
    logradouro = db.Column(db.String(100))
    numero = db.Column(db.String(10))
    bairro = db.Column(db.String(50))
    complemento = db.Column(db.String(50))
    uf = db.Column(db.String(2))

    def json(self):
        return {
            "id": self.id,
            "tipo": self.tipo,
            "estado": self.estado,
            "cidade": self.cidade,
            "nome": self.nome,
            "cpf": self.cpf,
            "cnpj": self.cnpj,
            "rg": self.rg,
            "email": self.email,
            "senha": self.senha,
            "telefone": self.telefone,
            "data_nascimento": str(self.data_nascimento) if self.data_nascimento else None,
            "cep": self.cep,
            "logradouro": self.logradouro,
            "numero": self.numero,
            "bairro": self.bairro,
            "complemento": self.complemento,
            "uf": self.uf
        }

#
# ROTAS
#

@app.route("/")
def home():
    return "API Belladonna operante com SQLite!"


@app.route("/incluir_cliente", methods=['POST'])
def incluir_cliente():
    dados = request.get_json(force=True)

    try:
        campos_validos = [
            "tipo", "estado", "nome", "cpf", "cnpj", "rg", "email", "senha",
            "telefone", "cep", "logradouro", "numero",
            "bairro", "complemento", "uf", "cidade", "data_nascimento"
        ]

        dados_filtrados = {k: dados.get(k) for k in campos_validos}

        # Converte string para datetime.date
        data_nascimento = dados.get("data_nascimento")
        if data_nascimento:
            data_convertida = datetime.strptime(data_nascimento, "%Y-%m-%d").date()
            dados_filtrados["data_nascimento"] = data_convertida
        else:
            dados_filtrados["data_nascimento"] = None

        novo = Cliente(**dados_filtrados)
        db.session.add(novo)
        db.session.commit()

        return jsonify({"resultado": "ok", "detalhes": "Cliente incluído com sucesso"})

    except Exception as e:
        return jsonify({"resultado": "erro", "detalhes": str(e)}), 500

@app.route("/deletar_cliente/<int:id>", methods=['DELETE'])
def deletar_cliente(id):
    try:
        cliente = Cliente.query.get_or_404(id)
        db.session.delete(cliente)
        db.session.commit()
        return jsonify({"resultado": "ok", "detalhes": "Cliente excluído com sucesso"})
    except Exception as e:
        return jsonify({"resultado": "erro", "detalhes": str(e)}), 500


@app.route("/listar_clientes")
def listar_clientes():
    try:
        lista = db.session.query(Cliente).all()
        retorno = [c.json() for c in lista]
        return jsonify({"resultado": "ok", "detalhes": retorno})
    except Exception as e:
        return jsonify({"resultado": "erro", "detalhes": str(e)})
    
@app.route("/editar_cliente/<int:id>", methods=['PUT'])
def editar_cliente(id):
    dados = request.get_json(force=True)
    try:
        cliente = Cliente.query.get_or_404(id)

        campos_editaveis = [
            "tipo", "estado", "nome", "cpf", "cnpj", "rg", "email", "senha",
            "telefone", "cep", "logradouro", "numero", "bairro", "complemento",
            "uf", "cidade", "data_nascimento"
        ]

        for campo in campos_editaveis:
            if campo in dados:
                valor = dados[campo]
                # Se for data_nascimento, converte para date
                if campo == "data_nascimento" and valor:
                    valor = datetime.strptime(valor, "%Y-%m-%d").date()
                setattr(cliente, campo, valor)

        db.session.commit()
        return jsonify({"resultado": "ok", "detalhes": "Cliente atualizado com sucesso"})
    except Exception as e:
        return jsonify({"resultado": "erro", "detalhes": str(e)}), 500


#
# INÍCIO DA APLICAÇÃO
#

with app.app_context():
    db.create_all()
    CORS(app)

if __name__ == "__main__":
    app.run(debug=True)

