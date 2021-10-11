<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Have npm installed (for running in local)
- Have Docker installed (for running with docker)
- Clone the repo
  ```sh
  https://github.com/nodefluxio/weber.git
  ```

### Running in local

```sh
cd frontend
npm run dev
```

App will be available on http://localhost:3000

### Running with docker

#### Development

```sh
cd frontend
docker build -t <your_username>/weber-frontend-dev -f dev.Dockerfile .
docker run -p 3000:3000 <your_username>/weber-frontend-dev
```

#### Production

```sh
cd frontend
docker build -t <your_username>/weber-frontend .
docker run -p 3000:3000 -it <your_username>/weber-frontend
```

App will be available on http://localhost:3000

### list current available pages

- http://localhost:3000
- http://localhost:3000/request-demo
