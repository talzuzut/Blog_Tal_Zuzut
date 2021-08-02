import json
import uuid

import bcrypt
import mysql.connector as mysql
from flask import Flask, request, abort, make_response, jsonify

from settings import dbpwd, username

app = Flask(__name__)

db = mysql.connect(
    host="localhost",
    user=username,
    passwd=dbpwd,
    database="postdb")


@app.route("/api/health")
def api_health():
    return "alive"


# Logout
@app.route('/api/logout', methods=['POST'])
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


# Login
@app.route('/api/login', methods=['POST'])
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
    temp = {'user_id': user_id}
    resp = make_response(jsonify(temp))
    resp.set_cookie("session_id", session_id)
    print(temp)
    return resp


# Signup
@app.route('/api/signUp', methods=['POST'])
def manage_signup():
    data = request.get_json()
    username_val = data['user']
    print(data)
    query = "select username from users where username=%s"
    values = (username_val,)
    cursor = db.cursor(buffered=True)
    cursor.execute(query, values)
    db.commit()
    if cursor.rowcount:
        print('EXISTS')
        abort(401)
        return f'user exists!'
    hashed = bcrypt.hashpw(data['pass'].encode('utf-8'), bcrypt.gensalt())
    query = "insert into users (username, password) values (%s, %s)"
    values = (username_val, hashed)
    cursor.execute(query, values)
    db.commit()
    return f'added User {username_val}'


def get_post(id):
    query = 'select id,content,publishedDays,publishedBy from posts where id=%s'
    values = (id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    header = ['id', 'content', 'publishedDays', 'publishedBy']
    return json.dumps(dict(zip(header, record)))


def delete_post(post_id):
    query = "delete from posts where id=%s"
    values = (post_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()


def add_post():
    data = request.get_json()
    print(data)
    username_by_id = get_username_by_id(data['userID'])
    print(username_by_id)
    query = "insert into posts (content, publishedDays, publishedBy, publisherID) values (%s, %s, %s, %s)"
    values = (data['content'], data['publishedDays'], username_by_id, data['userID'])
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return f"Added post id #{cursor.lastrowid}"


@app.route('/api/validate/<session_id>', methods=['GET'])
def get_valid_user_id(session_id):
    temp = get_id_by_session(session_id)
    if temp is None:
        abort(401)
    return {'user_id': temp}


@app.route('/api/posts/<post_id>', methods=['GET', 'DELETE', 'PUT'])
def manage_post_method(post_id):
    data = request.get_json()
    if request.method == 'GET':
        return get_post(post_id)
    session_id = data['session_id']
    real_id = get_id_by_session(session_id)
    validate_id = get_publisher_id(post_id)

    if real_id != validate_id:
        print("not the author!")
        abort(401)
    elif request.method == 'DELETE':
        return delete_wrapper(post_id)

    elif request.method == 'PUT':
        return edit_user_post(post_id, data['content'])


def delete_wrapper(post_id):
    print("reached DELETE ", post_id)
    validate_id = get_publisher_id(post_id)
    delete_post(post_id)
    return f"Deleted {post_id}"


@app.route('/api/validate/edit/<post_id>', methods=['GET'])
def owner_by_session(session_id, post_id):
    asker_id = get_valid_user_id(session_id)
    publisher_id = get_publisher_id(post_id)
    return asker_id == publisher_id


def edit_user_post(post_id, content):
    print("post id is", post_id, "content is -", content)
    query = "UPDATE posts set content = %s where id = %s"
    values = (content, post_id)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return f"Edited post id #{post_id}"


# get user posts
@app.route('/api/posts/user/<user_id>', methods=['GET'])
def manage_user_posts(user_id):
    return get_user_posts(user_id)


# get all posts,
@app.route('/api/posts', methods=['GET', 'POST'])
def manage_posts():
    if request.method == 'GET':
        return get_all_posts()
    if request.method == 'POST':
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


def get_publisher_id(post_id):
    query = 'select publisherID from posts where id=%s'
    values = (post_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    print(record)
    return record[0]


def get_id_by_session(session_id):
    query = 'select user_id from sessions where session_id=%s'
    values = (session_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    print("the id of session owner is  is ", record[0])
    return record[0]


def get_username_by_id(user_id):
    query = "select username from users where id = %s"
    values = (user_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    if not record:
        abort(401)
    return record[0]


def get_user_posts(user_id):
    print("user id ", user_id)
    query = 'select id,content,publishedDays,publishedBy from posts where publisherID=%s'
    values = (user_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    records = cursor.fetchall()
    cursor.close()
    header = ['id', 'content', 'publishedDays', 'publishedBy']
    data = []
    for r in records:
        data.append(dict(zip(header, r)))
    print(json.dumps(data))
    return json.dumps(data)


# Comments
def get_comments(post_id):
    query = 'select content,author from comments where post_id=%s'
    values = (post_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    records = cursor.fetchall()
    cursor.close()
    header = ['content', 'author']
    data = []
    for r in records:
        data.append(dict(zip(header, r)))
    print(json.dumps(data))
    return json.dumps(data)


def add_comment(post_id):
    data = request.get_json()
    print(data)
    author = get_username_by_id(data['author'])
    query = "insert into comments (content, author, post_id) values (%s, %s, %s)"
    values = (data['content'], author, post_id)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return f"Added post id #{cursor.lastrowid}"


@app.route('/api/comments/<post_id>', methods=['GET', 'POST'])
def manage_comments(post_id):
    if request.method == 'GET':
        return get_comments(post_id)
    if request.method == 'POST':
        return add_comment(post_id)


if __name__ == "__main__":
    app.run()
