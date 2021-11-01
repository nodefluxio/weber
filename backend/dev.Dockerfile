# syntax=docker/dockerfile:1
FROM golang:1.17-alpine

# Set the working directory inside the image
WORKDIR /usr/src/app

COPY go.mod /usr/src/app
COPY go.sum /usr/src/app

RUN go mod download

COPY . /usr/src/app

EXPOSE 8080

CMD ["go", "run", "."]