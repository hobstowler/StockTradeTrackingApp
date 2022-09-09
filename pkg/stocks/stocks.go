package stocks

import "github.com/gin-gonic/gin"

func Routes(g *gin.Engine) {
	stocks := g.Group("/stocks")

	stocks.GET("/:symbol", func(c *gin.Context) {
		symbol := c.Param("symbol")
		c.JSON(200, "This doesn't work yet. "+symbol)
	})
}
