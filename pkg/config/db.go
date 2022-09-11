package config

import (
	"database/sql"
	"fmt"
	_ "modernc.org/sqlite"
	"os"
)

const path string = "./users.sqlite3"
const schema string = "./schema.sql"

func InitDB(a *AppConfig) {
	db := a.DB

	//read the schema into a string that can be executed
	b, err := os.ReadFile(schema)
	query := string(b)
	if err != nil {
		fmt.Println(err)
	}

	// execute the schema
	_, err = db.Exec(query)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Database Initialized.")
}

func GetDB() *sql.DB {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		fmt.Println(err)
	}
	return db
}
