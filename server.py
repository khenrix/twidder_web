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
        # Store logged in users?
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
def sign_out():
    # How do we know which people are logged in? Global variable list?
    if helper.is_signed_in():
        helper.sign_out()
        return jsonify({"success": True, "message": "Successfully signed out."})
    else:
        return jsonify({"success": False, "message": "You are not signed in."})


@app.route('/change-password', methods='POST')
def change_password():
    # Need to check if user is logged in?

    return None


@app.route('/get-user-data-by-token/<token>', methods='GET')
def get_user_data_by_token(token):
    # Need to check if user is logged in?
    return None


@app.route('/get-user-data-by-email/<email>', methods='GET')
def get_user_data_by_email(email):
    # Need to check if user is logged in?

    return None


@app.route('/get-user-messages-by-token/<token>', methods='GET')
def get_user_messages_by_token(token):
    # Need to check if user is logged in?

    return None


@app.route('/get-user-messages-by-email/<token>/<email>', methods='GET')
def get_user_messages_by_email(token, email):
    # Need to check if user is logged in?

    return None


@app.route('/post-message', methods='POST')
def post_message():
    # Need to check if user is logged in?

    return None
