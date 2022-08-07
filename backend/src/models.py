from enum import Enum
from flask import current_app
from datetime import datetime
from uuid import uuid4
import hashlib
import string
import random

from src import db

class MediaType(Enum):
    IMAGE = 'image'
    VIDEO = 'video'

class Platform(Enum):
    REDDIT = 'reddit'
    TWITTER = 'twitter'
    IMGUR = 'imgur'
    INSTAGRAM = 'instagram'

class Users(db.Model):
    __table_name__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    username = db.Column(db.String(32), index=True, unique=True, nullable=False)
    password_hashed = db.Column(db.String(128), nullable=False)
    salt = db.Column(db.String(36), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return '<Users %r>' % self.username

    def __init__(self, password: str, username: str = None, salt: bytes = None) -> None:
        self.username = username or ''.join(random.choices(string.ascii_letters + string.digits, k=32))
        self.salt = salt or uuid4().hex
        self.password_hashed = hashlib.sha512((password + self.salt).encode('utf-8')).hexdigest()
        self.date_created = datetime.utcnow()

    def is_password_correct(self, password: str) -> bool:
        return hashlib.sha512((password + self.salt).encode('utf-8')).hexdigest() == self.password_hashed

    def set_password(self, password: str) -> None:
        self.password_hashed = hashlib.sha512((password + self.salt).encode('utf-8')).hexdigest()

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return self.username

class Posts(db.Model):
    __table_name__ = 'posts'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    url = db.Column(db.String(2000), index=True, unique=True, nullable=False)
    hash = db.Column(db.String(128), index=True, nullable=False )
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    media_type = db.Column(db.String(32), nullable=False)
    platform = db.Column(db.String(32), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    detections = db.relationship('Detections', backref='posts', lazy=True)

    def __init__(self, url: str, hash: bytes, width: int, height: int, media_type: MediaType, platform: str, date_created = None, id = None, detections = []) -> None:
        self.id = id # none == not in db yet
        self.url = url
        self.hash = hash
        self.width = width
        self.height = height
        self.media_type = media_type
        self.platform = platform
        self.date_created = date_created or datetime.now()
        self.detections = detections

    def from_json(json: dict, user_id=None) -> 'Posts':
        # validate json has all required fields, raising exception otherwise
        if 'url' not in json:
            raise Exception('Missing url')
        if 'hash' not in json:
            raise Exception('Missing hash')
        if 'width' not in json:
            raise Exception('Missing width')
        if 'height' not in json:
            raise Exception('Missing height')

        if 'media_type' not in json:
            raise Exception('Missing media_type')
        # check media type is valid
        if json['media_type'] not in ['image', 'video']:
            raise Exception('Invalid media type')

        if 'platform' not in json:
            raise Exception('Missing platform')
        # check platform is valid
        if json['platform'] not in ['reddit', 'twitter', 'imgur', 'instagram']:
            raise Exception('Invalid platform')

        # if items are present, validate them
        detections = []
        if 'detections' in json and user_id is not None:
            if not isinstance(json['detections'], list):
                raise Exception('Invalid detections')

            for word in json['detections']:
                detections.append(Detections(user_id, -1, word))

        return Posts(
            url=json['url'],
            hash=json['hash'],
            width=json['width'],
            height=json['height'],
            media_type=json['media_type'],
            platform=json['platform'],
            date_created=datetime.now(),
            detections=detections
        )

    def to_json(self) -> dict:
        return {
            'url': self.url,
            'hash': self.hash,
            'width': self.width,
            'height': self.height,
            'media_type': self.media_type,
            'date_created': self.date_created,
            'detections': [ detection.to_json() for detection in self.detections]
        }
class Detections(db.Model):
    __table_name__ = 'detections'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), index=True, nullable=False)
    word = db.Column(db.String(1000), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __init__(self, user_id: int, post_id: int, word: str, date_created = None) -> None:
        self.user_id = user_id
        self.post_id = post_id
        self.word = word
        self.date_created = date_created or datetime.now()

    def to_json(self) -> str:
        return self.word