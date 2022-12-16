package auth

import (
	"UglyTradingApp/pkg/config"
	"bytes"
	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"cloud.google.com/go/secretmanager/apiv1/secretmanagerpb"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"hash/crc32"
	"io"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

var Repo *Repository

type Repository struct {
	App *config.AppConfig
}

func Routes(g *gin.Engine) {
	auth := g.Group("/auth")

	auth.POST("/login", Repo.login)
	auth.POST("/logout", Repo.logout)
	auth.POST("/register", Repo.register)
	auth.PUT("/change_password", Repo.changePassword)
	auth.GET("/get_api", Repo.getAPIKey)
	auth.GET("/oauth", Repo.oAuth)
	auth.GET("/return_auth", Repo.returnAuth)
}

func InitRepo(a *config.AppConfig) {
	Repo = &Repository{
		App: a,
	}
}

type LoginReq struct {
	Username    string `json:"username"`
	Password    string `json:"password"`
	Email       string `json:"email"`
	NewPassword string `json:"newPassword"`
	API         string `json:"apiKey"`
}

func (r *Repository) login(c *gin.Context) {
	tokenString, _ := c.Cookie("ugly jwt")
	if tokenString != "" {
		r.loginWithJWT(tokenString, c)
		return
	}
}

func (r *Repository) loginWithJWT(tokenString string, c *gin.Context) {
	tokenClaims, err := r.validateJWT(tokenString)
	if err != nil {
		fmt.Println(err.Error())
	}
	sub := tokenClaims.Sub
	fmt.Println(sub)
}

func (r *Repository) refreshAndLogInWithJWT(refreshString string, c *gin.Context) {

}

func (r *Repository) logout(c *gin.Context) {
	c.SetCookie("ugly jwt", "", -1, "/", c.Request.URL.Host, false, false)
	c.JSON(200, "You are logging out")
}

func (r *Repository) register(c *gin.Context) {
	req := LoginReq{}
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	// Check for required fields
	if req.Username == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, "Username and/or password are required.")
		return
	}

	username := strings.ToLower(req.Username)
	var result string
	err := r.App.DB.QueryRow(`SELECT username FROM user where username = $1`, username).Scan(&result)
	if err != nil && err.Error() != "sql: no rows in result set" {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	if result != "" {
		c.JSON(http.StatusBadRequest, "That username is taken.")
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	_, err = r.App.DB.Exec(
		`INSERT INTO user (username, password, email, api_key) VALUES ($1, $2, $3, $4)`,
		username, hash, req.Email, req.API)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	fmt.Println("okee doke")
	c.JSON(http.StatusCreated, "Success registering as '"+username+"'.")
}

func (r *Repository) changePassword(c *gin.Context) {
	req := LoginReq{}
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}
	if req.Username == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, "Username and/or password are required.")
		return
	}

	username := strings.ToLower(req.Username)
	// Check password hash
	if r.checkPassword(username, req.Password) == false {
		c.JSON(http.StatusBadRequest, "Incorrect password.")
		return
	}

	// Change the password and set the HTTP response
	hash, _ := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	_, err := r.App.DB.Exec(`UPDATE user set password = $1 where username = $2`, hash, username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, "Password successfully changed.")
}

func (r *Repository) checkPassword(u string, p string) bool {
	var result string
	err := r.App.DB.QueryRow(`SELECT password FROM user where username = $1`, u).Scan(&result)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	err = bcrypt.CompareHashAndPassword([]byte(result), []byte(p))
	if err != nil {
		fmt.Println("maybe? " + err.Error())
		return false
	}
	return true
}

func (r *Repository) getAPIKey(c *gin.Context) {
	req := LoginReq{}
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	// Check password hash
	if r.checkPassword(req.Username, req.Password) == false {
		c.JSON(http.StatusBadRequest, "Incorrect password.")
		return
	}
}

// Generate a state variable
func createStateVariable() string {
	state := ""
	for i := 0; i < 10; i++ {
		randChar := rand.Intn(26) + 97
		randNum := rand.Intn(10)
		state = fmt.Sprintf(state, randChar, randNum)
	}
	return state
}

func (r *Repository) oAuth(c *gin.Context) {
	// Generate state and write to DB
	valid := false
	attempts := 5
	var state string
	for !valid {
		state = createStateVariable()
		_, err := r.App.DB.Exec(`INSERT INTO state SET state = $1`, state)
		if err == nil {
			valid = true // should attempt another state variable
		}
		attempts--
		if attempts == 0 {
			panic(err)
		}
	}

	// Build the redirect URL
	var authBuilder strings.Builder
	authBuilder.WriteString("https://accounts.google.com/o/oauth2/v2/auth")
	authBuilder.WriteString(fmt.Sprintf("?response_type=code&client_id=%s", r.App.ClientId))
	authBuilder.WriteString(fmt.Sprintf("&redirect_uri=%s", c.Request.URL.Host))
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

func (r *Repository) returnAuth(c *gin.Context) {
	state := c.Query("state")
	code := c.Query("code")

	var result string
	err := r.App.DB.QueryRow(`SELECT state FROM state where state = $1`, state).Scan(&result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Error retrieving state variable")
		return
	}
	if result != state {
		c.JSON(http.StatusInternalServerError, "Bad state variable in request.")
		return
	}

	tokenJson := &token{
		Code:         code,
		ClientId:     r.App.ClientId,
		ClientSecret: r.App.OAuth,
		RedirectUri:  c.Request.URL.Host + "/auth/return_auth",
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

	// Make request to get token from Google
	res, err := http.DefaultClient.Do(req)
	if res.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Error in token response: %s", err))
		return
	}
	defer res.Body.Close()

	resp, err := io.ReadAll(res.Body)
	m := make(map[string]json.RawMessage)
	err = json.Unmarshal(resp, &m)
	if err != nil {
		panic(err)
	}
	fmt.Println(m)

	c.JSON(200, resp)
}

type CustomClaims struct {
	Username string `json:"username"`
	Sub      string `json:"sub"`
	APIKey   string `json:"api_key"`
	//AuthToken    string `json:"auth_token"`
	//RefreshToken string `json:"refreshToken"`
	jwt.RegisteredClaims
}

func (r *Repository) GenerateJWT(username string, sub string, api_key string) (string, error) {
	claims := CustomClaims{
		username,
		sub,
		api_key,
		jwt.RegisteredClaims{
			Issuer:    "UglyTradingApp",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 7)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	ss, err := token.SignedString([]byte(r.App.OAuth))
	if err != nil {
		return "", err
	}
	return ss, nil
}

func (r *Repository) validateJWT(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(r.App.OAuth), nil
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
