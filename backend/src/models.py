import datetime
import random
import string
import uuid
import hashlib
from enum import Enum

class MediaType(Enum):
    IMAGE = 'image'
    VIDEO = 'video'

class User:
    def __init__(self, username: str = None, password: str = None, salt: str = None, date_created = None, id = None, validated = False) -> None:
        self.id = id
        self.username = username or ''.join(random.choices(string.ascii_letters + string.digits, k=32))
        self.password = password or ''.join(random.choices(string.ascii_letters + string.digits, k=32))
        self.salt = salt or uuid.uuid4().hex
        self.date_created = date_created or datetime.datetime.now()
        self.validated = validated

    def validate(self, password: str) -> None:
        hashed_password = hashlib.sha512((password + self.salt).encode('utf-8')).hexdigest()
        self.validated = hashed_password == self.password

    def is_authenticated(self) -> bool:
        return self.validated

    def is_active(self) -> bool:
        return True

    def is_anonymous(self) -> bool:
        return False

    def get_id(self) -> str:
        return self.id


class Detection:
    def __init__(self, user_id: int, post_id: int, word: str, confidence: float, date_created = None) -> None:
        self.user_id = user_id
        self.post_id = post_id
        self.word = word
        self.confidence = confidence
        self.date_created = date_created or datetime.datetime.now()

    def from_json(json: dict) -> 'Detection':
        #validate
        if 'word' not in json:
            raise ValueError('word is missing')
        if 'confidence' not in json:
            raise ValueError('confidence is missing')

        return Detection(
            user_id=None,
            post_id=None,
            word=json['word'],
            confidence=json['confidence'],
        )

    def to_json(self) -> dict:
        return {
            'word': self.word,
            'confidence': self.confidence,
        }

class Post:
    def __init__(self, url: str, hash: bytes, width: int, height: int, media_type: MediaType, platform: str, date_created = None, id = None, system_validated = False, detections = None) -> None:
        self.id = id # none == not in db yet
        self.url = url
        self.hash = hash
        self.width = width
        self.height = height
        self.media_type = media_type
        self.platform = platform
        self.date_created = date_created or datetime.datetime.now()
        self.system_validated = system_validated
        self.detections = detections

    def from_json(json: dict) -> 'Post':
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
        if 'platform' not in json:
            raise Exception('Missing platform')

        # check media type is valid
        if json['media_type'] not in ['image', 'video']:
            raise Exception('Invalid media type')

        # if items are present, validate them
        detections = []
        if 'detections' in json:
            for detection in json['detections']:
                detections.append(Detection.from_json(detection))

        if len(detections) == 0:
            detections = None

        return Post(json['url'], json['hash'], json['width'], json['height'], json['media_type'], json['platform'], detections=detections)

    def to_json(self) -> dict:
        return {
            'id': self.id,
            'url': self.url,
            'hash': self.hash,
            'width': self.width,
            'height': self.height,
            'media_type': self.media_type,
            'date_created': self.date_created,
            'detections': [ detection.to_json() for detection in self.detections]
        }