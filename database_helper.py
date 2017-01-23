import sqlite3
from flask import g

from server import app
DATABASE = 'database.db'


def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('database.schema', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def valid_login(email, password):
    return query_db('select * from users where email=? and password=?', [email, password])


def user_exists(email):
    return query_db('select * from users where email=?', [email])


def add_user(email, password, firstname, familyname, gender, city, country):
    query_db('insert into users(email, password, firstname, familyname, gender, city, country) ' +
             'values(?, ?, ?, ?, ?, ?, ?)',
             [email, password, firstname, familyname, gender, city, country])
    get_db().commit()


def get_user_data(email):
    return query_db('select * from users where email=?', [email])


def add_message(content, writer, receiver):
    query_db('insert into messages(content, writer, receiver) values(?, ?, ?)',
             [content, writer,receiver])
    get_db().commit()


def get_user_messages(email):
    return query_db('select * from messages where receiver=?', [email])


def change_password(email, password):
    query_db('update users set password=? where email=?', [password, email])
    get_db().commit()


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
