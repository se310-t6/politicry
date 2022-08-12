import os

base_dir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    """
    load config for the politicry backend
    """

    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///" + os.path.join(base_dir, "database.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # set port and host for the app
    PORT = os.environ.get("PORT") or 8000
    HOST = os.environ.get("HOST") or "localhost"
