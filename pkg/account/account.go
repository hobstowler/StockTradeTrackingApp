package account

import (
	"UglyTradingApp/pkg/auth"
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
	account.GET("/", Repo.getAccounts)
	account.GET("/:accountId", Repo.getAccount)
	account.GET("/:accountId/transactions", Repo.getTransactions)
	account.GET("/:accountId/transactions/:transactionId", Repo.getTransaction)
}

func InitRepo(a *config.AppConfig) {
	Repo = &Repository{
		App: a,
	}
}

type Accounts []Account

type Account struct {
	SecuritiesAccount SecuritiesAccount `json:"securitiesAccount"`
}

type SecuritiesAccount struct {
	Type                    string            `json:"type"`
	AccountID               string            `json:"accountId"`
	RoundTrips              float64           `json:"roundTrips"`
	IsDayTrader             bool              `json:"isDayTrader"`
	IsClosingOnlyRestricted bool              `json:"isClosingOnlyRestricted"`
	Positions               []Position        `json:"positions"`
	OrderStrategies         []OrderStrategy   `json:"orderStrategies"`
	InitialBalances         InitialBalances   `json:"initialBalances"`
	CurrentBalances         CurrentBalances   `json:"currentBalances"`
	ProjectedBalances       ProjectedBalances `json:"projectedBalances"`
}

type InitialBalances struct {
	AccruedInterest                  float64 `json:"accruedInterest"`
	AvailableFundsNonMarginableTrade float64 `json:"availableFundsNonMarginableTrade"`
	BondValue                        float64 `json:"bondValue"`
	BuyingPower                      float64 `json:"buyingPower"`
	CashBalance                      float64 `json:"cashBalance"`
	CashAvailableForTrading          float64 `json:"cashAvailableForTrading"`
	CashReceipts                     float64 `json:"cashReceipts"`
	DayTradingBuyingPower            float64 `json:"dayTradingBuyingPower"`
	DayTradingBuyingPowerCall        float64 `json:"dayTradingBuyingPowerCall"`
	DayTradingEquityCall             float64 `json:"dayTradingEquityCall"`
	Equity                           float64 `json:"equity"`
	EquityPercentage                 float64 `json:"equityPercentage"`
	LiquidationValue                 float64 `json:"liquidationValue"`
	LongMarginValue                  float64 `json:"longMarginValue"`
	LongOptionMarketValue            float64 `json:"longOptionMarketValue"`
	LongStockValue                   float64 `json:"longStockValue"`
	MaintenanceCall                  float64 `json:"maintenanceCall"`
	MaintenanceRequirement           float64 `json:"maintenanceRequirement"`
	Margin                           float64 `json:"margin"`
	MarginEquity                     float64 `json:"marginEquity"`
	MoneyMarketFund                  float64 `json:"moneyMarketFund"`
	MutualFundValue                  float64 `json:"mutualFundValue"`
	RegTCall                         float64 `json:"regTCall"`
	ShortMarginValue                 float64 `json:"shortMarginValue"`
	ShortOptionMarketValue           float64 `json:"shortOptionMarketValue"`
	ShortStockValue                  float64 `json:"shortStockValue"`
	TotalCash                        float64 `json:"totalCash"`
	IsInCall                         bool    `json:"isInCall"`
	PendingDeposits                  float64 `json:"pendingDeposits"`
	MarginBalance                    float64 `json:"marginBalance"`
	ShortBalance                     float64 `json:"shortBalance"`
	AccountValue                     float64 `json:"accountValue"`
}

