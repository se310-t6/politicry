def test_no_auth_attached_to_request(test_client):
    """
    Test that POSTing to /api/1/posts returns a 401 unauthorised if invalid credentials are supplied.
    """
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
        headers={"Authorization": "Basic INVALIDBEARERSTRING"},
    )
    assert response.status_code == 401
