package main

import (
	"UglyTradingApp/pkg/account"
	"UglyTradingApp/pkg/auth"
	"UglyTradingApp/pkg/config"
	"UglyTradingApp/pkg/crypto"
	"UglyTradingApp/pkg/db"
	"UglyTradingApp/pkg/stocks"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {

	app := config.AppConfig{
		InitDB: false,
		DB:     db.GetDB(),
	}
	if app.InitDB {
		db.InitDB(&app)
	}

	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./ui/build", true)))

	auth.InitRepo(&app)
	account.InitRepo(&app)
	stocks.InitRepo(&app)
	crypto.InitRepo(&app)

	auth.Routes(router)
	account.Routes(router)
	stocks.Routes(router)
	crypto.Routes(router)

	router.Run(":3001")
}