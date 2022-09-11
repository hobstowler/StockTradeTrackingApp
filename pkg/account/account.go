package account

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
	account := g.Group("/account")
	account.GET("/balances", getBalances)
}

func InitRepo(a *config.AppConfig) {
	Repo = &Repository{
		App: a,
	}
}

func getBalances(c *gin.Context) {
	c.JSON(http.StatusOK, "$1000")
}
