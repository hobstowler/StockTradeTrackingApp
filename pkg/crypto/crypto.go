package crypto

import (
	"UglyTradingApp/pkg/config"
	"github.com/gin-gonic/gin"
	"net/http"
)

var Repo *Repository

type Repository struct {
	App *config.AppConfig
}

func Routes(g *gin.Engine) {
	crypto := g.Group("/crypto")
	crypto.GET("/:symbol", getSymbol)
}

func InitRepo(a *config.AppConfig) {
	Repo = &Repository{
		App: a,
	}
}

func getSymbol(c *gin.Context) {
	symbol := c.Param("symbol")
	c.JSON(http.StatusOK, "Not working yet. "+symbol)
}
