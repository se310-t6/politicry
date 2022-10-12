# Politicry

![Test](https://github.com/se310-t6/politicry/actions/workflows/test.yml/badge.svg)
![Healthcheck](https://github.com/se310-t6/politicry/actions/workflows/healthcheck.yml/badge.svg)
![Sonarcloud](https://github.com/se310-t6/politicry/actions/workflows/sonarcloud.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=bugs)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=coverage)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)
[![codecov](https://codecov.io/gh/se310-t6/politicry/branch/main/graph/badge.svg?token=JSL2O5JZNP)](https://codecov.io/gh/se310-t6/politicry)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=se310-t6_politicry&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=se310-t6_politicry)

![A comic of a crying man with yellow hair](https://camo.githubusercontent.com/1851fbb05a7492b6e79caeb8664d3d394b69cf3efe5327bedc167ff75240b27f/68747470733a2f2f63646e2e646973636f72646170702e636f6d2f6174746163686d656e74732f3931303735333430313339333030303436312f313030333538393436383933363232343833382f556e7469746c65645f417274776f726b2e706e67)

Politicry is a browser extension to filter political posts from your feed on popular social media sites such as Reddit. Currently, we only support the Chrome browser, but in the future hope to expand support to include other browsers, such as Firefox.

## Installation

1. Download and unzip the latest [release](https://github.com/se310-t6/politicry/releases). 
2. Visit `chrome://extensions/` in your Chrome browser.
3. Toggle Developer mode.
4. Click on the "Load unpacked" button.
5. Select the unzipped folder.
6. The Politicry extension card should show in your list of extensions.

### For Developers
If you would like to download the current, unreleased version of the extension in this repository:
1. Build the extension as per the instructions below.
2. Follow the instructions above, using the `politicy/extension/dist` folder instead. 

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

**Run Tests for Extension**

```bash
cd extension
yarn test # (or "npm test")

# to collect code coverage, and run all tests immediately, use this command instead:
yarn test:ci
```

**Run Tests for Website**

```bash
cd website
yarn test # (or "npm test")
```

**Run Code formatter and lint tool**

```bash
# cd into the root directory of this repository
yarn # first time only
yarn lint
```

Running this script will fix any formatting issues and report issues that could not be fixed.

## Deployment

```bash
cp .example.env .env

docker-compose -f docker-compose.yml --env-file .env up -d
```

## Licensing and Contribution

Unless otherwise specified, all contributions will be licensed under MIT. For further details see the [contributing guidelines](./CONTRIBUTING_GUIDELINES.md).
