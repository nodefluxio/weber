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
cp .env.example .env
npm install
npm run dev
```

App will be available on <http://localhost:3000>

### Running with docker

#### Development

```sh
cd frontend
cp .env.example .env.local
docker build -t <your_username>/weber-frontend-dev -f dev.Dockerfile .
docker run -p 3000:3000 --env-file .env.local <your_username>/weber-frontend-dev
```

#### Production

```sh
cd frontend
cp .env.example .env.production.local
docker build -t <your_username>/weber-frontend .
docker run -p 3000:3000 --env-file .env.production.local -it <your_username>/weber-frontend
```

App will be available on <http://localhost:3000>

### list current available pages

- <http://localhost:3000>
- <http://localhost:3000/request-demo>
