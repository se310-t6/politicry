from src import db
from src.models import Detections, Posts


def test_getting_post_data(test_client, bearer):
    """
    Test for POST /api/1/posts endpoint, which queries for information about a POST
    This will ensure that the database will correctly insert a post when asked about it, and return valid data
    """
    # remove all detections and posts from database
    db.session.query(Detections).delete()
    db.session.query(Posts).delete()
    db.session.commit()

    # conduct test
    response = test_client.post(
        "/api/1/posts/",
        json={
            "platform": "reddit",
            "items": [
                {
                    "url": "http://jeroen.github.io/images/testocr.png",
                    "hash": "313433093",
                    "width": 400,
                    "height": 300,
                    "media_type": "image",
                }
            ],
        },
        headers={"Authorization": bearer},
    )
    assert response.status_code == 200
    assert response.json["platform"] == "reddit"
    assert (
        response.json["items"][0]["url"] == "http://jeroen.github.io/images/testocr.png"
    )
    assert response.json["items"][0]["hash"] == "313433093"
    assert response.json["items"][0]["width"] == 400
    assert response.json["items"][0]["height"] == 300
    assert response.json["items"][0]["media_type"] == "image"
    assert response.json["items"][0]["detections"] == []


def test_getting_post_data_with_detections(test_client, bearer):
    """
    Test for POST /api/1/detections endpoint, which queries for detections added to a POST
    """
    # remove all detections and posts from database
    db.session.query(Detections).delete()
    db.session.query(Posts).delete()
    db.session.commit()

    # conduct test
    response = test_client.post(
        "/api/1/detections/",
        json={
            "platform": "reddit",
            "items": [
                {
                    "url": "http://jeroen.github.io/images/testocrde.png",
                    "hash": "313433096",
                    "width": 400,
                    "height": 300,
                    "media_type": "image",
                    "detections": ["hello", "world", "other"],
                }
            ],
        },
        headers={"Authorization": bearer},
    )
    assert response.status_code == 200
    assert response.text == "OK"

    response = test_client.post(
        "/api/1/posts/",
        json={
            "platform": "reddit",
            "items": [
                {
                    "url": "http://jeroen.github.io/images/testocrde.png",
                    "hash": "313433096",
                    "width": 400,
                    "height": 300,
                    "media_type": "image",
                }
            ],
        },
        headers={"Authorization": bearer},
    )
    assert response.json["platform"] == "reddit"

    url = response.json["items"][0]["url"]
    expected_url = "http://jeroen.github.io/images/testocrde.png"
    assert url == expected_url
    assert response.json["items"][0]["hash"] == "313433096"
    assert response.json["items"][0]["width"] == 400
    assert response.json["items"][0]["height"] == 300
    assert response.json["items"][0]["media_type"] == "image"
    assert response.json["items"][0]["detections"] == ["hello", "world", "other"]
