package account

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func Routes(g *gin.Engine) {
	account := g.Group("/account")
	account.GET("/balances", getBalances)
}

func getBalances(c *gin.Context) {
	c.JSON(http.StatusOK, "$1000")
}
