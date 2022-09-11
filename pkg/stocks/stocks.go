package stocks

import (
	"UglyTradingApp/pkg/config"
	"github.com/gin-gonic/gin"
)

var Repo *Repository

type Repository struct {
	App *config.AppConfig
}

func Routes(g *gin.Engine) {
	stocks := g.Group("/stocks")

	stocks.GET("/:symbol", func(c *gin.Context) {
		symbol := c.Param("symbol")
		c.JSON(200, "This doesn't work yet. "+symbol)
	})
}

func InitRepo(a *config.AppConfig) {
	Repo = &Repository{
		App: a,
	}
}
