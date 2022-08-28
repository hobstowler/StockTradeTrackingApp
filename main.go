package UglyTradingApp

import (
	"fmt"
	"net/http"
)

func login(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you're logging in.")
}

func logout(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you're logging out.")
}

func register(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you're registering.")
}

func changePassword(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you're changing your password.")
}

func accountBalances(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you're getting your account balances.")
}

func getStock(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "You're getting some stocks")
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("ui/public/index.html")))

	http.HandleFunc("/auth/login", login)
	http.HandleFunc("/auth/logout", logout)
	http.HandleFunc("/auth/change_password", changePassword)
	http.HandleFunc("/auth/register", register)

	http.HandleFunc("/account/balances", accountBalances)

	http.HandleFunc("/stocks", getStock)

	http.ListenAndServe(":3000", nil)
}
