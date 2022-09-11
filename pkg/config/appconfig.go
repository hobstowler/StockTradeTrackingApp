package config

import "database/sql"

type AppConfig struct {
	InitDB bool
	DB     *sql.DB
}