type CurrentBalances struct {
	AccruedInterest                  float64 `json:"accruedInterest"`
	CashBalance                      float64 `json:"cashBalance"`
	CashReceipts                     float64 `json:"cashReceipts"`
	LongOptionMarketValue            float64 `json:"longOptionMarketValue"`
	LiquidationValue                 float64 `json:"liquidationValue"`
	LongMarketValue                  float64 `json:"longMarketValue"`
	MoneyMarketFund                  float64 `json:"moneyMarketFund"`
	Savings                          float64 `json:"savings"`
	ShortMarketValue                 float64 `json:"shortMarketValue"`
	PendingDeposits                  float64 `json:"pendingDeposits"`
	AvailableFunds                   float64 `json:"availableFunds"`
	AvailableFundsNonMarginableTrade float64 `json:"availableFundsNonMarginableTrade"`
	BuyingPower                      float64 `json:"buyingPower"`
	BuyingPowerNonMarginableTrade    float64 `json:"buyingPowerNonMarginableTrade"`
	DayTradingBuyingPower            float64 `json:"dayTradingBuyingPower"`
	Equity                           float64 `json:"equity"`
	EquityPercentage                 float64 `json:"equityPercentage"`
	LongMarginValue                  float64 `json:"longMarginValue"`
	MaintenanceCall                  float64 `json:"maintenanceCall"`
	MaintenanceRequirement           float64 `json:"maintenanceRequirement"`
	MarginBalance                    float64 `json:"marginBalance"`
	RegTCall                         float64 `json:"regTCall"`
	ShortBalance                     float64 `json:"shortBalance"`
	ShortMarginValue                 float64 `json:"shortMarginValue"`
	ShortOptionMarketValue           float64 `json:"shortOptionMarketValue"`
	Sma                              float64 `json:"sma"`
	MutualFundValue                  float64 `json:"mutualFundValue"`
	BondValue                        float64 `json:"bondValue"`
}

type ProjectedBalances struct {
	AvailableFunds                   float64 `json:"availableFunds"`
	AvailableFundsNonMarginableTrade float64 `json:"availableFundsNonMarginableTrade"`
	BuyingPower                      float64 `json:"buyingPower"`
	DayTradingBuyingPower            float64 `json:"dayTradingBuyingPower"`
	DayTradingBuyingPowerCall        float64 `json:"dayTradingBuyingPowerCall"`
	MaintenanceCall                  float64 `json:"maintenanceCall"`
	RegTCall                         float64 `json:"regTCall"`
	IsInCall                         bool    `json:"isInCall"`
	StockBuyingPower                 float64 `json:"stockBuyingPower"`
}

type Position struct {
	ShortQuantity                  float64    `json:"shortQuantity"`
	AveragePrice                   float64    `json:"averagePrice"`
	CurrentDayProfitLoss           float64    `json:"currentDayProfitLoss"`
	CurrentDayProfitLossPercentage float64    `json:"currentDayProfitLossPercentage"`
	LongQuantity                   float64    `json:"longQuantity"`
	SettledLongQuantity            float64    `json:"settledLongQuantity"`
	SettledShortQuantity           float64    `json:"settledShortQuantity"`
	AgedQuantity                   float64    `json:"agedQuantity"`
	Instrument                     Instrument `json:"instrument"`
	MarketValue                    float64    `json:"marketValue"`
}

type OrderStrategy struct {
	Session    string `json:"session"`
	Duration   string `json:"duration"`
	OrderType  string `json:"orderType"`
	CancelTime struct {
		Date        string `json:"date"`
		ShortFormat bool   `json:"shortFormat"`
	} `json:"cancelTime"`
	ComplexOrderStrategyType string  `json:"complexOrderStrategyType"`
	Quantity                 float64 `json:"quantity"`
	FilledQuantity           float64 `json:"filledQuantity"`
	RemainingQuantity        float64 `json:"remainingQuantity"`
	RequestedDestination     string  `json:"requestedDestination"`
	DestinationLinkName      string  `json:"destinationLinkName"`
	ReleaseTime              string  `json:"releaseTime"`
	StopPrice                float64 `json:"stopPrice"`
	StopPriceLinkBasis       string  `json:"stopPriceLinkBasis"`
	StopPriceLinkType        string  `json:"stopPriceLinkType"`
	StopPriceOffset          float64 `json:"stopPriceOffset"`
	StopType                 string  `json:"stopType"`
	PriceLinkBasis           string  `json:"priceLinkBasis"`
	PriceLinkType            string  `json:"priceLinkType"`
	Price                    float64 `json:"price"`
	TaxLotMethod             string  `json:"taxLotMethod"`
	OrderLegCollection       []struct {
		OrderLegType   string     `json:"orderLegType"`
		LegId          float64    `json:"legId"`
		Instrument     Instrument `json:"instrument"`
		Instruction    string     `json:"instruction"`
		PositionEffect string     `json:"positionEffect"`
		Quantity       float64    `json:"quantity"`
		QuantityType   string     `json:"quantityType"`
	} `json:"orderLegCollection"`
	ActivationPrice          float64         `json:"activationPrice"`
	SpecialInstruction       string          `json:"specialInstruction"`
	OrderStrategyType        string          `json:"orderStrategyType"`
	OrderId                  float64         `json:"orderId"`
	Cancelable               bool            `json:"cancelable"`
	Editable                 bool            `json:"editable"`
	Status                   string          `json:"status"`
	EnteredTime              string          `json:"enteredTime"`
	CloseTime                string          `json:"closeTime"`
	Tag                      string          `json:"tag"`
	AccountId                float64         `json:"accountId"`
	OrderActivityCollection  []OrderActivity `json:"orderActivityCollection"`
	ReplacingOrderCollection []struct{}      `json:"replacingOrderCollection"`
	ChildOrderStrategies     []struct{}      `json:"childOrderStrategies"`
	StatusDescription        string          `json:"statusDescription"`
}

