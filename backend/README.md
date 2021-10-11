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
```sh
docker-compose up -d --build
```

### Running without Docker
```sh
go run .
```


## API Endpoint Documentation
<details>
<summary><b>Show All Services by Type</b></summary>
Return json data about all Services by type.

- **URL**
    
    `/services?type=`
- **Method**

    `GET`
- **URL Param**

    **Required**

    `?type=analytic`

    `?type=solution`
    
    `?type=innovation`
- **Sample Success Response**

    **Code**: 200 OK
```json
{
    "data": [
        {
            "id": 1,
            "type": "analytic",
            "slug": "face-recognition",
            "name": "Face Recognition",
            "short_description": "Face Recoginition Description",
            "long_description": "Face Recoginition Descriptiooooooooooonnnnnnnnnnnnnn",
            "thumbnail": "face-recognition.jpeg",
            "created_at": "2021-10-07T13:36:26.892822+07:00",
            "updated_at": "2021-10-07T13:36:26.892822+07:00"
        }
    ],
    "message": "Get all analytics service success",
    "ok": true
}
```

- **Data Type Attributes**
```json
{
    "data": [
        {
            "id": integer,
            "type": string,
            "slug": string,
            "name": string,
            "short_description": string,
            "long_description": string,
            "thumbnail": string,
            "created_at": string,
            "updated_at": string
        }
    ],
    "message": string,
    "ok": boolean
}
```

- **Sample Error Response**

    **Code**: 400 Bad Request
```json
{
    "message": "Value of argument 'type' is not recognized.",
    "ok": false
}
```
OR
```json
{
    "message": "Expected 1 argument 'type'.",
    "ok": false
}
```
</details>

<details>
<summary><b>Show a Service by ID</b></summary>
Return json data about a Service by ID.

- **URL**
    
    `/services/:id`
- **Method**

    `GET`
- **URL Param**

    **Required**

    `id` type `integer`
- **Sample Success Response**

    **Code**: 200 OK
```json
{
    "data": {
        "id": 6,
        "type": "innovation",
        "slug": "car-damage",
        "name": "Car Damage Detection",
        "short_description": "Car Damage Detection Description",
        "long_description": "Car Damage Detection Descriptiooooooooooonnnnnnnnnnnnnn",
        "thumbnail": "car-damage.jpeg",
        "created_at": "2021-10-08T23:13:28.755551+07:00",
        "updated_at": "2021-10-08T23:13:28.755551+07:00"
    },
    "message": "Get service by id=6 success",
    "ok": true
}
```

- **Data Type Attributes**
```json
{
    "data": [
        {
            "id": integer,
            "type": string,
            "slug": string,
            "name": string,
            "short_description": string,
            "long_description": string,
            "thumbnail": string,
            "created_at": string,
            "updated_at": string
        }
    ],
    "message": string,
    "ok": boolean
}
```

- **Sample Error Response**

    **Code**: 404 Not Found
```json
{
    "message": "Service not found",
    "ok": false
}
```
</details>