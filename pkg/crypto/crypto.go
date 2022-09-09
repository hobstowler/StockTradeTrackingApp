package crypto

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func Routes(g *gin.Engine) {
	crypto := g.Group("/crypto")
	crypto.GET("/:symbol", getSymbol)
}

func getSymbol(c *gin.Context) {
	symbol := c.Param("symbol")
	c.JSON(http.StatusOK, "Not working yet. "+symbol)
}
