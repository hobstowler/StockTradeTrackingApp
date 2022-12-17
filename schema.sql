DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  first_name varchar(50) UNIQUE NOT NULL,
  last_name varchar(50) NOT NULL,
  sub varchar(100) NOT NULL,
  email varchar(50),
  api_key varchar(50)
);

CREATE TABLE state (
    state varchar(20) UNIQUE NOT NULL
);

CREATE UNIQUE INDEX state_idx ON state(state);