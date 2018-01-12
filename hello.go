package main

import (
		"fmt"
		"log"
		"net/http"
		"strings"

		"github.com/gorilla/websocket"
)

type Message struct {
        Email    string `json:"email"`
        Username string `json:"username"`
        Message  string `json:"message"`
}

type Client struct {
        Email   string `json:"email"`
        Username string `json:"username"`
}

var clients = make(map[*websocket.Conn]Client)
var broadcast = make(chan Message)
var upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}


func handleConnections(w http.ResponseWriter, r *http.Request) {
        ws, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
                log.Fatal(err)
        }

        defer ws.Close()

        var client Client
        error := ws.ReadJSON(&client)

				if error != nil {
					log.Printf("error on client connect %v", error)
					return
				}

				for current := range clients {
					if client.Username == clients[current].Username {
						log.Printf("fuck off %v", client.Username);
						return;
					}
				}

				clients[ws] = client;

		for {
                var msg Message

                err := ws.ReadJSON(&msg)
                if err != nil {
                        log.Printf("error: %v", err)
                        delete(clients, ws)
                        break
                }

                broadcast <- msg
        }
}

func handleMessages() {
        for {
                msg := <-broadcast

                for client := range clients {
                        err := client.WriteJSON(msg)
                        if err != nil {
                                log.Printf("error: %v", err)
                                client.Close()
                                delete(clients, client)
                        }
                }
        }
}

func handleUsers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET": fmt.Fprintf(w, "Hello sir %v", clients)
	case "POST": fmt.Fprintf(w, "Hello sir, this is a POST")
	default:
		fmt.Fprintf(w, "Only GET method is supported")
	}
}


func main() {
        fs := http.FileServer(http.Dir("./client"))
        http.Handle("/", fs)

        http.HandleFunc("/ws", handleConnections)
				http.HandleFunc("/users", handleUsers)

        go handleMessages()

		log.Println("http server started on :8000")
        err := http.ListenAndServe(":8000", nil)
        if err != nil {
                log.Fatal("ListenAndServe: ", err)
        }
}
