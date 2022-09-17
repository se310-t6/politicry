# Politicry

![A comic of a crying man with yellow hair](https://camo.githubusercontent.com/1851fbb05a7492b6e79caeb8664d3d394b69cf3efe5327bedc167ff75240b27f/68747470733a2f2f63646e2e646973636f72646170702e636f6d2f6174746163686d656e74732f3931303735333430313339333030303436312f313030333538393436383933363232343833382f556e7469746c65645f417274776f726b2e706e67)

[![codecov](https://codecov.io/gh/se310-t6/politicry/branch/main/graph/badge.svg?token=JSL2O5JZNP)](https://codecov.io/gh/se310-t6/politicry)

Politicry is a browser extension to filter political posts from your feed on popular social media sites such as Reddit. Currently, we only support the Chrome browser, but in the future hope to expand support to include other browsers, such as Firefox.

## Installation
<!-- TODO -->
TODO

## Prerequisites
- Install yarn: `npm install --global yarn`
- Install [Docker](https://docs.docker.com/get-docker/). You may also need to install the WSL 2 Linux kernel if Docker Desktop prompts you to.
- Open Docker Desktop
- Clone this repository and open it in the terminal.

## Development
**Run Backend:**
```bash
docker-compose -f docker-compose.dev.yml up -d # start the backend

## other useful commands ##

docker-compose -f docker-compose.dev.yml logs -f # view logs of backend
docker-compose -f docker-compose.dev.yml down # stop the backend
```
If this does not work, please try the top solution [here](https://stackoverflow.com/questions/41117421/ps1-cannot-be-loaded-because-running-scripts-is-disabled-on-this-system)

**Build Extension:**
```bash
cd extension
yarn # install modules

# build the extension, this will export to extension/dist
yarn build
ENVIRONMENT=dev yarn build # for Linux
```

## Deployment

```bash
cp .example.env .env

docker-compose -f docker-compose.yml --env-file .env up -d
```

## Licensing and Contribution
Unless otherwise specified, all contributions will be licensed under MIT. For further details see the [contributing guidelines](./CONTRIBUTING_GUIDELINES.md).
