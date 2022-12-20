DROP TABLE IF EXISTS "user", state;

CREATE TABLE "user" (
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  sub varchar(100) UNIQUE NOT NULL,
  email varchar(50),
  api_key varchar(50)
);

CREATE TABLE state (
    state varchar(20) UNIQUE NOT NULL
);

CREATE UNIQUE INDEX state_idx ON state(state);
CREATE UNIQUE INDEX sub_idx on "user"(sub);