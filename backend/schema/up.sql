-- Holds information about users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    salt TEXT NOT NULL,
    date_created TEXT NOT NULL
);

-- Adding indexes to the username and fingerprint field is good, as we will need to search for users by username or fingerprint
CREATE INDEX IF NOT EXISTS username_index ON users (username);

-- Holds information about posts
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    hash BLOB NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    media_type TEXT NOT NULL,
    date_created TEXT NOT NULL,
    system_validated BOOLEAN NOT NULL
);

--- Add indexes to the hash and url field, as we will need to search for posts by hash or url
CREATE INDEX IF NOT EXISTS hash_index ON posts (hash);
CREATE INDEX IF NOT EXISTS url_index ON posts (url);

-- Holds information about automatic detections
CREATE TABLE IF NOT EXISTS detections (
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    confidence REAL NOT NULL,
    date_created TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, post_id, word)
);

CREATE INDEX IF NOT EXISTS post_id_index ON detections (post_id);

-- INSERT the default user
INSERT OR IGNORE INTO users (id, username, password, salt, date_created) VALUES (0, 'admin', 'admin', 'admin', '1970-01-01');
