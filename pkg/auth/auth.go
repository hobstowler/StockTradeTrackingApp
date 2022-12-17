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
	"google.golang.org/api/idtoken"
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

	auth.GET("/login", Repo.login)
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
	//c.Request.Method = http.MethodGet
	c.Redirect(http.StatusFound, "/auth/oauth")
}

func (r *Repository) loginWithJWT(tokenString string, c *gin.Context) {
	tokenClaims, err := r.validateJWT(tokenString)
	if err != nil {
		fmt.Println(err.Error())
	}
	sub := tokenClaims.Sub

	var result string
	r.App.DB.QueryRow(`SELECT first_name FROM 'user' where sub=$1`, sub).Scan(&result)
	fmt.Println(sub)
}

func (r *Repository) refreshAndLogInWithJWT(refreshString string, c *gin.Context) {

}

func (r *Repository) logout(c *gin.Context) {
	c.SetCookie("ugly jwt", "", -1, "/", c.Request.URL.Host, false, false)
	c.JSON(200, "You are logging out")
}

func (r *Repository) register(c *gin.Context) {

}

func (r *Repository) changePassword(c *gin.Context) {

}

func (r *Repository) checkPassword(u string, p string) {

}

func (r *Repository) getAPIKey(c *gin.Context) {

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

func (r *Repository) oAuth(c *gin.Context) {
	// Generate state and write to DB
	valid := false
	attempts := 5
	var state string
	for !valid {
		state = createStateVariable()
		_, err := r.App.DB.Exec(`INSERT INTO state (state) VALUES ($1)`, state)
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
	authBuilder.WriteString(fmt.Sprintf("&redirect_uri=http://%s%s", c.Request.Host, "/auth/return_auth"))
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

func (r *Repository) returnAuth(c *gin.Context) {
	state := c.Query("state")
	code := c.Query("code")

	var row string
	err := r.App.DB.QueryRow(`SELECT state FROM state where state = $1`, state).Scan(&row)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Error retrieving state variable")
		return
	}
	if row != state {
		c.JSON(http.StatusInternalServerError, "Bad state variable in request.")
		return
	}

	// Clean up state variable
	_, _ = r.App.DB.Exec(`DELETE FROM state WHERE state = $1`, state)

	tokenJson := &token{
		Code:         code,
		ClientId:     r.App.ClientId,
		ClientSecret: r.App.OAuth,
		RedirectUri:  "http://" + c.Request.Host + "/auth/return_auth",
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
	fmt.Println("PAYLOAD")
	fmt.Println(payload)

	firstName, lastName, err := getNames("Bearer " + result.AccessToken)

	c.JSON(200, firstName+" "+lastName)
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

func getNames(authorization string) (string, string, error) {
	nameUrl := "https://people.googleapis.com/v1/people/me?personFields=names"
	req, err := http.NewRequest(http.MethodGet, nameUrl, nil)
	if err != nil {
		panic(err)
	}
	req.Header.Add("Authorization", authorization)
	res, err := http.DefaultClient.Do(req)
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

type CustomClaims struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Sub       string `json:"sub"`
	//APIKey   string `json:"api_key"`
	//AuthToken    string `json:"auth_token"`
	//RefreshToken string `json:"refreshToken"`
	jwt.RegisteredClaims
}

func (r *Repository) GenerateJWT(firstName string, lastName string, sub string) (string, error) {
	claims := CustomClaims{
		firstName,
		lastName,
		sub,
		//api_key,
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
