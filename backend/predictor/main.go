package main


//import (
//	"log"
//	"fmt"
//	"net/http"
//	"github.com/ericsage/deepcell/dc"
//	"github.com/golang/protobuf/protoc-gen-go/grpc"
//	"io/ioutil"
//	"encoding/json"
//	"os"
//)
//
//func handler(w http.ResponseWriter, r *http.Request) {
//	fmt.Fprintf(w, "test")
//}
//
//func main() {
//	log.Println("Start.")
//	http.HandleFunc("/", handler) // ハンドラを登録してウェブページを表示させる
//	http.ListenAndServe(":8080", nil)
//	log.Println("Done.")
//}
//
//package main

import (
"context"
"encoding/json"
"io/ioutil"
"log"
"net/http"
"os"

"github.com/ericsage/deepcell/dc"

"google.golang.org/grpc"
)

type Response struct {
	Data   *dc.TermReply `json:"data"`
	Errors []string      `json:"errors"`
}

var (
	tls        = getenv("tls", "false")
	serverAddr = getenv("SERVER_ADDRESS", "biancone.ucsd.edu")
	serverPort = getenv("SERVER_PORT", "5000")
)

func getenv(key, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}

func processTerms(terms []string) *dc.TermReply {
	log.Println("About to open connection")
	address := serverAddr + ":" + serverPort
	log.Println(address)
	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		panic("Could not connect to the deep cell server!")
	}
	log.Println("Dialed server")
	defer conn.Close()
	client := dc.NewRequestClient(conn)
	termRequest := &dc.TermRequest{
		Terms:         terms,
		OntologyType:  "GO",
		UseGrowthData: false,
	}
	log.Println("About to process request")
	termReply, err := client.ProcessTerms(context.Background(), termRequest)
	if err != nil {
		panic(err)
	}
	return termReply
}

func deepcellHandler(w http.ResponseWriter, r *http.Request) {
	defer catchError()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic("Could not read request body!")
	}
	var terms []string
	err = json.Unmarshal(body, &terms)
	if err != nil {
		panic("Could not decode json into term list!")
	}
	log.Println(terms)
	termReply := processTerms(terms)
	res := &Response{
		Data:   termReply,
		Errors: []string{},
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
	http.HandleFunc("/", deepcellHandler)
	http.ListenAndServe(":8080", nil)
}

