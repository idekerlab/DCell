package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Ping test
	r.GET("/status", func(c *gin.Context) {
		c.String(200, "Annotation search service")
	})

	r.Run(":8080")
}
