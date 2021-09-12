import pymongo
from flask import Flask,request, Response, jsonify, url_for
from flask_cors import CORS
import json
from bson import json_util, ObjectId
client = pymongo.MongoClient("localhost", 27017)
db = client.projetoAula


def find_ids(collection, ids):
    collection = db[collection]
    objs = collection.find()
    objs = [obj for obj in objs if obj._id in ids]
    return objs


def find_mongo(collection, query):
    collection = db[collection]
    objs = collection.find(query)
    objs = [obj for obj in objs]
    return objs

def find_one_mongo(collection, query):
    collection = db[collection]
    obj = collection.find_one(query)
    return obj

def monta_query_mongo_com_or(valores_filtro, campo):
    array_or = []
    for val in valores_filtro:
        array_or.append({campo:val})
    query = {"$or":array_or}
    return query

app = Flask(__name__)
CORS(app)

        
@app.route("/notas/getByTia",  methods=['POST'])
def get_notas_by_tia():
    """
    Retorna um json com todos os cursos 
    """
    try:
        body = json.loads(request.data)
        print(body)
        tia = body['tiaAluno']
        collection = db.notas
        print("tia",tia)
        notas = collection.find({"tiaAluno":tia})
        response_notas = []
        for nota in notas: 
            if "materiaId" in nota:
                print(nota)
                materia = find_one_mongo('materias',ObjectId(nota['materiaId']))
                nota['materia'] = materia
                response_notas.append(nota)
        return jsonify(json.dumps(response_notas, default=json_util.default))
    except Exception as ex:
        print(ex)
        return "internal server error",500

@app.route("/notas/updateById",  methods=['POST'])
def update_notas_by_id():
    """
    Retorna um json com todos os cursos 
    """
    try:
        body = json.loads(request.data)
        nota_id = body['_id']['$oid']
        del body['_id']
        del body['materia']
        collection = db.notas
        collection.update_one({"_id":ObjectId(nota_id)},{"$set":body})
        return jsonify({"message":f"Update {nota_id} Realizado"})
    except Exception as ex:
        print(ex)
        return "internal server error", 500

@app.route("/professores/materias",  methods=['POST'])
def professor_materias():
    try:
        body = json.loads(request.data)
        tia_professor = body['tiaProfessor']
        collection = db.professores
        professor = collection.find_one({"tia":tia_professor})
        materias = find_mongo('materias',{})
        materias = [mat for mat in materias if professor['_id'] in mat['professores']]
        return jsonify(json.dumps(materias,default=json_util.default))
    except Exception as ex:
        print(ex)
        return "internal server error", 500



@app.route("/professores/notasMaterias",  methods=['POST'])
def notas_materias():
    try:
        body = json.loads(request.data)
        id_materia = ObjectId(body['materiaId'])
        alunos = find_mongo('alunos',{})
        alunos = [aluno for aluno in alunos if id_materia in aluno['materias']]
        response_obj = []
        for aluno in alunos:
            obj = {}
            obj['nomeAluno'] = aluno['nomeAluno']
            nota = find_one_mongo('notas',{"tiaAluno":aluno['tiaAluno']})
            obj['nota'] = nota
            response_obj.append(obj)

        return jsonify(json.dumps(response_obj, default=json_util.default))
    except Exception as ex:
        print(ex)
        return "internal server error", 500


@app.route("/curso/create",  methods=['POST'])
def create_curso():
    """
    json de exemplo para criação do curso
    {
        nomeCurso: "Ciência da Computação",
        materias:[
            {nome:"teorias de grafos", professores:["CHARLES BOULHOSA RODAMILANS", "ISRAEL FLORENTINO DOS SANTOS", "VALERIA FARINAZZO MARTINS"]}

        ]
    }
    """
    body = json.loads(request.data)
    if not "nomeCurso" in body or not "materias" in body:
        return "Seu body não contém nomeCurso ou materias"
    else:
        collection = db.curso
        collection.insert_one(body).inserted_id
        return jsonify({"message":"Insert Realizado"})


def get_all_cursos():
    """
    Retorna um json com todos os cursos 
    """
    collection = db.curso
    cursos = collection.find()
    cursos = [curso for curso in cursos]
    return jsonify(json.dumps(cursos, default=json_util.default))

@app.route("/curso/getById",  methods=['GET'])
def get_curso_by_id():
    """
    Retorna o curso através do id 
    """
    curso_id = request.args.get('id')
    collection = db.curso
    curso = collection.find({"_id":(ObjectId(curso_id))})
    curso = [crs for crs in curso]
    return jsonify(json.dumps(curso, default=json_util.default))

@app.route("/curso/deleteById",  methods=['DELETE'])
def delete_curso_by_id():
    """
    Retorna o curso através do id 
    """
    curso_id = json.loads(request.data)['id']
    collection = db.curso
    collection.delete_one({"_id":(ObjectId(curso_id))})
    return jsonify({"message":f"Delete do id: {curso_id} Realizado"})

@app.route("/curso/updateById",  methods=['POST'])
def update_curso_id():
    """
    Retorna o curso através do id 
    """
    
    body = json.loads(request.data)
    curso_id = ObjectId(body['_id'])
    del body['_id']
    collection = db.curso
    collection.update({"_id":curso_id},body)
    return jsonify({"message":f"Update {curso_id} Realizado"})

@app.route("/usuario/create",  methods=['POST'])
def create_usuario():
    """
    json de exemplo para criação do curso
    {
        nome: "Vinicius",
        tipo: Aluno,
    }
    """
    body = json.loads(request.data)
    if not "nome" in body or not "tipo" in body:
        return "Seu body não contém nome ou tipo"
    else:
        collection = db.usuario
        collection.insert_one(body).inserted_id
        return jsonify({"message":"Insert Realizado"})

@app.route("/usuario/getAll",  methods=['GET'])
def get_all_usuarios():
    """
    Retorna um json com todos os cursos 
    """
    collection = db.usuario
    usuarios = collection.find()
    usuarios = [usr for usr in usuarios]
    return jsonify(json.dumps(usuarios, default=json_util.default))

@app.route("/usuario/getById",  methods=['GET'])
def get_usuario_by_id():
    """
    Retorna o curso através do id 
    """
    usuario_id = request.args.get('id')
    collection = db.usuario
    usuario = collection.find({"_id":(ObjectId(usuario_id))})
    usuario = [usr for usr in usuario]
    return jsonify(json.dumps(usuario, default=json_util.default))

@app.route("/usuario/deleteById",  methods=['DELETE'])
def delete_usuario_by_id():
    """
    Retorna o curso através do id 
    """
    usuario_id = json.loads(request.data)['id']
    collection = db.usuario
    collection.delete_one({"_id":(ObjectId(usuario_id))})
    return jsonify({"message":f"Delete do id: {usuario_id} Realizado"})

@app.route("/usuario/updateById",  methods=['POST'])
def update_usuario_id():
    """
    Retorna o curso através do id 
    """
    
    body = json.loads(request.data)
    usuario_id = ObjectId(body['_id'])
    del body['_id']
    collection = db.usuario
    collection.update({"_id":usuario_id},body)
    return jsonify({"message":f"Update {usuario_id} Realizado"})