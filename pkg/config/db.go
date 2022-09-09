package config

import (
	"database/sql"
	"fmt"
)

const path string = "./users"

func GetDB() *sql.DB {
	db, err := sql.Open("sqlite3", path)
	if err != nil {
		fmt.Println("Error opening database.")
	}
	return db
}
