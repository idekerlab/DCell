package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/idekerlab/DCell/backend/predictor/dc"
	"google.golang.org/grpc"

	"github.com/rs/cors"
)

type Response struct {
	Data   *dc.Reply `json:"data"`
	Errors []string  `json:"errors"`
}

var (
	tls        = getenv("tls", "false")
	serverAddr = getenv("SERVER_ADDRESS", "biancone.ucsd.edu")
	serverPort = getenv("SERVER_PORT", "5001")
	labels     = []string{"ontology"}
)

func getenv(key, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}

func knockout(growth bool, ontology string, genes []string) (*dc.Reply, error) {
	log.Println("About to open connection")
	log.Println("Growth is set to", growth, "ontology is set to", ontology)
	address := serverAddr + ":" + serverPort
	log.Println(address)
	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	log.Println("Dialed server")
	defer conn.Close()
	client := dc.NewDeepCellClient(conn)
	req := &dc.Request{
		Genes:    genes,
		Ontology: ontology,
		Growth:   growth,
	}
	log.Println("About to process request")
	rep, err := client.Run(context.Background(), req)
	if err != nil {
		return nil, err
	}
	return rep, nil
}

func deepcellHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	//// CORS support
	w.Header().Set("Access-Control-Allow-Origin", "*")

	defer catchError()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic("Could not read request body!")
	}

	url := r.URL
	ontology := url.Query().Get("ontology")
	if ontology == "" {
		ontology = "GO"
	}
	growth := url.Query().Get("growth")
	var genes []string
	err = json.Unmarshal(body, &genes)
	if err != nil {
		panic("Could not decode json into genes list!")
	}
	errors := []string{}
	termReply, err := knockout(growth == "true", ontology, genes)
	if err != nil {
		termReply = &dc.Reply{}
		errors = []string{err.Error()}
		w.WriteHeader(http.StatusInternalServerError)
	}
	res := &Response{
		Data:   termReply,
		Errors: errors,
	}
	json.NewEncoder(w).Encode(res)
}

func catchError() {
	if r := recover(); r != nil {
		//Send response json error response here
		log.Println(r)

	}
}

func main() {
	log.Println("Starting server...")
	mux := http.NewServeMux()
	handler := cors.Default().Handler(mux)

	mux.HandleFunc("/", deepcellHandler)
	http.ListenAndServe(":8888", handler)
}
