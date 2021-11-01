FROM golang:1.17-alpine3.14 AS build

WORKDIR /go/src/app

COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go install

FROM alpine:3.14 AS runtime

WORKDIR /app

COPY --from=build /go/bin/backend /usr/bin/

EXPOSE 8080
ENV GIN_MODE=release

CMD ["backend"]