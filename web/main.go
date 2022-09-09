package main

import (
	"UglyTradingApp/pkg/account"
	"UglyTradingApp/pkg/auth"
	"UglyTradingApp/pkg/crypto"
	"UglyTradingApp/pkg/stocks"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./ui/build", true)))

	stocks.Routes(router)
	crypto.Routes(router)
	auth.Routes(router)
	account.Routes(router)

	router.Run(":3001")
}
