package stocks

import (
	"UglyTradingApp/pkg/config"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
	"strings"
)

var Repo *Repository

type Repository struct {
	App *config.AppConfig
}

type CandleResp struct {
	Empty   bool      `json:"empty"`
	Symbol  string    `json:"symbol"`
	Candles []*Candle `json:"candles"`
}

type Candle struct {
	Close    int `json:"close"`
	Datetime int `json:"datetime"`
	High     int `json:"high"`
	Low      int `json:"low"`
	Open     int `json:"open"`
	Volume   int `json:"volume"`
}

func Routes(g *gin.Engine) {
	stocks := g.Group("/stocks")

	stocks.GET("/candles", Repo.GetCandles)
	stocks.GET("/:symbol", func(c *gin.Context) {
		symbol := c.Param("symbol")
		c.JSON(200, "This doesn't work yet. "+symbol)
	})
}

func (r *Repository) GetCandles(c *gin.Context) {
	symbol := strings.ToUpper(c.Query("symbol"))

	candleUrl := "https://api.tdameritrade.com/v1/marketdata/" + symbol + "/pricehistory"

	// Don't really care to error handle at this point, but will add later
	auth, _ := c.Cookie("access_token")

	// build and send request to TD
	req, err := http.NewRequest("GET", candleUrl, nil)
	req.Header.Add("Authorization", "Bearer "+auth)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	fmt.Println(string([]byte(body)))
	c.JSON(200, body)
}

func InitRepo(a *config.AppConfig) {
	Repo = &Repository{
		App: a,
	}
}
