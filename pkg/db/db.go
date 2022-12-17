package db

import (
	"UglyTradingApp/pkg/auth"
	"UglyTradingApp/pkg/config"
	"cloud.google.com/go/cloudsqlconn"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/stdlib"
	_ "modernc.org/sqlite"
	"net"
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
		db, err := ConnectUnixSocket()
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
func ConnectUnixSocket() (*sql.DB, error) {
	dbUser, err := auth.GetGCPSecret("db_user", -1)
	if err != nil {
		return &sql.DB{}, errors.New("Could not access db_user secret.")
	}

	dbPwd, err := auth.GetGCPSecret("postgres", -1)
	if err != nil {
		return &sql.DB{}, errors.New("Could not access db_pwd secret.")
	}

	instanceConnectionName, err := auth.GetGCPSecret("unix_socket_path", -1)
	if err != nil {
		return &sql.DB{}, errors.New("Could not access unix_socket_path secret.")
	}

	dbName, err := auth.GetGCPSecret("db_name", -1)
	if err != nil {
		return &sql.DB{}, errors.New("Could not access db_name secret.")
	}

	dsn := fmt.Sprintf("user=%s password=%s database=%s", dbUser, dbPwd, dbName)
	pgxconfig, err := pgx.ParseConfig(dsn)
	if err != nil {
		return nil, err
	}
	var opts []cloudsqlconn.Option
	d, err := cloudsqlconn.NewDialer(context.Background(), opts...)
	if err != nil {
		return nil, err
	}
	// Use the Cloud SQL connector to handle connecting to the instance.
	// This approach does *NOT* require the Cloud SQL proxy.
	pgxconfig.DialFunc = func(ctx context.Context, network, instance string) (net.Conn, error) {
		return d.Dial(ctx, instanceConnectionName)
	}
	dbURI := stdlib.RegisterConnConfig(pgxconfig)
	dbPool, err := sql.Open("pgx", dbURI)
	if err != nil {
		return nil, fmt.Errorf("sql.Open: %v", err)
	}
	return dbPool, nil
}
