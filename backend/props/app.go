package main

import (
	//"github.com/gin-gonic/gin"
	//elastic "gopkg.in/olivere/elastic.v5"
	//"fmt"
	"net/http"
	"github.com/labstack/echo"
)

type Status struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	Build       string `json:"build"`
	Description string `json:"description"`
	Documents   string `json:"documents"`
}

func main() {

	//client, err := elastic.NewClient()
	//if err != nil {
	//	// Handle error
	//	panic(err)
	//}

	//q := elastic.NewTermQuery("termid", "dna repair")
	//searchResult, err := client.Search().
	//	Index("terms").   // search in index "twitter"
	//	Query(q).   // specify the query
	//	Sort("name", true). // sort by "user" field, ascending
	//	From(0).Size(10).   // take documents 0-9
	//	Pretty(true).       // pretty print request and response JSON
	//	Do()               // execute
	//if err != nil {
	//	// Handle error
	//	panic(err)
	//}
	//
	//// searchResult is of type SearchResult and returns hits, suggestions,
	//// and all kinds of other information from Elasticsearch.
	//fmt.Printf("Query took %d milliseconds\n", searchResult.TookInMillis)


	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		serviceStatus := Status{
			Name:"Annotation search service",
			Version:"v1",
			Build:"12-20-2016",
			Description:"Property server.",
			Documents: "https://github.com/cyService/service-annotation",
		}
		return c.JSON(http.StatusOK, serviceStatus)
	})
	e.Logger.Fatal(e.Start(":1323"))



	//r := gin.Default()
	//
	//// Ping test
	//r.GET("/status", func(c *gin.Context) {
	//
	//	serviceStatus := Status{
	//		Name:"Annotation search service",
	//		Version:"v1",
	//		Build:"12-01-2016",
	//		Description:"Converts CX format into Cytoscape.js compatible JSON.",
	//		Documents: "https://github.com/cyService/service-annotation",
	//	}
	//
	//	c.JSON(200, serviceStatus)
	//})
	//
	//r.Run(":8080")
}
