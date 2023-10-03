DROP TABLE IF EXISTS "user", "user_alias", "state", "transaction_check_hx", "transactions", "stock_price_hx";

CREATE TABLE "user" (
    id int auto_increment,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(50) unique
);

CREATE TABLE "user_alias" (
    id int auto_increment,
    user_id int not null,
    provider varchar(30) not null,
    provider_id varchar(100) not null,
    first_name varchar(50),
    last_name varchar(50),
    email varchar(50),
    api_key varchar(50),
    unique index user_provider_idx (user_id, provider),
)

CREATE TABLE "state" (
    user_id int not null,
    state varchar(20) UNIQUE NOT NULL,
    unique index user_state_idx (user_id, state)
);

CREATE TABLE "transaction_check_hx" (
    id int auto_increment,
    user_id int not null,
    symbol varchar(10) not null,
    check_dt_tm datetime not null,
    index check_idx (user_id, symbol, check_dt_tm)
)

CREATE TABLE "transactions" (
    id int auto_increment,
    user_id int not null,
    symbol varchar(10) not null,
    transaction_dt_tm datetime not null,
    index user_stock_idx (user_id, symbol)
)

CREATE TABLE "stock_price_hx" (
    id int auto_increment,
    symbol varchar(10) not null,
    price decimal not null,
    price_dt_tm datetime not null,
    unique index price_date_idx (symbol, price_dt_tm)
)

-- CREATE UNIQUE INDEX state_idx ON state(state);
-- CREATE UNIQUE INDEX sub_idx on "user"(sub);