package config

import (
	"database/sql"
	"github.com/Finnhub-Stock-API/finnhub-go/v2"
)

type AppConfig struct {
	InitDB        bool
	DB            *sql.DB
	ClientId      string
	OAuth         string
	FinnhubClient *finnhub.DefaultApiService
	FinnhubAPI    string
}
