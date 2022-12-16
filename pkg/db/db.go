package db

import (
	"UglyTradingApp/pkg/auth"
	"UglyTradingApp/pkg/config"
	"database/sql"
	"errors"
	"fmt"
	_ "modernc.org/sqlite"
	"os"
)

const path string = "./pkg/db/users.sqlite3"
const schema string = "./schema.sql"

func InitDB(a *config.AppConfig) {
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

func GetDB(path string, local bool) *sql.DB {
	if !local {
		db, err := connectUnixSocket()
		if err != nil {
			fmt.Println(err)
		}
		return db
	} else {
		db, err := sql.Open("sqlite", path)
		if err != nil {
			fmt.Println(err)
		}
		return db
	}
}

// connectUnixSocket initializes a Unix socket connection pool for
// a Cloud SQL instance of Postgres.
func connectUnixSocket() (*sql.DB, error) {
	dbUser, err := auth.GetGCPSecret("db_user", -1)
	if err != nil {
		return &sql.DB{}, errors.New("Could not access db_user secret.")
	}

	dbPwd, err := auth.GetGCPSecret("db_pwd", -1)
	if err != nil {
		return &sql.DB{}, errors.New("Could not access db_pwd secret.")
	}

	unixSocketPath, err := auth.GetGCPSecret("unix_socket_path", -1)
	if err != nil {
		return &sql.DB{}, errors.New("Could not access unix_socket_path secret.")
	}

	dbName, err := auth.GetGCPSecret("db_name", -1)
	if err != nil {
		return &sql.DB{}, errors.New("Could not access db_name secret.")
	}

	dbURI := fmt.Sprintf("user=%s password=%s database=%s host=%s",
		dbUser, dbPwd, dbName, "/cloudsql/"+unixSocketPath)

	// dbPool is the pool of database connections.
	dbPool, err := sql.Open("pgx", dbURI)
	if err != nil {
		return nil, fmt.Errorf("sql.Open: %v", err)
	}

	return dbPool, nil
}
