FROM golang

WORKDIR /go

# This is the default GOPATH for this container.
ADD . /go/src/github.com/ericsage/deepcell
WORKDIR /go/src/github.com/ericsage/deepcell

RUN go get

# Build the server for this environment
RUN go build main.go

# Default Service Port is 3000
EXPOSE 8888

# Run it!
CMD ./main