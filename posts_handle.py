import json

import mysql.connector as mysql
import requests
from flask import Flask, request
from settings import dbpwd, username

app = Flask(__name__)

db = mysql.connect(
    host="localhost",
    user=username,
    passwd=dbpwd,
    database="postdb")


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
