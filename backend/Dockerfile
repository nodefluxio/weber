FROM golang:1.17-alpine3.14 AS build

WORKDIR /go/src/app

COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go install

FROM alpine:3.14 AS runtime

WORKDIR /app

COPY --from=build /go/bin/backend /usr/bin/
COPY docker-entrypoint.sh .
RUN apk add dos2unix --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community/ --allow-untrusted
RUN dos2unix docker-entrypoint.sh && chmod +x docker-entrypoint.sh

EXPOSE 8080
ENV GIN_MODE=release

ENTRYPOINT [ "sh", "docker-entrypoint.sh" ] 