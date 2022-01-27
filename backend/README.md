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

### Running without Docker

Before running the backend service, you can run some additional commands below to handle migrations and seeds:

- To migrate without removing the data

```sh
go run . migrate
```

- To migrate with removing the data

```sh
go run . migrate-fresh
```

- To run the seeder

```sh
go run . seed
```

- To migrate with removing the data and run the seeder

```sh
go run . refresh
```

Finally run the backend service:

```sh
go run .
```

---

## API Endpoint Documentation

### Visitors & Feedback

<details>
<summary><b>Create Visitor</b></summary>
Create a visitor and generate the session id.

- **URL**

  `/api/v1/visitors`

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

  `/api/v1/activities`

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
<summary><b>Create Visitor Feedback by Service ID</b></summary>

- **URL**

  `/api/v1/feedback/:service_id`

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
  "message": "Feedback submitted!",
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

---

### Services

<details>
<summary><b>Create A Service Request By ID</b></summary>
Create a service request by id and create a new visitor_activites record.

- **URL**

  `/api/v1/services/:id`

- **Method**

  `POST`

- **URL Param**

  **Required**

  `id` type `integer`

- **Request Payload**

```json
{
  "session_id": "5ded0fec-beba-4e47-9cd0-705375b582c6",
  "data": {
    "additional_params": {},
    "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/"]
  }
}
```

- **Request Payload Data Type Attributes**

```json
{
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
  },
  "thumbnails": [] // created when bounding_box data is exist
}
```

- **Data Type Attributes**

```json
{
    "message": string,
    "ok": boolean,
    "service_data": object, // json data from service response
    "thumbnails": string array, // png in base64 data with data uri scheme
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
<summary><b>Show All Services</b></summary>
Return json data about all Services.

- **URL**

  `/api/v1/services`

- **Method**

  `GET`

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "type": "analytic",
      "slug": "ocr-ktp",
      "name": "Optical Character Recognition KTP",
      "short_description": "OCR KTP Description",
      "long_description": "OCR KTP Looonng Descriptiooonnn",
      "special_instruction": "Special Instruction for OCR KTP",
      "thumbnail": "ocr-ktp.png",
      "created_at": "2021-10-28T21:44:57.828988+07:00",
      "updated_at": "2021-10-28T21:44:57.828988+07:00"
    },
    {
      "id": 2,
      "type": "solution",
      "slug": "ekyc",
      "name": "Electronic Know Your Customer",
      "short_description": "Electronic Know Your Customer Description",
      "long_description": "Electronic Know Your Customer Looonng Descriptiooonnn",
      "special_instruction": "Special Instruction for LPR",
      "thumbnail": "ekyc.png",
      "created_at": "2021-10-28T21:44:57.828992+07:00",
      "updated_at": "2021-10-28T21:44:57.828992+07:00"
    },
    {
      "id": 3,
      "type": "innovation",
      "slug": "rotten-fruit",
      "name": "Rotten Fruit Detection",
      "short_description": "Rotten Fruit Detection Description",
      "long_description": "Rotten Fruit Detection Looonng Descriptiooonnn",
      "special_instruction": "Special Instruction for Face Match with Enrollment",
      "thumbnail": "rotten-fruit.png",
      "created_at": "2021-10-28T21:44:57.828992+07:00",
      "updated_at": "2021-10-28T21:44:57.828992+07:00"
    }
  ],
  "message": "Get all services success",
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
            "special_instruction": string,
            "thumbnail": string,
            "created_at": string,
            "updated_at": string
        }
    ],
    "message": string,
    "ok": boolean
}
```

</details>

<details>
<summary><b>Show All Services by Type</b></summary>
Return json data about all Services by type.

- **URL**

  `/api/v1/services?type=`

- **Method**

  `GET`

