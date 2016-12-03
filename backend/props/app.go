package main

import (
	"github.com/gin-gonic/gin"
)

type Status struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	Build       string `json:"build"`
	Description string `json:"description"`
	Documents   string `json:"documents"`
}


func main() {
	r := gin.Default()

	// Ping test
	r.GET("/status", func(c *gin.Context) {

    serviceStatus := Status {
		    Name:"Annotation search service",
		    Version:"v1",
		    Build:"12-01-2016",
		    Description:"Converts CX format into Cytoscape.js compatible JSON.",
		    Documents: "https://github.com/cyService/service-annotation",
    }

		c.JSON(200, serviceStatus)
	})

	r.Run(":8080")
}
