# Docker Compose Instructions

## Build Instructions

### Docker File

Run this command to build the docker image for DEVELOPMENT

```bash
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -f docker-compose.dev.yml build
```

Run this command to build the docker image for DEVELOPMENT

```bash
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -f docker-compose.production.yml build
```

### Docker Compose Instructions

#### Run Containers

```bash
docker compose -f docker-compose.dev.yml up -d
```
