DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username varchar(25) UNIQUE NOT NULL,
  password varchar(25) NOT NULL,
  email varchar(50),
  api_key varchar(50)
);

INSERT INTO user (username, password, email, api_key) values ("hobs", "1", "hobstowler@gmail.com", "WKARA9UYSUE8NO3FQMXCSGE5HSNG5RML");