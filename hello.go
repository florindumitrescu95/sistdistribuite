package main

import (
		"fmt"
		"log"
		"net/http"

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

var clients = make(map[*websocket.Conn]Client) // connected clients
var broadcast = make(chan Message)           // broadcast channel
var upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}


func handleConnections(w http.ResponseWriter, r *http.Request) {
        // Upgrade initial GET request to a websocket
        ws, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
                log.Fatal(err)
        }

        // Make sure we close the connection when the function returns
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

				// Register our new client
				clients[ws] = client;

		for {
                var msg Message
                // Read in a new message as JSON and map it to a Message object
                err := ws.ReadJSON(&msg)
                if err != nil {
                        log.Printf("error: %v", err)
                        delete(clients, ws)
                        break
                }
                // Send the newly received message to the broadcast channel
                broadcast <- msg
        }
}

func handleMessages() {
        for {
                // Grab the next message from the broadcast channel
                msg := <-broadcast
                // Send it out to every client that is currently connected
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
        // Create a simple file server
        fs := http.FileServer(http.Dir("./client"))
        http.Handle("/", fs)

		// Configure websocket route
        http.HandleFunc("/ws", handleConnections)
				http.HandleFunc("/users", handleUsers)

		// Start listening for incoming chat messages
        go handleMessages()

		log.Println("http server started on :8000")
        err := http.ListenAndServe(":8000", nil)
        if err != nil {
                log.Fatal("ListenAndServe: ", err)
        }
}
