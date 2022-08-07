import json
from flask import request, abort, jsonify
from flask_login import login_required, current_user
from src.detection import blueprint
from src.models import Detections, Posts
from src import db

@blueprint.post('/api/1/posts/')
@login_required
def detection_get():
    data = {}
    try:
        data = json.loads(request.data)
    except Exception as e:
        print(e)
        return abort(400, 'Invalid JSON')
    finally:
        if data is None or data == {}:
            return abort(400, 'No JSON found')

    # validate data has all required fields
    if 'platform' not in data:
        return abort(400, 'Missing platform')
    if 'items' not in data:
        return abort(400, 'Missing items')
    if not isinstance(data['items'], list):
        return abort(400, 'Items must be a list')

    posts = []
    for item in data['items']:
        try:
            item['platform'] = data['platform']
            posts.append(Posts.from_json(item))
        except Exception as e:
            return abort(400, e)

    # check if any posts are already in database
    committed_posts = []
    for post in posts:
        existing_post = db.session.query(Posts).filter_by(url=post.url).first()
        if existing_post is None:
            db.session.add(post)
            committed_posts.append(post)
        else:
            committed_posts.append(existing_post)
    db.session.commit()

    # TODO: add some trolling prevention=
    # we want to do something like, only words that have been detected by at least 50% of the user accounts who have seen the post
    # this will filter out bad actors who are submitting garbage data

    # we can also use this to remove bad accounts
    # accounts that appear to be ""controversial"" with an odd number of differing answers (e.g. more than 20% differing)
    # we should flag for a system review, to decide the answer.
    # once that system review has been conducted, we can remove all other user data on the post

    # return detections as json
    return jsonify({
        'platform': data['platform'],
        'items': [post.to_json() for post in committed_posts]
    })

@blueprint.post('/api/1/detections/')
@login_required
def detection_post():
    data = {}
    try:
        data = json.loads(request.data)
    except Exception as e:
        print(e)
        return abort(400, 'Invalid JSON')
    finally:
        if data is None or data == {}:
            return abort(400, 'No JSON found')

    # validate data has all required fields
    if 'platform' not in data:
        return abort(400, 'Missing platform')
    if 'items' not in data:
        return abort(400, 'Missing items')
    if not isinstance(data['items'], list):
        return abort(400, 'Items must be a list')

    posts = []
    for item in data['items']:
        try:
            item['platform'] = data['platform']
            posts.append(Posts.from_json(item, user_id=current_user.id))
        except Exception as e:
            return abort(400, e)

    # insert any posts not already in the database
    for post in posts:
        detections = post.detections.copy()

        existing_post = db.session.query(Posts).filter_by(url=post.url).first()
        if existing_post is None:
            db.session.add(post)
            db.session.flush()
            db.session.refresh(post)
            existing_post = post

        for detection in detections:
            existing_detection = db.session.query(Detections).filter_by(user_id=detection.user_id, post_id=existing_post.id, word=detection.word).first()
            if existing_detection is None:
                new_detection = Detections(user_id=current_user.id, post_id=existing_post.id, word=detection.word)
                db.session.add(new_detection)

    db.session.commit()

    return "OK"
