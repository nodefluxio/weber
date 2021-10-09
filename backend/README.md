# Weber Backend

Backend REST API service for weber, Nodeflux Demo Application.

## Getting Started

### Requirements

- [Go](https://golang.org/doc/install) >= 1.17
- [Gin](https://github.com/gin-gonic/gin) >= 1.7.4
- [Gorm](https://gorm.io/index.html) >= 1.21.15
- [PostgreSQL](https://www.postgresql.org/download/) >= 12

more details about dependencies see [go.mod &rarr;](https://github.com/nodefluxio/weber/blob/main/backend/go.mod)

### Running with Docker

#### Development

```sh
soon
```

#### Production

```sh
soon
```

### Running without Docker

Make sure you're now in `backend/` directory.

Linux / MacOS Terminal & Windows CMD

```sh
cd backend/
```

#### Development

```sh
go run .
```

#### Production

```sh
soon
```

### API Endpoint Documentation

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
            "type": enum,
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
<summary><b>Create Visitor</b></summary>
Create a visitor and generate the session id.

- **URL**
  `/visitors`
- **Method**

  `POST`

- **Request Payload**

```json
{
  "full_name": "Lazuardy Khatulistiwa",
  "email": "lazuardy@nodeflux.io",
  "company": "Nodeflux",
  "job_title": "Software Engineer",
  "industry": "Computer Vision"
}
```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "data": [
    {
      "session_id": "6a099599-cabf-4b99-bba6-bc37326dcd00"
    }
  ],
  "message": "Data has been processed successfully",
  "ok": true
}
```

- **Data Type Attributes**

```json
{
  "data": [
    {
      "session_id": string
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
  "message": "job_title must be at least 2 characters in length",
  "ok": false
}
```

OR

```json
{
  "message": "email is invalid",
  "ok": false
}
```

</details>
