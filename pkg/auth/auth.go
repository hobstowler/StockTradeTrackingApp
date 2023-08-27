package auth

import (
	"UglyTradingApp/pkg/config"
	"bytes"
	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"cloud.google.com/go/secretmanager/apiv1/secretmanagerpb"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"google.golang.org/api/idtoken"
	"hash/crc32"
	"io"
	"math/rand"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type Repository struct {
	App *config.AppConfig
}

var Repo *Repository

func InitRepo(a *config.AppConfig) {
	Repo = &Repository{
		App: a,
	}
}

func Routes(g *gin.Engine) {
	auth := g.Group("/auth")

	auth.POST("/login", Repo.login)
	auth.POST("/provider/login/:provider", Repo.providerLogin)
	auth.POST("/logout", Repo.logout)
	auth.POST("/register", Repo.register)
	auth.GET("/oauth", Repo.oAuth)
	auth.GET("/return_auth", Repo.returnAuth)
	auth.GET("/td_auth", Repo.tdAuth)
	auth.GET("/td_return_auth", Repo.tdReturnAuth)
	auth.POST("/disconnect", Repo.disconnect)
	//auth.GET("/td_refresh_auth", Repo.tdRefresh)
	auth.GET("/verify_td", Repo.verifyTD)
}

type LoginResp struct {
	Username   string `json:"username"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	IsLoggedIn bool   `json:"isLoggedIn"`
	Redirect   string `json:"redirect"`
	Error      string `json:"error"`
}

type tdVerifyResp struct {
	Valid bool   `json:"valid"`
	Error string `json:"error"`
}

// Logs a user in either by redirecting them to the OAuth service or by using a valid JWT passed in the request.
func (r *Repository) login(c *gin.Context) {
	tokenString, _ := c.Cookie("ugly_jwt")
	if tokenString != "" {
		r.loginWithJWT(tokenString, c)
		return
	}
	//c.Request.Method = http.MethodGet
	c.Redirect(http.StatusFound, "/auth/oauth")
}

func (r *Repository) providerLogin(c *gin.Context) {
	c.JSON(http.StatusOK, "not implemented")
}

// Logs a user in with their valid JWT.
func (r *Repository) loginWithJWT(tokenString string, c *gin.Context) {
	tokenClaims, err := ValidateJWT(tokenString, r.App.OAuth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
	}
	sub := tokenClaims.Sub

	var (
		f_name string
		l_name string
	)
	err = r.App.DB.QueryRow(`SELECT first_name, last_name FROM trade.users where sub=?`, sub).Scan(&f_name, &l_name)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, "No registered user found.")
			return
		} else {
			panic(err)
		}
	}

	loginResp := LoginResp{
		Username:   fmt.Sprintf("%s %s", f_name, l_name),
		FirstName:  f_name,
		LastName:   l_name,
		IsLoggedIn: true,
	}
	c.JSON(200, loginResp)
}

// Clears out the ugly_jwt cookie, thus "logging" the user out of the application
func (r *Repository) logout(c *gin.Context) {
	c.SetCookie("jwt_td", "", -1, "/", c.Request.URL.Host, false, false)
	c.SetCookie("ugly_jwt", "", -1, "/", c.Request.URL.Host, false, false)
	c.Redirect(http.StatusFound, "/")
}

func (r *Repository) register(c *gin.Context) {
	loginResp := LoginResp{
		Username:   "test",
		IsLoggedIn: true,
	}
	c.JSON(200, loginResp)
}

func (r *Repository) disconnect(c *gin.Context) {
	c.SetCookie("jwt_td", "", -1, "/", c.Request.URL.Host, false, false)
	c.Redirect(http.StatusFound, "/")
}

type TDAuthResp struct {
	Redirect string `json:"redirect"`
	Error    string `json:"error"`
}

func (r *Repository) tdAuth(c *gin.Context) {
	reqUrl := c.Query("url")
	tdUrlBuilder := strings.Builder{}
	tdUrlBuilder.WriteString("https://auth.tdameritrade.com/auth")
	tdUrlBuilder.WriteString("?response_type=code&redirect_uri=")
	tdUrlBuilder.WriteString(fmt.Sprintf("%s/auth/td_return_auth", "http://"+reqUrl))
	tdUrlBuilder.WriteString(fmt.Sprintf("&client_id=%s@AMER.OAUTHAP", r.App.TdApi))
	tdUrl := tdUrlBuilder.String()
	tdAuthResp := TDAuthResp{
		Redirect: tdUrl,
	}
	c.JSON(http.StatusOK, tdAuthResp)
}

type tdTokenResp struct {
	AccessToken           string `json:"access_token"`
	RefreshToken          string `json:"refresh_token"`
	TokenType             string `json:"token_type"`
	ExpiresIn             int    `json:"expires_in"`
	Scope                 string `json:"scope"`
	RefreshTokenExpiresIn int    `json:"refresh_token_expires_in"`
}

func (r *Repository) tdReturnAuth(c *gin.Context) {
	code := c.Query("code")
	tokenUrl := "https://api.tdameritrade.com/v1/oauth2/token"

	// Encode body data
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("access_type", "offline")
	data.Set("code", code)
	data.Set("client_id", r.App.TdApi)
	data.Set("redirect_uri", "https://"+c.Request.Host+"/auth/td_return_auth")
	encodedData := data.Encode()

	// Create request and set headers
	req, err := http.NewRequest(http.MethodPost, tokenUrl, strings.NewReader(encodedData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Error creating request")
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// Make token request to TD Ameritrade
	res, err := http.DefaultClient.Do(req)
	defer res.Body.Close()

	// TODO handle a bad response here
	// Read in body from TD
	body, err := io.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	var result tdTokenResp
	_ = json.Unmarshal(body, &result)

	tdClaims := CustomClaims{
		FirstName:          "",
		LastName:           "",
		Sub:                "",
		AccessToken:        result.AccessToken,
		AccessTokenExpiry:  result.ExpiresIn,
		RefreshToken:       result.RefreshToken,
		RefreshTokenExpiry: result.RefreshTokenExpiresIn,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "UglyTradingApp",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)),
		},
	}

	jwtString, err := GenerateJWT(tdClaims, r.App.OAuth)

	// Set cookies and redirect back to main page
	c.SetCookie("jwt_td", jwtString, result.RefreshTokenExpiresIn, "/", c.Request.URL.Host, false, true)
	c.Redirect(http.StatusFound, "/")
}

func (r *Repository) verifyTD(c *gin.Context) {
	tokenString, _ := c.Cookie("jwt_td")
	resp := tdVerifyResp{
		Valid: false,
		Error: "",
	}

	tokenClaims, err := ValidateJWT(tokenString, r.App.OAuth)
	if err != nil {
		resp.Error = err.Error()
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	if tokenClaims.ExpiresAt.After(time.Now()) {
		resp.Valid = true
	}
	c.JSON(http.StatusOK, resp)
	return
}

func (r *Repository) TdRefresh(claims *CustomClaims, c *gin.Context) error {
	tokenUrl := "https://api.tdameritrade.com/v1/oauth2/token?scope=AccountAccess"

	// Encode body data
	data := url.Values{}
	data.Set("grant_type", "refresh_token")
	data.Set("client_id", r.App.TdApi)
	data.Set("refresh_token", claims.RefreshToken)
	encodedData := data.Encode()

	// Create request and set headers
	req, err := http.NewRequest(http.MethodPost, tokenUrl, strings.NewReader(encodedData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Error creating request")
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// Make token request to TD Ameritrade
	res, err := http.DefaultClient.Do(req)
	defer res.Body.Close()

	// TODO handle a bad response here
	// Read in body from TD
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return err
	}

	var result tdTokenResp
	_ = json.Unmarshal(body, &result)
	claims.AccessToken = result.AccessToken
	claims.AccessTokenExpiry = result.ExpiresIn

	jwtString, err := GenerateJWT(*claims, r.App.OAuth)
	if err != nil {
		return err
	}

	// recalculate token expiration
	expiryDate := claims.IssuedAt.Add(time.Duration(claims.RefreshTokenExpiry) * time.Second)
	newExpiresIn := int(expiryDate.Sub(time.Now()).Seconds())

	c.SetCookie("jwt_td", jwtString, newExpiresIn, "/", c.Request.URL.Host, false, true)
	return nil
}

// Generate a state variable
func createStateVariable() string {
	var state strings.Builder
	rand.Seed(time.Now().Unix())
	for i := 0; i < 10; i++ {
		state.WriteString(string(rune(rand.Intn(26)+97)) + string(rune(rand.Intn(10)+48)))
	}
	return state.String()
}

// Builds a redirect URL and sends the user's browser page to Google's OAuth 2.0 service
func (r *Repository) oAuth(c *gin.Context) {
	// Generate state and write to DB
	valid := false
	attempts := 5
	var state string
	for !valid {
		state = createStateVariable()
		_, err := r.App.DB.Exec(`INSERT INTO trade.state (state) VALUES (?)`, state)
		if err == nil {
			valid = true // should attempt another state variable
		}
		attempts = attempts - 1
		if attempts == 0 {
			panic(err)
		}
	}

	// Build the redirect URL
	var authBuilder strings.Builder
	authBuilder.WriteString("https://accounts.google.com/o/oauth2/v2/auth")
	authBuilder.WriteString(fmt.Sprintf("?response_type=code&client_id=%s", r.App.ClientId))
	authBuilder.WriteString(fmt.Sprintf("&redirect_uri=https://%s%s", c.Request.Host, "/auth/return_auth"))
	authBuilder.WriteString(fmt.Sprintf("&scope=profile&state=%s", state))
	authUrl := authBuilder.String()

	c.Redirect(http.StatusFound, authUrl)
}

type token struct {
	Code         string `json:"code"`
	ClientId     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	RedirectUri  string `json:"redirect_uri"`
	GrantType    string `json:"grant_type"`
}

type googleToken struct {
	AccessToken string `json:"access_token"`
	IdToken     string `json:"id_token"`
	ExpiresIn   int    `json:"expires_in"`
	Scope       string `json:"scope"`
	TokenType   string `json:"token_type"`
}

type CustomClaims struct {
	FirstName          string `json:"first_name"`
	LastName           string `json:"last_name"`
	Sub                string `json:"sub"`
	AccessToken        string `json:"access_token"`
	AccessTokenExpiry  int    `json:"access_token_expiry"`
	RefreshToken       string `json:"refresh_token"`
	RefreshTokenExpiry int    `json:"refresh_token_expiry"`
	jwt.RegisteredClaims
}

// Return authorization from Google OAuth 2.0
// Checks that state variable returned is expected and then requests a token from Google from which the user's name and
// sub can be determined.
func (r *Repository) returnAuth(c *gin.Context) {
	state := c.Query("state")
	code := c.Query("code")
	var (
		dbState string
		ts      time.Time
	)

	// Check that state variable is valid from DB
	err := r.App.DB.QueryRow(`SELECT state, ts FROM trade.state where state=?`, state).Scan(&dbState, &ts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Error retrieving state variable")
		return
	}
	if dbState != state {
		c.JSON(http.StatusBadRequest, "Invalid state variable")
		return
	}
	expiry := ts.Add(10 * time.Minute)
	if !expiry.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, "Time limit exceeded")
		return
	}

	// Clean up state variable
	_, _ = r.App.DB.Exec(`DELETE FROM trade.state WHERE state = ?`, state)

	// Make http request for Google token
	// TODO move this to a separate function
	tokenJson := &token{
		Code:         code,
		ClientId:     r.App.ClientId,
		ClientSecret: r.App.OAuth,
		RedirectUri:  "https://" + c.Request.Host + "/auth/return_auth",
		GrantType:    "authorization_code",
	}
	tokenJSONPayload, _ := json.Marshal(tokenJson)
	bodyReader := bytes.NewReader(tokenJSONPayload)
	tokenURL := "https://oauth2.googleapis.com/token"
	req, err := http.NewRequest(http.MethodPost, tokenURL, bodyReader)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Error creating token request.")
		return
	}

	// Send request to get token from Google
	res, err := http.DefaultClient.Do(req)
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if res.StatusCode != http.StatusOK {
		var result map[string]any
		_ = json.Unmarshal(body, &result)
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Error in token response: %d %s", res.StatusCode, result))
		return
	}

	var result googleToken
	_ = json.Unmarshal(body, &result)
	payload, err := idtoken.Validate(context.Background(), result.IdToken, r.App.ClientId)
	if err != nil {
		panic(err)
	}
	sub := fmt.Sprint(payload.Claims["sub"])

	firstName, lastName, err := getNames("Bearer " + result.AccessToken)

	claims := CustomClaims{
		firstName,
		lastName,
		sub,
		"",
		0,
		"",
		0,
		jwt.RegisteredClaims{
			Issuer:    "UglyTradingApp",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)),
		},
	}

	jwtString, err := GenerateJWT(claims, r.App.OAuth)
	if err != nil {
		panic(err)
	}

	c.SetCookie("ugly_jwt", jwtString, 60*60*24*7, "/", c.Request.URL.Host, false, false)
	err = r.registerNewUser(firstName, lastName, sub)
	if err != nil {
		fmt.Println(err)
	}

	c.Redirect(http.StatusFound, "/")
}

// Called on /auth/return_auth to register a new user to the Ugly Trading App. Queries DB to determine if user already
// exists.
func (r *Repository) registerNewUser(firstName string, lastName string, sub string) error {
	var result string
	err := r.App.DB.QueryRow(`SELECT sub from trade.users where sub=?`, sub).Scan(&result)
	if err != nil && err != sql.ErrNoRows {
		return err
	} else if err == sql.ErrNoRows {
		_, err = r.App.DB.Exec(`INSERT INTO trade.users (first_name, last_name, sub) VALUES (?, ?, ?)`, firstName, lastName, sub)
		if err != nil {
			return err
		}
	}
	return nil
}

type GoogleNames struct {
	Etag         string     `json:"etag"`
	Names        []NameDict `json:"names"`
	ResourceName string     `json:"resourceName"`
}

type NameDict struct {
	DisplayName          string       `json:"displayName"`
	DisplayNameLastFirst string       `json:"displayNameLastFirst"`
	FamilyName           string       `json:"familyName"`
	GivenName            string       `json:"givenName"`
	Metadata             NameMetadata `json:"metadata"`
	UnstructuredName     string       `json:"unstructuredName"`
}

type NameMetadata struct {
	Primary       bool           `json:"primary"`
	Source        map[string]any `json:"source"`
	SourcePrimary bool           `json:"sourcePrimary"`
}

// Requests a user's name and other information from Google's People API using the authorization token in the return
// auth endpoint.
func getNames(authorization string) (string, string, error) {
	nameUrl := "https://people.googleapis.com/v1/people/me?personFields=names"
	req, err := http.NewRequest(http.MethodGet, nameUrl, nil)
	if err != nil {
		panic(err)
	}
	req.Header.Add("Authorization", authorization)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if res.StatusCode != http.StatusOK {
		var result map[string]any
		_ = json.Unmarshal(body, &result)
		return "", "", errors.New(fmt.Sprintf("Error requesting names from google: %d %s", res.StatusCode, result))
	}
	var result GoogleNames
	_ = json.Unmarshal(body, &result)

	names := result.Names
	for _, name := range names {
		if name.Metadata.Primary == true {
			return name.GivenName, name.FamilyName, nil
		}
	}

	return "", "", errors.New("No primary name found")
}

// Generates a JWT using the CustomClaims and secret
func GenerateJWT(customClaim CustomClaims, secret string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, customClaim)
	ss, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}
	return ss, nil
}

func ValidateCookieJWT(cookieName string, secret string, c *gin.Context) (*CustomClaims, error) {
	tokenString, err := c.Cookie(cookieName)
	if err != nil {
		return nil, err
	}

	tokenClaims, err := ValidateJWT(tokenString, secret)
	if err != nil {
		return nil, err
	}

	accessExpiration := tokenClaims.IssuedAt.Add(time.Duration(tokenClaims.AccessTokenExpiry) * time.Second)
	if cookieName == "jwt_td" && accessExpiration.Before(time.Now().Add(-5*time.Minute)) {
		err = Repo.TdRefresh(tokenClaims, c)
		if err != nil {
			return nil, err
		}
	}
	return tokenClaims, nil
}

// Validates a given JWT string using a provided secret.
func ValidateJWT(tokenString string, secret string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return &CustomClaims{}, err
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	} else {
		return &CustomClaims{}, errors.New("Invalid Token")
	}
}

// Gets a secret of a certain string from GCP's Secret Manager
func GetGCPSecret(secretName string, version int) (string, error) {
	var name string
	if version == -1 {
		name = fmt.Sprintf("projects/469502423353/secrets/%s/versions/latest", secretName)
	} else {
		name = fmt.Sprintf("projects/469502423353/secrets/%s/versions/%d", secretName, version)
	}

	// Create the client
	ctx := context.Background()
	client, err := secretmanager.NewClient(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to create secretmanager client: %v", err)
	}
	defer client.Close()

	// Build the request.
	req := &secretmanagerpb.AccessSecretVersionRequest{
		Name: name,
	}

	// Call the API
	result, err := client.AccessSecretVersion(ctx, req)
	if err != nil {
		return "", fmt.Errorf("failed to access secret version :%v", err)
	}

	// Verify data checksum
	crc32c := crc32.MakeTable(crc32.Castagnoli)
	checksum := int64(crc32.Checksum(result.Payload.Data, crc32c))
	if checksum != *result.Payload.DataCrc32C {
		return "", fmt.Errorf("data corruption detected")
	}

	return string(result.Payload.Data), nil
}
