package main

import (
	"fmt"
	"net/http"
)

func login(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you're logging in.")
}

func logout(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you're logging in.")
}

func register(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you're logging in.")
}

func changePassword(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you're logging in.")
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("ui/public/index.html")))

	http.HandleFunc("/auth/login", login)
	http.HandleFunc("/auth/logout", logout)
	http.HandleFunc("/auth/change_password", changePassword)
	http.HandleFunc("/auth/register", register)

	http.ListenAndServe(":3000", nil)
}