- **URL Param**

  **Required**

  `?type=analytic`

  `?type=solution`

  `?type=innovation`

  `?type=solution-partner`

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
      "special_instruction": "Special Instruction for Face Recognition",
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
            "special_instruction": string,
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
  "message": "Value of argument '?type=' is not valid",
  "ok": false
}
```

</details>

<details>
<summary><b>Show A Service by Slug</b></summary>
Return json data about a Service by slug.

- **URL**

  `/api/v1/services/:slug`

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
    "special_instruction": "Special Instruction for Car Damage Detection",
    "thumbnail": "car-damage.jpeg",
    "created_at": "2021-10-08T23:13:28.755551+07:00",
    "updated_at": "2021-10-08T23:13:28.755551+07:00"
  },
  "message": "Get service by slug=car-damage success",
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
            "special_instruction": string,
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

---

### Solution Services (In Particular)

<details>
<summary><b>Create A Service Request for E-KYC</b></summary>
Create a service request for E-KYC solution.

- **URL**

  `/api/v1/ekyc`

- **Method**

  `POST`

- **Request Payload**

```json
{
  "session_id": "146fdca6-5103-426b-a341-e6fa43db9cd1",
  "data": {
    "face_liveness": {
      "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/"]
    },
    "ocr_ktp": {
      "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/"]
    },
    "face_match": {
      "images": [
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/",
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/"
      ]
    }
  }
}
```

- **Request Payload Data Type Attributes**

```json
{
  "session_id": string,
  "data": object {
    "face_liveness": object {
      "images": string array
    },
    "ocr_ktp": object {
      "images": string array
    },
    "face_match": object {
      "images": string array
    }
  }
}
```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "message": "Service demo request success",
  "ok": true,
  "service_data": {
    "face_liveness": {
      "job": {
        "result": {
          "analytic_type": "FACE_LIVENESS",
          "result": [
            {
              "face_liveness": {
                "live": true,
                "liveness": 0.9963422417640686
              }
            }
          ],
          "status": "success"
        }
      },
      "message": "Face Liveness Success",
      "ok": true
    },
    "ocr_ktp": {
      "job": {
        "result": {
          "analytic_type": "OCR_KTP",
          "result": [
            {
              "agama": "ISLAM",
              "alamat": "GEREM DUSUN KALIMATI",
              "berlaku_hingga": "03-10-2018",
              "golongan_darah": "-",
              "jenis_kelamin": "LAKI-LAKI",
              "kabupaten_kota": "KABUPATEN LAMPUNG SELATAN",
              "kecamatan": "SIDOMULYO",
              "kelurahan_desa": "BANDAR DALAM",
              "kewarganegaraan": "WNI",
              "nama": "SATRIA BAJA HITAM",
              "nik": "1801070310930005",
              "pekerjaan": "BELUM/TIDAK BEKERJA",
              "provinsi": "LAMPUNG",
              "rt_rw": "003/005",
              "status_perkawinan": "BELUM KAWIN",
              "tanggal_lahir": "03-10-1993",
              "tempat_lahir": ""
            }
          ],
          "status": "success"
        }
      },
      "message": "OCR_KTP Service Success",
      "ok": true
    },
    "face_match": {
      "job": {
        "result": {
          "analytic_type": "FACE_MATCH",
          "result": [
            {
              "face_match": {
                "match": false,
                "similarity": 0.45065901198775055
              }
            }
          ],
          "status": "success"
        }
      },
      "message": "The Face Pair Not Match",
      "ok": true
    }
  }
}
```

- **Data Type Attributes**

```json
{
    "message": string,
    "ok": boolean,
    "service_data": object {
      "face_liveness": object, // response is directly from cloud
      "ocr_ktp": object, // response is directly from cloud
      "face_match": object // response is directly from cloud
    }
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
<summary><b>Get Active Face Payment Account by Session ID</b></summary>

- **URL**

  `/api/v1/face-payment/account/:session_id`

- **Method**

  `GET`

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "data": {
    "phone": "081395827314",
    "full_name": "Natasha Romanoff",
    "have_twin": true,
    "balance": 100000,
    "minimum_payment": 50000
  },
  "message": "This session id has an active face payment account",
  "ok": true
}
```

- **Data Type Attributes**

```json
{
   "data":
    {
        "phone": string,
        "full_name": string,
        "have_twin": boolean,
        "balance": integer,
        "minimum_payment": integer
    },
   "message": string,
   "ok": boolean
}
```

- **Sample Error Response**

  **Code**: 404 Not Found

