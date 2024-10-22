"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from flask_bcrypt import Bcrypt


app=Flask(__name__)
bcrypt=Bcrypt(app)
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/userinfo", methods=["GET"])
@jwt_required()
def user_info():
  user_id=get_jwt_identity()
  token_info=get_jwt()
  user=User.query.get(user_id)
  if user is None:
     return jsonify({"msg":"Usuario no encontrado"})
  return jsonify({"userInfo":user.serialize(), "role":token_info["role"]})

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/signup",methods=["POST"])
def user_signup():
    # Recibo los datos de la peticion
    body=request.get_json()
    # Valido que tenga los campos que necesito para crear el usuario
    if body["email"] is None:
      return jsonify({"msg":"Debe especificar un email"}),400
    if body["password"] is None:
      return jsonify({"msg":"Debe especificar una contraseña"}),400
    # Se encripta la clave que se va a guardar
    body["password"]=bcrypt.generate_password_hash(body["password"]).decode("utf-8")
    # Se guarda en la base de datos
    user=User(email=body["email"], password=body["password"], is_active=True)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg":"Usuario creado", "user":user.serialize()})

@api.route("/login",methods=["POST"])
def user_login():
    # Recibo los datos de la peticion
    body=request.get_json()
    # Valido que tenga los campos que necesito para crear el usuario
    if body["email"] is None:
      return jsonify({"msg":"Debe especificar un email"}),400
    if body["password"] is None:
      return jsonify({"msg":"Debe especificar una contraseña"}),400
    # Buscar al usuario en la base de datos y verificamos si existe
    user=User.query.filter_by(email=body["email"]).first()
    if user is None:
      return jsonify({"msg":"Usuario no encontrado"}),401
    # verificando la clave encriptada contra la clave recibida en la peticion
    valid_password=bcrypt.check_password_hash(user.password, body["password"])
    if not valid_password:
      return jsonify({"msg":"Clave inválida"}),401
    # Se crea y se retorna el token de la sesion
    token=create_access_token(identity=user.id,additional_claims={"role":"admin"})
    return jsonify({"token":token})
