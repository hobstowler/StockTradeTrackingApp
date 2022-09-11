package auth

import (
	"UglyTradingApp/pkg/config"
	"fmt"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

var Repo *Repository

type Repository struct {
	App *config.AppConfig
}

type LoginReq struct {
	Username    string `json:"username"`
	Password    string `json:"password"`
	Email       string `json:"email"`
	NewPassword string `json:"newPassword"`
	API         string `json:"apiKey"`
}

func Routes(g *gin.Engine) {
	auth := g.Group("/auth")

	auth.POST("/login", Repo.login)
	auth.POST("/logout", Repo.logout)
	auth.POST("/register", Repo.register)
	auth.PUT("/change_password", Repo.changePassword)
	auth.GET("/get_api", Repo.getAPIKey)
}

func InitRepo(a *config.AppConfig) {
	Repo = &Repository{
		App: a,
	}
}

func (r *Repository) login(c *gin.Context) {
	req := LoginReq{}
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}
	if req.Username == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, "Username and/or password are required.")
		return
	}

	user := r.App.DB.QueryRow(`SELECT * FROM user where username = $1`, (req.Username))
	fmt.Println(user)
	c.JSON(200, "You are logging in, ")
}

func (r *Repository) logout(c *gin.Context) {
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
	//if req.API == "" {
	//	c.JSON(http.StatusBadRequest, "API Key is required.")
	//	return
	//}
	// Check if username is already in use.
	var result string
	err := r.App.DB.QueryRow(`SELECT username FROM user where username = $1`, req.Username).Scan(&result)
	if err != nil && err.Error() != "sql: no rows in result set" {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	if result != "" {
		c.JSON(http.StatusBadRequest, "That username is taken.")
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	_, err = r.App.DB.Exec(`INSERT INTO user (username, password, email, api_key) VALUES ($1, $2, $3, $4)`, req.Username, hash, req.Email, req.API)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(200, "Success registering '"+req.Username+"'")
}

func (r *Repository) changePassword(c *gin.Context) {
	req := LoginReq{}
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}
	c.JSON(200, "You are changing your password")
}

func (r *Repository) getAPIKey(c *gin.Context) {
	c.JSON(200, "Fetching API Key.")
}
