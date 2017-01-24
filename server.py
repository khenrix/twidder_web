import database_helper as helper
import uuid

from flask import Flask, request, jsonify
app = Flask(__name__)


@app.route('/sign-in', methods='POST')
def sign_in():
    email = request.form['email']
    password = request.form['password']
    token = str(uuid.uuid4())

    if helper.valid_login(email, password):
        helper.sign_in(token, email)
        return jsonify({"success": True, "message": "Successfully signed in.", "data": token})
    else:
        return jsonify({"success": False, "message": "Wrong username or password."})


@app.route('/sign-up', methods='POST')
def sign_up():
    email = request.form['email']
    password = request.form['password']
    firstname = request.form['firstname']
    familyname = request.form['familyname']
    gender = request.form['gender']
    city = request.form['city']
    country = request.form['country']

    if helper.user_exists(email):
        return jsonify({"success": False, "message": "User already exists."})
    else:
        helper.add_user(email, password, firstname, familyname, gender, city, country)
        return jsonify({"success": True, "message": "Successfully created a new user."})


@app.route('/sign-out', methods='POST')
def sign_out(token):
    # How do we know which people are logged in? Global variable list?
    if helper.is_signed_in(token):
        helper.sign_out(token)
        return jsonify({"success": True, "message": "Successfully signed out."})
    else:
        return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/change-password', methods='POST')
def change_password(token):
    old_password = request.form['old_password']
    new_password = request.form['new_password']
    email = helper.token_to_email(token)
    # TODO: Link token to email? validation through SQL or Dictionary

    if helper.is_signed_in(token):
        if helper.valid_login(email, old_password):
            helper.change_password(email, new_password)
            return jsonify({"success": True, "message": "Password changed."})
        else:
            return jsonify({"success": False, "message": "Wrong password."})
    else:
        return jsonify({"success": False, "message": "You are not logged in."})


@app.route('/get-user-data-by-token/<token>', methods='GET')
def get_user_data_by_token(token):
    email = helper.token_to_email(token)
    get_user_data_by_email(email)


@app.route('/get-user-data-by-email/<token>/<email>', methods='GET')
def get_user_data_by_email(token, email):
    if helper.is_signed_in(token):
        if helper.user_exists(email):
            match = helper.get_user_data(email)
            return jsonify({"success": True, "message": "User data retrieved.", "data": match})
        else:
            return jsonify({"success": False, "message": "No such user."})
    else:
        return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/get-user-messages-by-token/<token>', methods='GET')
def get_user_messages_by_token(token):
    email = helper.token_to_email(token)
    get_user_messages_by_email(email)


@app.route('/get-user-messages-by-email/<token>/<email>', methods='GET')
def get_user_messages_by_email(token, email):
    if helper.is_signed_in(token):
        if helper.user_exists(email):
            match = helper.get_user_messages(email)
            return jsonify({"success": True, "message": "User messages retrieved.", "data": match})
        else:
            return jsonify({"success": False, "message": "No such user."})
    else:
        return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/post-message/<token>', methods='POST')
def post_message(token):
    writer = helper.token_to_email(token)
    message = request.form['content']
    receiver = request.form['email']

    if helper.is_signed_in(token):
        if helper.user_exists(receiver):
            helper.add_message(message, writer, receiver)
            return jsonify({"success": True, "message": "Message posted"})
        else:
            return jsonify({"success": False, "message": "No such user."})
    else:
        return jsonify({"success": False, "message": "You are not signed in."})
