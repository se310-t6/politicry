import hashlib
import tempfile, urllib, pytesseract
from datetime import datetime
from PIL import Image
from models import Post, Detection
from database import Database


def insert_drections(post: Post, database: Database):
    # reject if not image
    if post.media_type != 'image':
        raise Exception('Not an image')

    # if our ID is null, we need to insert into the database
    if post.id is None:
        # check if post in database first, searching by url and hash
        post_in_database = database.get_post(url=post.url, hash=post.hash)

        if post_in_database is None:
            post.id = database.insert_post(post)
        else:
            post.id = post_in_database.id
            post.system_validated = post_in_database.system_validated

    # if the post is already system validated, we can skip this step
    if post.system_validated:
        return

    # insert all new detections to database
    database.insert_detections(post.detections)

def detect_words(post: Post, database: Database, check_database = True, generate_automatically = True):
    # reject if not image
    if post.media_type != 'image':
        raise Exception('Not an image')

    # if our ID is null, we need to insert into the database
    if post.id is None:
        # check if post in database first, searching by url and hash
        post_in_database = database.get_post(url=post.url, hash=post.hash)

        if post_in_database is None:
            post.id = database.insert_post(post)
        else:
            post.id = post_in_database.id
            post.system_validated = post_in_database.system_validated

    # if we're not checking the database, we can skip this step
    if check_database:
        detections = database.get_detections(post.id)
        post.detections = detections

        if post.detections and len(post.detections) > 0:
            return

    # if we're not generating automatically, we can skip this step
    if generate_automatically:
        # create tmp file
        with tempfile.NamedTemporaryFile(delete=True) as tmp:
            # download media item
            urllib.request.urlretrieve(post.url, tmp.name)

            image = Image.open(tmp.name)

            # set width/height
            post.width = image.width or 0
            post.height = image.height or 0

            # generate sha256 hash of image
            post.hash = hashlib.sha256(open(tmp.name, 'rb').read()).hexdigest()

            # return text
            text = pytesseract.image_to_string(image, timeout=10, lang='eng')

            # convert to lowercase
            text = text.lower()

            # map into detections
            detections = [Detection(0, post.id, word, 1.0, datetime.now()) for word in text.split(' ')] #TODO; add support for confidences

            post.system_validated = True
            post.detections = detections

            # insert detections to database
            database.insert_detections(detections)

            # update post in database
            database.upsert_post(post)