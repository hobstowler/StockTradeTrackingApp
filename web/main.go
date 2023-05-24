package main

import (
	"UglyTradingApp/pkg/account"
	"UglyTradingApp/pkg/auth"
	"UglyTradingApp/pkg/config"
	"UglyTradingApp/pkg/crypto"
	"UglyTradingApp/pkg/db"
	"UglyTradingApp/pkg/stocks"
	"fmt"
	"github.com/Finnhub-Stock-API/finnhub-go/v2"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"os"
)

func main() {
	oAuth, err := auth.GetGCPSecret("oauth", -1)
	if err != nil {
		fmt.Println("Could not access OAuth secret.")
		return
	}

	finnhubAPI, err := auth.GetGCPSecret("finnhub", -1)
	if err != nil {
		fmt.Println("Could not access Finnhub secret.")
		return
	}

	database, err := db.GetDB()
	if err != nil {
		fmt.Println("Could not access database: %s", err)
		return
	} else {
		if os.Getenv("LOCAL") == "1" {
			fmt.Println("Local Database retrieved")
		} else {
			fmt.Println("Database retrieved.")
		}
	}

	cfg := finnhub.NewConfiguration()
	cfg.AddDefaultHeader("X-Finnhub-Token", finnhubAPI)
	finnhubClient := finnhub.NewAPIClient(cfg).DefaultApi

	app := config.AppConfig{
		InitDB:        false,
		DB:            database,
		ClientId:      "469502423353-5oh1cq1u04rqmc2e6p5vbkptebsuauf9.apps.googleusercontent.com",
		OAuth:         oAuth,
		FinnhubClient: finnhubClient,
		FinnhubAPI:    finnhubAPI,
		TdApi:         "WKARA9UYSUE8NO3FQMXCSGE5HSNG5RML",
	}
	if app.InitDB {
		db.InitDB(&app)
	}

	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./ui/build", true)))

	router.GET("/loggedOut", loggedOut)

	auth.InitRepo(&app)
	account.InitRepo(&app)
	stocks.InitRepo(&app)
	crypto.InitRepo(&app)

	auth.Routes(router)
	account.Routes(router)
	stocks.Routes(router)
	crypto.Routes(router)

	err = router.RunTLS(":3001", "./web/server.crt", "./web/server.key")
	if err != nil {
		fmt.Println(err.Error())
	}
}

func loggedOut(c *gin.Context) {
	c.JSON(200, "You are now logged out")
}