type OrderActivity struct {
	ActivityType           string         `json:"activityType"`
	ExecutionType          string         `json:"executionType"`
	Quantity               float64        `json:"quantity"`
	OrderRemainingQuantity float64        `json:"orderRemainingQuantity"`
	ExecutionLegs          []ExecutionLeg `json:"executionLegs"`
}

type ExecutionLeg struct {
	LegId             float64 `json:"legId"`
	Quantity          float64 `json:"quantity"`
	MismarkedQuantity float64 `json:"mismarkedQuantity"`
	Price             float64 `json:"price"`
	Time              string  `json:"time"`
}

type Instrument struct {
	AssetType          string              `json:"assetType"`
	Cusip              string              `json:"cusip"`
	Symbol             string              `json:"symbol"`
	Description        string              `json:"description"`
	MaturityDate       string              `json:"maturityDate"`
	VariableRate       float64             `json:"variableRate"`
	Factor             float64             `json:"factor"`
	Type               string              `json:"type"`
	PutCall            string              `json:"putCall"`
	UnderlyingSymbol   string              `json:"underlyingSymbol"`
	OptionMultiplier   float64             `json:"optionMultiplier"`
	OptionDeliverables []OptionDeliverable `json:"optionDeliverables"`
}

type OptionDeliverable struct {
	Symbol           string  `json:"symbol""`
	DeliverableUnits float64 `json:"deliverableUnits"`
	CurrencyType     string  `json:"currencyType"`
	AssetType        string  `json:"assetType"`
}

type Transactions []Transaction

type Transaction struct {
	Type                          string          `json:"type"`
	ClearingReferenceNumber       string          `json:"clearingReferenceNumber"`
	SubAccount                    string          `json:"subAccount"`
	SettlementDate                string          `json:"settlementDate"`
	OrderId                       string          `json:"orderId"`
	Sma                           float64         `json:"sma"`
	RequirementReallocationAmount float64         `json:"requirementReallocationAmount"`
	DayTradeBuyingPowerEffect     float64         `json:"dayTradeBuyingPowerEffect"`
	NetAmount                     float64         `json:"netAmount"`
	TransactionDate               string          `json:"transactionDate"`
	OrderDate                     string          `json:"orderDate"`
	TransactionSubType            string          `json:"transactionSubType"`
	TransactionId                 float64         `json:"transactionId"`
	CashBalanceEffectFlag         bool            `json:"cashBalanceEffectFlag"`
	Description                   string          `json:"description"`
	AchStatus                     string          `json:"achStatus"`
	AccruedInterest               float64         `json:"accruedInterest"`
	Fees                          string          `json:"fees"`
	TransactionItem               TransactionItem `json:"transactionItem"`
}

