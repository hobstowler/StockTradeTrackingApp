package auth

import "github.com/gin-gonic/gin"

func Routes(g *gin.Engine) {
	auth := g.Group("/auth")

	auth.POST("/auth/login", login)
	auth.POST("/auth/logout", logout)
	auth.POST("/auth/register", register)
	auth.PUT("/auth/change_password", changePassword)
	auth.GET("/auth/get_api", getAPIKey)
}

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
