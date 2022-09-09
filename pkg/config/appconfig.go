package config

import "database/sql"

type AppConfig struct {
	db *sql.DB
}
