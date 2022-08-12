from flask import Blueprint

blueprint = Blueprint("healthcheck", __name__)

from src.healthcheck import routes  # noqa
