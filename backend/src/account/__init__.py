from flask import Blueprint

blueprint = Blueprint("account", __name__)

from src.account import routes  # noqa
