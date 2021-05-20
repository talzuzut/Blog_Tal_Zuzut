import json
import uuid

import bcrypt
import mysql.connector as mysql
from flask import Flask, request, abort, make_response

from settings import dbpwd, username

app = Flask(__name__)

db = mysql.connect(
    host="localhost",
    user=username,
    passwd=dbpwd,
    database="postdb")


@app.route('/logout', methods=['POST'])
def logout():
    data = request.get_json()
    print(data)
    query = "delete from sessions where session_id = %s"
    values = (str(data['session_id']),)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return f'logout'


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    query = "select id, password from users where username = %s"
    values = (data['user'],)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    if not record:
        abort(401)
    user_id = record[0]
    hashed_pwd = record[1].encode('utf-8')
    if bcrypt.hashpw(data['pass'].encode('utf-8'), hashed_pwd) != hashed_pwd:
        abort(401)

    session_id = str(uuid.uuid4())

    query = "insert into sessions (user_id, session_id) values (%s, %s) on duplicate key update session_id=%s"
    values = (user_id, session_id, session_id)
    cursor.execute(query, values)
    db.commit()
    resp = make_response()
    resp.set_cookie("session_id", session_id)
    return resp


@app.route('/signUp', methods=['POST'])
def manage_signup():
    data = request.get_json()
    username = data['user']
    print(data)
    query = "select username from users where username=%s"
    values = (data['user'],)
    cursor = db.cursor(buffered=True)
    cursor.execute(query, values)
    db.commit()
    if cursor.rowcount:
        print('EXISTS')
        abort(401)
        return f'user exists!'
    hashed = bcrypt.hashpw(data['pass'].encode('utf-8'), bcrypt.gensalt())
    query = "insert into users (username, password) values (%s, %s)"
    values = (username, hashed)
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return f'added the user {username}'


@app.route('/posts', methods=['GET', 'POST'])
def manage_posts():
    if request.method == 'GET':
        return get_all_posts()
    else:
        return add_post()


def get_all_posts():
    query = "select id,content,publishedDays,publishedBy from posts"
    cursor = db.cursor()
    cursor.execute(query)
    records = cursor.fetchall()
    cursor.close()
    header = ['id', 'content', 'publishedDays', 'publishedBy']
    data = []
    for r in records:
        data.append(dict(zip(header, r)))
    print(json.dumps(data))
    return json.dumps(data)


def add_post():
    data = request.get_json()
    print(data)
    query = "insert into posts (content, publishedDays, publishedBy) values (%s, %s, %s)"
    values = (data['content'], data['publishedDays'], data['publishedBy'])
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return f"Added post id #{cursor.lastrowid}"


def get_post(id):
    query = 'select id,publishedDays,publishedBy from posts where id=%s'
    values = (id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    header = ['id,content,publishedDays,publishedBy']
    return json.dumps(dict(zip(header, record)))


if __name__ == "__main__":
    app.run()
