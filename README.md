<h1 align="center">
	<br>
	<img width="300" src="./public/images/chesspecker-logo.png" alt="chesspecker logo">
	<br>
	<br>
	<br>
</h1>

> chesspecker, open-source app to practice chess!

[![LINTER](https://github.com/chesspecker/chesspecker/actions/workflows/lint.yml/badge.svg)](https://github.com/chesspecker/chesspecker/actions/workflows/lint.yml)

#### Discord

Join us to discuss issues and ideas: on [discord.](https://discord.com/invite/qDftJZBBHa)

### Run in local

Create a new .env file

```
cp .env.example .env
```

After launching docker on your machine, build the images with:

```
docker-compose up -d --build
```

Finally, connect to the docker container and populate the database:

```
docker exec -it mongo /bin/sh
mongorestore dump --gzip
```

Navigate to http://localhost:3000

And happy coding!

When you're done

```
docker-compose down
```
