package main

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func login(c *gin.Context) {
	c.JSON(200, "You are logging in")
}

func logout(c *gin.Context) {
	c.JSON(200, "You are logging out")
}

func register(c *gin.Context) {
	c.JSON(200, "You are registering")
}

func changePassword(c *gin.Context) {
	c.JSON(200, "You are changing your password")
}

func getAPIKey(c *gin.Context) {
	c.JSON(200, "Fetching API Key.")
}

func getMarketOpen(c *gin.Context) {
	c.JSON(20, "This doesn't work yet.")
}

func getSymbol(c *gin.Context) {
	params := c.Param("symbol")
	c.JSON(200, "Don't see anything for "+params+"...")
}

func getAccountBalances(c *gin.Context) {
	c.JSON(200, "Here you go!")
}

func main() {
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./ui/build", true)))

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "sure",
		})
	})

	router.POST("/auth/login", login)
	router.POST("/auth/logout", logout)
	router.POST("/auth/register", register)
	router.PUT("/auth/change_password", changePassword)
	router.GET("/auth/get_api", getAPIKey)

	router.GET("/market_time", getMarketOpen)

	router.GET("/account/balances", getAccountBalances)

	router.GET("/stocks/ticker/:symbol", getSymbol)

	router.Run(":3001")
}
