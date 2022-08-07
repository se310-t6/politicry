from flask import Blueprint

blueprint = Blueprint("detection", __name__)

from src.detection import routes  # noqa
