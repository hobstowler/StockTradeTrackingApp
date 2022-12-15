package stocks

import (
	"UglyTradingApp/pkg/config"
	"context"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
	"strings"
	"time"
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
	stocks := g.Group("/stock")

	stocks.GET("/news", Repo.GetStories)
	stocks.GET("/candles", Repo.GetCandles)
	stocks.GET("/quote", Repo.getQuote)
}

func (r *Repository) getQuote(c *gin.Context) {
	symbol := c.Query("symbol")
	authorization := c.Request.Header.Get("Authorization")
	api := c.Query("api")
	if symbol == "" {
		c.JSON(http.StatusBadRequest, "No stock symbols in query.")
		return
	}

	// Build the URL and check if request can be made.
	quoteUrl := "https://api.tdameritrade.com/v1/marketdata/quotes?symbol=" + symbol
	if api != "" && authorization == "" {
		quoteUrl = quoteUrl + "&apikey=" + api
	} else if api == "" && authorization == "" {
		c.JSON(http.StatusUnauthorized, "Cannot make request. No authorization and/or API key provided.")
	}

	// Create client and add optional authorization header
	req, err := http.NewRequest(http.MethodGet, quoteUrl, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Error creating http request.")
		return
	} else if authorization != "" {
		req.Header.Add("Authorization", authorization)
	}

	// Create client and send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}
	defer resp.Body.Close()

	// Format response
	body, _ := io.ReadAll(resp.Body)
	var result map[string]any
	_ = json.Unmarshal(body, &result)

	c.JSON(http.StatusOK, result)
}

type Story struct {
	Category string `json:"category"`
	Datetime int64  `json:"datetime"`
	Headline string `json:"headline"`
	Id       int64  `json:"id"`
	Image    string `json:"image"`
	Related  string `json:"related"`
	Source   string `json:"source"`
	Summary  string `json:"summary"`
	Url      string `json:"url"`
}

func (r *Repository) GetStories(c *gin.Context) {
	symbol := c.Query("symbol")
	fromDate := c.Query("from_date")
	toDate := c.Query("to_date")

	if fromDate == "" && toDate == "" {
		currentTime := time.Now()
		yesterday := currentTime.Add(-1 * time.Hour * 24)
		fromDate = yesterday.UTC().Format("2006-01-02")
		toDate = time.Now().UTC().Format("2006-01-02")
	} else if (fromDate == "" && toDate != "") || (fromDate != "" && toDate == "") {
		c.JSON(http.StatusBadRequest, "Missing from or to date. The last 24 hours of stories will be pulled if "+
			"both of these are blank.")
		return
	}
	_, err := time.Parse("2006-01-02", fromDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, fmt.Sprintf("Bad 'from date' format: %s", err.Error()))
	}
	_, err = time.Parse("2006-01-02", toDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, fmt.Sprintf("Bad 'to date' format: %s", err.Error()))
	}

	res, _, err := r.App.FinnhubClient.CompanyNews(context.Background()).Symbol(symbol).From(fromDate).To(toDate).Execute()
	//res = res[0:5]
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, res)
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