```json
{
  "message": "This session id does not have an active face payment account",
  "ok": false
}
```

</details>

<details>
<summary><b>Create New Face Payment Account</b></summary>
Create a new account for Face Payment solution demonstration.

- **URL**

  `/api/v1/face-payment/account`

- **Method**

  `POST`

- **Request Payload**

```json
{
  "session_id": "5ded0fec-beba-4e47-9cd0-705375b582c6",
  "full_name": "Bruce Wayne",
  "phone": "1337",
  "have_twin": true,
  "data": {
    "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/"]
  }
}
```

- **Request Payload Data Type Attributes**

```json
{
   "session_id": string,
   "full_name": string,
   "phone": string,
   "have_twin": boolean,
   "data": object {
       "images": string array
   }
}
```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "message": "Face payment account registration has been successful",
  "ok": true
}
```

- **Data Type Attributes**

```json
{
   "message": string,
   "ok": boolean
}
```

- **Sample Error Response**

  **Code**: 400 Bad Request

```json
{
  "message": "Liveness result for the inputted image is false",
  "ok": false
}
```

</details>

<details>
<summary><b>Validate New Face Payment Account Data</b></summary>
Validate the inputted data: full name, phone number (it must be unique), and have twin is required before create a new account for Face Payment solution demonstration.

- **URL**

  `/api/v1/face-payment/account`

- **Method**

  `POST`

- **Request Payload**

```json
{
  "session_id": "5ded0fec-beba-4e47-9cd0-705375b582c6",
  "full_name": "Bruce Wayne",
  "phone": "1337",
  "have_twin": true
}
```

- **Request Payload Data Type Attributes**

```json
{
    "session_id": string,
    "full_name": string,
    "phone": string,
    "have_twin": boolean
}
```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "message": "Phone number is valid",
  "ok": true
}
```

- **Data Type Attributes**

```json
{
   "message": string,
   "ok": boolean
}
```

- **Sample Error Response**

  **Code**: 400 Bad Request

```json
{
  "message": "full_name must be at least 2 characters in length",
  "ok": false
}
```

OR

```json
{
  "message": "full_name must be a maximum of 255 characters in length",
  "ok": false
}
```

OR

```json
{
  "message": "phone must be a valid numeric value",
  "ok": false
}
```

OR

```json
{
  "message": "phone must be a valid positive numeric value",
  "ok": false
}
```

OR

```json
{
  "message": "phone number already exist, try to use another number",
  "ok": false
}
```

</details>

<details>
<summary><b>Activate Pin and Create A Wallet of The New Face Payment Account </b></summary>
Activate a new account by adding a pin, updating the minimum payment, and create a new account wallet for face payment solution demonstration.

- **URL**

  `/api/v1/face-payment/account`

- **Method**

  `PATCH`

- **Request Payload**

```json
{
  "session_id": "5ded0fec-beba-4e47-9cd0-705375b582c6",
  "pin": "133007",
  "minimum_payment": 987654
}
```

- **Request Payload Data Type Attributes**

```json
{
    "session_id": string,
    "pin": string,
    "minimum_payment": 50000 <= int <= 1000000
}
```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "message": "Account activation and wallet creation has been successful",
  "ok": true
}
```

- **Data Type Attributes**

```json
{
   "message": string,
   "ok": boolean
}
```

- **Sample Error Response**

  **Code**: 400 Bad Request

```json
{
  "message": "pin must be a valid numeric value",
  "ok": false
}
```

OR

```json
{
  "message": "pin must be a valid positive numeric value",
  "ok": false
}
```

OR

```json
{
  "message": "pin must be a maximum of 6 characters in length",
  "ok": false
}
```

OR

```json
{
  "message": "minimum_payment must be 50,000 or greater",
  "ok": false
}
```

OR

```json
{
  "message": "minimum_payment must be 1,000,000 or less",
  "ok": false
}
```

</details>

<details>
<summary><b>Check Limit Minimum Payment</b></summary>

- **URL**

  `/api/v1/face-payment/check-limit`

- **Method**

  `POST`

- **Request Payload**

```json
{
    "session_id": "9443ea43-52e5-41a7-91dd-bc940001b628",
    "phone": "082189891233",
    "amount": 75000
   }
}
```

- **Request Payload Data Type Attributes**

```json
{
   "session_id": string,
   "phone": string,
   "amount": integer
}
```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "data": [
    {
      "balance": 1000000,
      "full_name": "Natasha Romanoff",
      "have_twin": true,
      "is_limit": false
    }
  ],
  "message": "Check limit minimum payment success",
  "ok": true
}
```

