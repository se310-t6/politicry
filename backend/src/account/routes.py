from flask import jsonify
import random
import string

from src.account import blueprint
from src.models import Users
from src import db

# TODO
# @limiter.limit("200/minute", error_message="You're doing that too much", key_func=get_remote_address)


@blueprint.get("/api/1/register/")
def register():
    password = "".join(random.choices(string.ascii_letters + string.digits, k=32))
    user = Users(password)  # this will create a new random user
    db.session.add(user)
    db.session.commit()
    return jsonify({"username": user.username, "password": password})
