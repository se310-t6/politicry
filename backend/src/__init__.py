from config import Config
from flask import Flask, request, abort, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
# from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_login import LoginManager, current_user

db = SQLAlchemy()
limiter = Limiter (
    key_func=get_remote_address, default_limits=["10000 per day", "50 per minute"]
)
migrate = Migrate()
# cors = CORS()
login_manager = LoginManager()

#TODO, setup logging
def create_app(config_class=Config):
    app = Flask(__name__, static_url_path='/static', static_folder='../static')
    app.config.from_object(Config)

    with app.app_context():
        db.init_app(app)
        migrate.init_app(app, db, compare_type=True)
        limiter.init_app(app)
        # cors.init_app(app)
        login_manager.init_app(app)

        from src.models import Users
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

            user = Users.query.filter_by(username=auth.username).first()

            if user is None:
                return None

            if not user.is_password_correct(auth.password):
                return abort(401)

            return user

    from src.detection import blueprint as blueprint_detection
    from src.account import blueprint as blueprint_accounts

    app.register_blueprint(blueprint_detection)
    app.register_blueprint(blueprint_accounts)

    @app.errorhandler(404)
    def catcher(_):
        return send_file('../static/notfound.html')

    @app.errorhandler(500)
    def catcher(e):
        app.logger.exception("ERROR: A fatal error occurred: %s", e)
        return "internal server error"

    #setup global limits and login requirements
    limiter.limit("30/minute", error_message="You're doing that too much", key_func=lambda: current_user.username)(blueprint_detection)
    limiter.limit("60/minute", error_message="You're doing that too much", key_func=get_remote_address)(blueprint_accounts)

    return app