- **Data Type Attributes**

```json
{
   "data": [
       {
           "balance": integer,
           "full_name": string,
           "have_twin": boolean,
           "is_limit": boolean
       }
   ],
   "message": string,
   "ok": boolean
}
```

- **Sample Error Response**

  **Code**: 401 Unauthorized

```json
{
  "message": "Your phone number is wrong",
  "ok": false
}
```

**Code**: 400 Bad Request

```json
{
  "message": "phone is a required field",
  "ok": false
}
```

OR

```json
{
  "message": "amount is a required field",
  "ok": false
}
```

</details>

<details>
<summary><b>Create Transaction Face Payment </b></summary>

- **URL**

  `/api/v1/face-payment/pay`

- **Method**

  `POST`

- **Request Payload**

```json
{
  "session_id": "9443ea43-52e5-41a7-91dd-bc940001b628",
  "phone": "0811112222",
  "pin": "1337",
  "amount": 75000,
  "data": {
    "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/"]
  }
}
```

- **Request Payload Data Type Attributes**

```json
{
   "session_id": string,
   "phone": string,
   "pin": string,
   "amount": integer,
   "data": object {
       "images": string array
   }
}
```

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "message": "Payment transaction success",
  "ok": true
}
```

- **Data Type Attributes**

```json
{
   "message": string,
   "ok": boolean
}
```

- **Sample Error Response**

**Code**: 400 Bad Request

```json
{
  "message": "Face payment has failed, try to get clear image and accordance with guideline.",
  "ok": false
}
```

OR

```json
{
  "message": "Face payment has failed, face does not match the registered face.",
  "ok": false
}
```

**Code**: 401 Unauthorized

```json
{
  "message": "Wrong pin!",
  "ok": false
}
```

**Code**: 402 Payment Required

```json
{
  "message": "Your balance is not enough to make this transaction",
  "ok": false
}
```

</details>

<details>
<summary><b>Reset Balance Face Payment Account</b></summary>
Reset balance of face payment account to 1000000 (default)
- **URL**

`/api/v1/face-payment/reset-balance/:session_id`

- **Method**

  `PATCH`

- **Sample Success Response**

  **Code**: 200 OK

```json
{
  "message": "The balance in this account has been reset successfully",
  "ok": true
}
```

- **Data Type Attributes**

```json
{
   "message": string,
   "ok": boolean
}
```

- **Sample Error Response**

  **Code**: 404 Not Found

```json
{
  "message": "This session id does not have an active face payment account",
  "ok": false
}
```

</details>

<details>
<summary><b>Create A Service Request for Passive Face Liveness Detection</b></summary>
Create a service request for Passive Face Liveness Detection solution.

- **URL**

  `/api/v1/passive-liveness`

- **Method**

  `POST`

- **Request Payload**

```json
{
  "session_id": "5ded0fec-beba-4e47-9cd0-705375b582c6",
  "data": {
    "additional_params": {},
    "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/"]
  }
}
```

- **Request Payload Data Type Attributes**

```json
{
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
    "message": "Service demo request success",
    "ok": true,
    "service_data": {
        "job": {
            "id": "1b3a6871b093fd2906b7672d848a7005f2ac5d3bdb91de29GIYDEMRNGAYS2MRX",
            "result": {
                "analytic_type": "FACE_LIVENESS",
                "result": [
                    {
                        "face_liveness": {
                            "live": false,
                            "liveness": 0.00418900465592742
                        }
                    }
                ],
                "status": "success"
            }
        },
        "message": "Face Liveness Underqualified",
        "ok": true
    }
}
```

- **Data Type Attributes**

```json
{
    "message": string,
    "ok": boolean,
    "service_data": object, 
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