type TransactionItem struct {
	AccountId            int     `json:"accountId"`
	Amount               float64 `json:"amount"`
	Price                float64 `json:"price"`
	Cost                 float64 `json:"cost"`
	ParentOrderKey       float64 `json:"parentOrderKey"`
	ParentChildIndicator string  `json:"parentChildIndicator"`
	Instruction          string  `json:"instruction"`
	PositionEffect       string  `json:"positionEffect"`
	Instrument           struct {
		Symbol               string  `json:"symbol"`
		UnderlyingSymbol     string  `json:"underlyingSymbol"`
		OptionExpirationDate string  `json:"optionExpirationDate"`
		OptionStrikePrice    float64 `json:"optionStrikePrice"`
		PutCall              string  `json:"putCall"`
		Cusip                string  `json:"cusip"`
		Description          string  `json:"description"`
		AssetType            string  `json:"assetType"`
		BondMaturityDate     string  `json:"bondMaturityDate"`
		BondInterestRate     float64 `json:"bondInterestRate"`
	} `json:"instrument"`
}

func (r *Repository) getAccounts(c *gin.Context) {
	tokenClaims, err := auth.ValidateCookieJWT("jwt_td", r.App.OAuth, c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	//TODO check expiration
	url := "https://api.tdameritrade.com/v1/accounts?fields=orders,positions"
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Error creating request: %s", err.Error()))
	}

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", tokenClaims.AccessToken))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Error requesting account information: %s", err.Error()))
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if res.StatusCode != http.StatusOK {
		var result map[string]string
		_ = json.Unmarshal(body, &result)
		c.JSON(http.StatusInternalServerError, result)
		return
	} else {
		var result Accounts
		_ = json.Unmarshal(body, &result)
		c.JSON(http.StatusOK, result)
		return
	}
}

func (r *Repository) getAccount(c *gin.Context) {
	tokenClaims, err := auth.ValidateCookieJWT("jwt_td", r.App.OAuth, c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	accountId := c.Param("accountId")

	//TODO check expiration
	url := fmt.Sprintf("https://api.tdameritrade.com/v1/accounts/%s?fields=orders,positions", accountId)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Error creating request: %s", err.Error()))
	}

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", tokenClaims.AccessToken))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Error requesting account information: %s", err.Error()))
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if res.StatusCode != http.StatusOK {
		var result map[string]string
		_ = json.Unmarshal(body, &result)
		c.JSON(http.StatusInternalServerError, result)
		return
	} else {
		var result Account
		_ = json.Unmarshal(body, &result)
		c.JSON(http.StatusOK, result)
		return
	}
}

func (r *Repository) getTransactions(c *gin.Context) {
	tokenClaims, err := auth.ValidateCookieJWT("jwt_td", r.App.OAuth, c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	accountId := c.Param("accountId")
	transType := c.Query("type")
	startDt := c.Query("startDt")
	endDt := c.Query("endDt")
	symbol := c.Query("symbol")

	url := fmt.Sprintf(
		"https://api.tdameritrade.com/v1/accounts/%s/transactions?type=%s&symbol=%s&startDate=%s&endDate=%s",
		accountId, transType, symbol, startDt, endDt)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Error creating request: %s", err.Error()))
	}

	fmt.Println(url)
	fmt.Println(tokenClaims.AccessToken)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", tokenClaims.AccessToken))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Error requesting account information: %s", err.Error()))
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if res.StatusCode != http.StatusOK {
		var result map[string]string
		_ = json.Unmarshal(body, &result)
		c.JSON(http.StatusInternalServerError, result)
		return
	} else {
		var result Transactions
		_ = json.Unmarshal(body, &result)
		c.JSON(http.StatusOK, result)
		return
	}
}

func (r *Repository) getTransaction(c *gin.Context) {
	tokenClaims, err := auth.ValidateCookieJWT("jwt_td", r.App.OAuth, c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	accountId := c.Param("accountId")
	transactionId := c.Param("transactionId")

	url := fmt.Sprintf("https://api.tdameritrade.com/v1/accounts/%s/transactions/%s", accountId, transactionId)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Error creating request: %s", err.Error()))
	}

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", tokenClaims.AccessToken))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Error requesting account information: %s", err.Error()))
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if res.StatusCode != http.StatusOK {
		var result map[string]string
		_ = json.Unmarshal(body, &result)
		c.JSON(http.StatusInternalServerError, result)
		return
	} else {
		var result Transaction
		_ = json.Unmarshal(body, &result)
		c.JSON(http.StatusOK, result)
		return
	}
}
