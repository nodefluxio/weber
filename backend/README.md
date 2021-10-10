# Weber Backend
Backend REST API service for weber, Nodeflux Demo Application.

## Getting Started
### Requirements
- [Go](https://golang.org/doc/install) >= 1.17
- [Gin](https://github.com/gin-gonic/gin) >= 1.7.4
- [Gorm](https://gorm.io/index.html) >= 1.21.15
- [Docker](https://docs.docker.com/get-docker/) >= 20
- [PostgreSQL](https://www.postgresql.org/download/) >= 12

more details about dependencies see [go.mod &rarr;](https://github.com/nodefluxio/weber/blob/main/backend/go.mod)

- - -

## Run Backend API
- First of all, make sure you're now in `backend/` directory.

    - Linux / MacOS Terminal & Windows CMD
        ```sh
        cd backend/
        ```
- Copy or rename file `.env.example` to `.env`.
- Edit the `.env` to your desire database credentials.

### Running with Docker
#### Development
```sh
docker-compose -f docker-compose-dev.yml up --build
```
#### Production
```sh
docker-compose up -d --build
```

- - -

### Running without Docker
#### Development
```sh
go run .
```
#### Production
```sh
soon
```
