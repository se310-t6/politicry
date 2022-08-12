from flask import jsonify
from src.account import blueprint


@blueprint.get("/healthcheck")
def healthcheck():
    return jsonify({"status": "ok"})
