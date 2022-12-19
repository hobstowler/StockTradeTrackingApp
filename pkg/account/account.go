package account

import (
	"UglyTradingApp/pkg/config"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
)

var Repo *Repository

type Repository struct {
	App *config.AppConfig
}

func Routes(g *gin.Engine) {
	account := g.Group("/account")
	account.GET("/balances", Repo.getBalances)
	account.GET("/watchlists", Repo.getAllWatchLists)
	account.GET("/watchlists/:watchListId", Repo.getWatchListById)
}

func InitRepo(a *config.AppConfig) {
	Repo = &Repository{
		App: a,
	}
}

func (r *Repository) getBalances(c *gin.Context) {
	c.JSON(http.StatusOK, "$1000")
}

type WatchList struct {
	Name           string           `json:"name"`
	WatchListId    string           `json:"watchListId"`
	AccountId      string           `json:"accountId"`
	Status         string           `json:"status"`
	WatchListItems []WatchListItems `json:"watchListItems"`
}

type WatchListItems struct {
	SequenceId   int        `json:"sequenceId"`
	Quantity     int        `json:"quantity"`
	AveragePrice float64    `json:"averagePrice"`
	Commission   float64    `json:"commission"`
	PurchaseDate string     `json:"purchaseDate"`
	Instrument   Instrument `json:"instrument"`
	Status       string     `json:"status"`
}

type Instrument struct {
	Symbol      string `json:"symbol"`
	Description string `json:"description"`
	AssetType   string `json:"assetType"`
}

func (r *Repository) getAllWatchLists(c *gin.Context) {

}

func (r *Repository) getWatchListById(c *gin.Context) {
	accountId := c.Param("watchListId")
	authorization := c.Request.Header.Get("Authorization")
	if accountId == "" {
		c.JSON(http.StatusBadRequest, "No account ID provided.")
	}
	if authorization == "" {
		c.JSON(http.StatusBadRequest, "No authorization header provided.")
	}

	accountUrl := fmt.Sprintf("https://api.tdameritrade.com/v1/accounts/%s/watchlists", accountId)

	req, err := http.NewRequest(http.MethodGet, accountUrl, nil)
	if err != nil {
		panic(err)
	}
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	resp, err := io.ReadAll(res.Body)
	var result []WatchList
	_ = json.Unmarshal(resp, &result)
	c.JSON(200, result)
}
