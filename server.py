from flask import Flask
app = Flask(__name__)


@app.route('/sign-in', methods='POST')
def sign_in():
    return None


@app.route('/sign-up', methods='POST')
def sign_up():
    return None


@app.route('/sign-out', methods='POST')
def sign_out():
    return None


@app.route('/change-password', methods='POST')
def change_password():
    return None


@app.route('/get-user-data-by-token/<token>', methods='GET')
def get_user_data_by_token(token):
    return None


@app.route('/get-user-data-by-email/<email>', methods='GET')
def get_user_data_by_email(email):
    return None


@app.route('/get-user-messages-by-token/<token>', methods='GET')
def get_user_messages_by_token(token):
    return None


@app.route('/get-user-messages-by-email/<email>', methods='GET')
def get_user_messages_by_email(email):
    return None


@app.route('/post-message', methods='POST')
def post_message():
    return None
