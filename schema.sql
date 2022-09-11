DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username varchar(25) UNIQUE NOT NULL,
  password varchar(25) NOT NULL,
  email varchar(50),
  api_key varchar(50)
);