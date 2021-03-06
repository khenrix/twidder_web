from geventwebsocket.handler import WebSocketHandler
from gevent.pywsgi import WSGIServer
from flask import Flask, request, jsonify, json

app = Flask(__name__, static_url_path="")

import database_helper as helper
import uuid

import sys
reload(sys)
sys.setdefaultencoding('utf8')


@app.route('/')
def index():
    return app.send_static_file('client.html')


@app.route('/sign-in', methods=['POST'])
def sign_in():
    email = request.form['email']
    password = request.form['password']
    token = str(uuid.uuid4())

    if helper.valid_login(email, password):
        helper.sign_in(token, email)
        return jsonify({"success": True, "message": "Successfully signed in.", "data": token})
    else:
        return jsonify({"success": False, "message": "Wrong username or password."})


@app.route('/sign-up', methods=['POST'])
def sign_up():
    email = request.form['email_reg']
    password = request.form['password_reg']
    firstname = request.form['firstname']
    familyname = request.form['familyname']
    gender = request.form['gender']
    city = request.form['city']
    country = request.form['country']

    if helper.user_exists(email):
        return jsonify({"success": False, "message": "User already exists."})
    else:
        helper.add_user(email, password, firstname, familyname, gender, city, country)
        update_live_stats()
        return jsonify({"success": True, "message": "Successfully created a new user."})


@app.route('/sign-out/<token>', methods=['POST'])
def sign_out(token):
    if helper.is_signed_in(token):
        helper.sign_out(token)
        update_live_stats()
        return jsonify({"success": True, "message": "Successfully signed out."})
    else:
        return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/change-password/<token>', methods=['POST'])
def change_password(token):
    old_password = request.form['old_password']
    new_password = request.form['new_password']

    try:
        email = helper.token_to_email(token)
    except KeyError:
        return jsonify({"success": False, "message": "No such token."})

    if helper.is_signed_in(token):
        if helper.valid_login(email, old_password):
            helper.change_password(email, new_password)
            return jsonify({"success": True, "message": "Password changed."})
        else:
            return jsonify({"success": False, "message": "Wrong password."})
    else:
        return jsonify({"success": False, "message": "You are not logged in."})


@app.route('/get-user-data-by-token/<token>', methods=['GET'])
def get_user_data_by_token(token):
    try:
        email = helper.token_to_email(token)
        return get_user_data_by_email(token, email)
    except KeyError:
        return jsonify({"success": False, "message": "No such token."})


@app.route('/get-user-data-by-email/<token>/<email>', methods=['GET'])
def get_user_data_by_email(token, email):
    if helper.is_signed_in(token):
        if helper.user_exists(email):
            match = helper.get_user_data(email)
            return jsonify({"success": True, "message": "User data retrieved.", "data": match})
        else:
            return jsonify({"success": False, "message": "No such user."})
    else:
        return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/get-user-messages-by-token/<token>', methods=['GET'])
def get_user_messages_by_token(token):
    try:
        email = helper.token_to_email(token)
        return get_user_messages_by_email(token, email)
    except KeyError:
        return jsonify({"success": False, "message": "No such token."})


@app.route('/get-user-messages-by-email/<token>/<email>', methods=['GET'])
def get_user_messages_by_email(token, email):
    if helper.is_signed_in(token):
        if helper.user_exists(email):
            match = helper.get_user_messages(email)
            return jsonify({"success": True, "message": "User messages retrieved.", "data": match})
        else:
            return jsonify({"success": False, "message": "No such user."})
    else:
        return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/post-message/<token>', methods=['POST'])
def post_message(token):
    message = request.form['content']
    receiver = request.form['email']

    try:
        writer = helper.token_to_email(token)
    except KeyError:
        return jsonify({"success": False, "message": "No such token."})

    if helper.is_signed_in(token):
        if helper.user_exists(receiver):
            helper.add_message(message, writer, receiver)
            update_live_stats()
            return jsonify({"success": True, "message": "Message posted"})
        else:
            return jsonify({"success": False, "message": "No such user."})
    else:
        return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/socket')
def socket():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']
        while True:
            client_response = json.loads(ws.receive())
            if client_response["action"] == 'sign_in':
                if helper.is_signed_in(client_response["token"]):
                    email = helper.token_to_email(client_response["token"])
                    if helper.is_active(email):
                        current_ws = helper.email_to_socket(email)
                        server_response = json.dumps({"success": True, "message": "sign_out"})
                        current_ws.send(server_response)
                    helper.add_session(email, ws)
                    update_live_stats()


def update_live_stats():
    for email in helper.sessions:
        live_data = {
            'success': True,
            'message': 'stats',
            'gender_ratio': helper.get_gender_ratio(),
            'message_ratio': helper.get_message_ratio(email),
            'session_ratio': helper.get_session_ratio(),
        }
        ws = helper.email_to_socket(email)
        ws.send(json.dumps(live_data))
    

def run_server():
    app.debug = True
    http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()

if __name__ == "__main__":
    run_server()