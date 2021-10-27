# Weber Backend

Backend REST API service for weber, Nodeflux Demo Application.  
ERD: https://dbdiagram.io/d/614d6c6b825b5b0146113ba7

## Getting Started

### Requirements

- [Go](https://golang.org/doc/install) >= 1.17
- [Gin](https://github.com/gin-gonic/gin) >= 1.7.4
- [Gorm](https://gorm.io/index.html) >= 1.21.15
- [Docker](https://docs.docker.com/get-docker/) >= 20
- [PostgreSQL](https://www.postgresql.org/download/) >= 12

more details about dependencies see [go.mod &rarr;](https://github.com/nodefluxio/weber/blob/main/backend/go.mod)

---

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

---

## API Endpoint Documentation

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

- **Request Payload Data Type Attributes**

```json
{
  "full_name": string,
  "email": string,
  "company": string,
  "job_title": string,
  "industry": string
}
```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "data": [
    {
      "max_age": 86400,
      "session_id": "6a099599-cabf-4b99-bba6-bc37326dcd00"
    }
  ],
  "message": "Data has been processed successfully",
  "ok": true
}
```

- **Response Data Type Attributes**

```json
{
  "data": [
    {
      "max_age": int,
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

<details>
<summary><b>Create Visitor Activities</b></summary>
Create a visitor activity.

- **URL**

  `/activities`
- **Method**

  `POST`

- **Request Payload**

```json
{
  "service_id": 1,
  "session_id": "ecec7960-5fd0-43eb-8794-11d1e9ac00a1",
  "completeness": 80
}
```

- **Request Payload Data Type Attributes**

```json
{
  "service_id": int,
  "session_id": string,
  "completeness": int,
}
```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "message": "Data has been processed successfully",
  "ok": true
}
```

- **Response Data Type Attributes**

```json
{
  "message": string,
  "ok": boolean
}
```

- **Sample Error Response**

  **Code**: 401 Unauthorized

```json
{
  "message": "Session ID is not valid",
  "ok": false
}
```

OR

```json
{
  "message": "Session ID has expired",
  "ok": false
}
```

</details>

<details>
<summary><b>Create A Service Request By ID</b></summary>
Create a service request by id and create a new visitor_activites record.

- **URL**

  `/services/:id`

- **Method**

  `POST`

- **URL Param**

  **Required**

  `id` type `integer`

- **Request Payload**
```json
{
   "analytic_name" : "ocr-ktp", 
   "session_id": "5ded0fec-beba-4e47-9cd0-705375b582c6",
   "data": {
       "additional_params": {},
       "images": [
         "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/"
       ]
   }
}
```

Note: `analytic_name` only be required on analytics that are part of the solution service, so it can be omitted when requesting an independent analytics service.

- **Request Payload Data Type Attributes**
```json
{
   "analytic_name" : string,
   "session_id": string,
   "data": object {
       "additional_params": object,
       "images": string array
   }
}

```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "message": "Service demo request success", // message from weber backend
  "ok": true, // ok from weber backend
  "service_data": {
    "job": {
      "result": {
        "analytic_type": "FACE_RECOGNITION",
        "result": [
          {
            "face_recognition": [
              {
                "candidates": [
                  {
                    "confidence": 1,
                    "face_id": "88364589938376705",
                    "variation": "17614081020751468384"
                  }
                ]
              }
            ]
          }
        ],
        "status": "success"
      }
    },
    "message": "Face Recognition Success", // message from service response
    "ok": true // ok from service response
  }
}
```

- **Data Type Attributes**

```json
{
    "message": string,
    "ok": boolean,
    "service_data": object // json data from service response
}
```

- **Sample Error Response**

  **Code**: 401 Unauthorized

```json
{
  "message": "Session ID is not valid",
  "ok": false
}
```

OR

```json
{
  "message": "Session ID has expired",
  "ok": false
}
```

**Code**: 400 Bad Request

```json
{
  "message": "Expected an integer value from argument 'id'",
  "ok": false
}
```

</details>

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
<summary><b>Show A Service by Slug</b></summary>
Return json data about a Service by slug.

- **URL**

  `/services/:slug`
- **Method**

  `GET`

- **URL Param**

  **Required**

  `slug` type `string`

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
  "message": "Get service by slug=ocr-ktp success",
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

<details>
<summary><b>Create Visitor Feedback by Service ID</b></summary>

- **URL**

  `/feedback/:service_id`
- **Method**

  `POST`

- **URL Param**

  **Required**

  `service_id` type `integer`

- **Request Payload**

Note: attribute `comment` is required when rating less than equal 3, when rating is 4 or 5 the `comment` become optional.

```json
{
   "session_id": "12827c26-2052-4b6b-aa9a-e85a0eca6a34",
   "rating": 3,
   "comment": "This feauture need some improvement"
}
```

```json
{
   "session_id": "12827c26-2052-4b6b-aa9a-e85a0eca6a34",
   "rating": 5,
   "comment": ""
}
```

- **Request Payload Data Type Attributes**
```json
{
   "session_id": string,
   "rating": integer,
   "comment": string
}

```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
    "message": "Feedback submited!",
    "ok": true
}
```

- **Data Type Attributes**

```json
{
    "message": string,
    "ok": boolean,
}
```

- **Sample Error Response**

  **Code**: 401 Unauthorized

```json
{
  "message": "Session ID is not valid",
  "ok": false
}
```

OR

```json
{
  "message": "Session ID has expired",
  "ok": false
}
```

**Code**: 400 Bad Request

```json
{
  "message": "Your comment for this feedback is required",
  "ok": false
}
```
This error will appear if visitor give rating below 4.

```json
{
  "message": "rating is a required field",
  "ok": false
}
```
This error will appear if visitor do not give feedback rating.

```json
{
  "message": "rating must be 5 or less",
  "ok": false
}
```
This error will appear if visitor give feedback rating more than 5.

</details>