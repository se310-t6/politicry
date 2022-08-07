import hashlib
import sqlite3
import datetime
from typing import List
import models as types


class Database:

    ##### DATABASE METHODS #####

    def __init__(self, database_url: str = None) -> None:
        database_url = database_url or './database.db'
        self.database_url = database_url
        self.database_up()


    def database_up(self) -> None:
        with sqlite3.connect(self.database_url) as connection:
            with open('schema/up.sql', 'r') as f:
                connection.executescript(f.read())


    def database_down(self) -> None:
        with sqlite3.connect(self.database_url) as connection:
            with open('schema/down.sql', 'r') as f:
                connection.executescript(f.read())


    def reset_database(self) -> None:
        self.database_down()
        self.database_up()

    ##### USER METHODS #####

    def insert_user(self, user: types.User) -> int:
        hashed_password = hashlib.sha512((user.password + user.salt).encode('utf-8')).hexdigest()
        with sqlite3.connect(self.database_url) as connection:
            cursor = connection.execute(
                'INSERT INTO users (username, password, salt, date_created) VALUES (?, ?, ?, ?)',
                (user.username, hashed_password, user.salt, datetime.datetime.now())
            )
            return cursor.lastrowid


    def get_user(self, user_id: int = None, username: str = None) -> types.User:
        """
        Attempt to get a user, first trying by id and then by username. If all fail, return None
        """
        result = None
        if user_id:
            with sqlite3.connect(self.database_url) as connection:
                cursor = connection.execute(
                    'SELECT * FROM users WHERE id = ?',
                    (user_id,)
                )
                result = cursor.fetchone()
        elif username:
            with sqlite3.connect(self.database_url) as connection:
                cursor = connection.execute(
                    'SELECT * FROM users WHERE username = ?',
                    (username,)
                )
                result = cursor.fetchone()
        else:
            return None

        if result:
            return types.User(
                result[0],
                result[1],
                result[2],
                result[3]
            )
        else:
            return None

    ##### POST METHODS #####

    def insert_post(self, post: types.Post) -> int:
        with sqlite3.connect(self.database_url) as connection:
            cursor = connection.execute(
                'INSERT OR IGNORE INTO posts (url, hash, width, height, media_type, platform, date_created) VALUES (?, ?, ?, ?, ?, ?, ?)',
                (post.url, post.hash, post.width, post.height, post.media_type, post.platform, datetime.datetime.now())
            )
            return cursor.lastrowid


    def upsert_post(self, post: types.Post) -> int:
        with sqlite3.connect(self.database_url) as connection:
            cursor = connection.execute(
                'INSERT OR REPLACE INTO posts (id, url, hash, width, height, media_type, platform, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                (post.id, post.url, post.hash, post.width, post.height, post.media_type, post.platform, datetime.datetime.now())
            )
            return cursor.lastrowid

    def get_post(self, post_id: int = None, url: str = None, hash: bytes = None) -> types.Post:
        """
        Attempt to get a post, first trying by id, url, and then hash. If all fail, return None
        """
        result = None
        if post_id:
            with sqlite3.connect(self.database_url) as connection:
                cursor = connection.execute(
                    'SELECT * FROM posts WHERE id = ?',
                    (post_id,)
                )
                result =  cursor.fetchone()
        elif url:
            with sqlite3.connect(self.database_url) as connection:
                cursor = connection.execute(
                    'SELECT * FROM posts WHERE url = ?',
                    (url,)
                )
                result = cursor.fetchone()
        elif hash:
            with sqlite3.connect(self.database_url) as connection:
                cursor = connection.execute(
                    'SELECT * FROM posts WHERE hash = ?',
                    (hash,)
                )
                result = cursor.fetchone()
        else:
            return None

        if result:
            return types.Post(
                result[0],
                result[1],
                result[2],
                result[3],
                result[4],
                result[5],
                result[6]
            )
        else:
            return None

    ##### DETECTION METHODS #####

    def insert_detection(self, detection: types.Detection) -> int:
        with sqlite3.connect(self.database_url) as connection:
            cursor = connection.execute(
                'INSERT INTO detections (user_id, post_id, word, confidence, date_created) VALUES (?, ?, ?, ?, ?)',
                (detection.user_id, detection.post_id, detection.word, detection.confidence, datetime.datetime.now())
            )
            return cursor.lastrowid


    def insert_detections(self, detections: List[types.Detection]) -> List[int]:

        # convert detections to a list of tuples
        tuples = []
        for detection in detections:
            tuples.append((detection.user_id, detection.post_id, detection.word, detection.confidence, detection.date_created))

        with sqlite3.connect(self.database_url) as connection:
            cursor = connection.executemany(
                'INSERT OR IGNORE INTO detections (user_id, post_id, word, confidence, date_created) VALUES (?, ?, ?, ?, ?)',
                tuples
            )
            return cursor.lastrowid


    def get_detections(self, user_id: int = None, post_id: int = None) -> List[types.Detection]:
        """
        Attempt to get detections, first trying by user_id and post_id, then by post_id.
        """
        result = None
        if user_id and post_id:
            with sqlite3.connect(self.database_url) as connection:
                cursor = connection.execute(
                    'SELECT * FROM detections WHERE user_id = ? AND post_id = ?',
                    (user_id, post_id)
                )
                result = cursor.fetchall()
        elif post_id:
            with sqlite3.connect(self.database_url) as connection:
                cursor = connection.execute(
                    'SELECT * FROM detections WHERE post_id = ?',
                    (post_id,)
                )
                result = cursor.fetchall()
        else:
            return None

        if result:
            return [types.Detection(
                result[0],
                result[1],
                result[2],
                result[3],
                result[4]
            ) for result in result]
        else:
            return None