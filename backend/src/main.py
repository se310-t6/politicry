import os
import json
from flask import Flask, request, send_file, abort, jsonify
from flask_login import (
    LoginManager,
    current_user,
    login_required,
)
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from detection import detect_words, insert_drections
from models import User, Post
import database as db

##### Flask #####

# loading config
secret_key = 'secret' # TODO, set to env variable
allow_severside_generation = True # TODO, set to env variable

app = Flask(__name__,
            static_url_path='/static',
            static_folder='../static')

# database
database = db.Database("database.db")
database.database_up()

# flask-login
app.secret_key = secret_key
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.request_loader
def load_user(_):
    auth = request.authorization
    if not auth:
        return None
    if auth.username is None or auth.password is None:
        return None
    # check both username and password are 32-bytes long
    if len(auth.username) != 32 or len(auth.password) != 32:
        return None

    user = database.get_user(username=auth.username)

    if user is None:
        return None

    user.validate(auth.password)
    return user

# flask-limiter
limiter = Limiter(app, key_func=get_remote_address, default_limits=["10000 per day", "50 per minute"])

##### REGISTRATION & ACCOUNT ENDPOINTS #####
@app.get('/api/1/register/')
@limiter.limit("200/minute", error_message="You're doing that too much", key_func=get_remote_address)
def register():
    user = User()  # this will create a new random user
    database.insert_user(user)
    return jsonify({'username': user.username, 'password': user.password})


##### DETECTION ENDPOINTS #####
@app.get('/api/1/detection/')
@login_required
@limiter.limit("30/minute", error_message="You're doing that too much", key_func=lambda: current_user.username)
def detection_get():
    data = {}
    try:
        data = json.loads(request.data)
    except Exception as e:
        print(e)
        return abort(400, 'Invalid JSON')
    finally:
        if data is None or data == {}:
            return abort(400, 'No JSON')

    # validate data has all required fields
    if 'unique_id' not in data:
        return abort(400, 'Missing unique_id')
    if 'platform' not in data:
        return abort(400, 'Missing platform')
    if 'items' not in data:
        return abort(400, 'Missing items')
    if not isinstance(data['items'], list):
        return abort(400, 'Items must be a list')

    posts = []
    for item in data['items']:
        try:
            item['platform'] = data['platform']
            posts.append(Post.from_json(item))
        except Exception as e:
            return abort(400, e)

    # get detections for each item
    for post in posts:
        detect_words(post, database, check_database=True, generate_automatically=allow_severside_generation)

    # return detections as json
    return jsonify({
        'unique_id': data['unique_id'],
        'platform': data['platform'],
        'items': [post.to_json() for post in posts]
    })


@app.post('/api/1/detection/')
@login_required
@limiter.limit("30/minute", error_message="You're doing that too much", key_func=lambda: current_user.username)
def detection_post():
    data = {}
    try:
        data = json.loads(request.data)
    except Exception as e:
        print(e)
        return abort(400, 'Invalid JSON')
    finally:
        if data is None or data == {}:
            return abort(400, 'No JSON')

    # validate data has all required fields
    if 'platform' not in data:
        return abort(400, 'Missing platform')
    if 'items' not in data:
        return abort(400, 'Missing items')
    if not isinstance(data['items'], list):
        return abort(400, 'Items must be a list')

    posts = []
    for item in data['items']:
        try:
            item['detections'] = item['items']
            item['platform'] = data['platform']
            posts.append(Post.from_json(item))
        except Exception as e:
            return abort(400, e)

    # insert detections to database
    for post in posts:
        insert_drections(post, database)

    # return blank 200 ok response
    return ""

##### CATCHERS #####
@app.errorhandler(404)
def catcher(_):
    return send_file('../static/notfound.html')


@app.errorhandler(500)
def catcher(e):
    app.logger.exception("ERROR: A fatal error occurred: %s", e)
    return "internal server error"

