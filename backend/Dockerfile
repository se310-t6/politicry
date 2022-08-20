ARG IMAGE=python:3
FROM $IMAGE

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y postgresql

WORKDIR /usr/src/app

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=3000
ENV HOST=localhost

# HEALTHCHECK CMD curl --fail "http://${HOST}:${PORT}/healthcheck" || exit 1

CMD ["./scripts/start.sh"]
