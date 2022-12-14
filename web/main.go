package main

import (
	"UglyTradingApp/pkg/account"
	"UglyTradingApp/pkg/auth"
	"UglyTradingApp/pkg/config"
	"UglyTradingApp/pkg/crypto"
	"UglyTradingApp/pkg/db"
	"UglyTradingApp/pkg/stocks"
	secretmanager "cloud.google.com/go/secretmanager/apiv1"
	"cloud.google.com/go/secretmanager/apiv1/secretmanagerpb"
	"context"
	"fmt"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"hash/crc32"
)

func main() {
	oAuth, err := getGCPSecret("oauth", -1)
	if err != nil {
		fmt.Println("Could not access OAuth secret.")
		return
	}

	app := config.AppConfig{
		InitDB:   false,
		DB:       db.GetDB(),
		ClientId: "469502423353-5oh1cq1u04rqmc2e6p5vbkptebsuauf9.apps.googleusercontent.com",
		OAuth:    oAuth,
	}
	if app.InitDB {
		db.InitDB(&app)
	}

	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./ui/build", true)))

	auth.InitRepo(&app)
	account.InitRepo(&app)
	stocks.InitRepo(&app)
	crypto.InitRepo(&app)

	auth.Routes(router)
	account.Routes(router)
	stocks.Routes(router)
	crypto.Routes(router)

	router.Run(":3001")
}

func getGCPSecret(secretName string, version int) (string, error) {
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
