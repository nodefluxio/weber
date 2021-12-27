# Weber 

In physics, [Weber (Wb)](https://en.wikipedia.org/wiki/Weber_(unit)) is the SI derived unit of magnetic flux. This project is initiated philosophically like a magnetic surface for [nodeflux.io](https://nodeflux.io) to engage potential users or partners interactively by experiencing nodeflux's analytics and solution through web browser. Currently, Weber provides demonstrations and trials for some nodeflux analytics, solutions, and new innovations. 

## Getting started

### Documentations
- For [Frontend](https://github.com/nodefluxio/weber/tree/main/frontend#getting-started)
- For [Backend](https://github.com/nodefluxio/weber/tree/main/backend#weber-backend)

### Prerequisites

- Docker
- Docker-Compose

### Setting up Env.

```bash
$ cp .env.example .env
```

Copy and edit .env file to set the required access key for nodeflux's analytics API and overwrite preset settings

### Running the App

```bash
$ docker-compose --env-file .env up
```

Suply argument `--build` to `docker-compose` command to rebuild the images. After running the containers using docker-compose, by default nginx will forward port `80` on the container to port `8000` on the host machine [Click-Me](http://localhost:8000/) to avoid requesting permission when running the app.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
