FROM python:3

RUN apt-get -y update
RUN apt-get -y upgrade

WORKDIR /usr/src/app

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# HEALTHCHECK --start-period=5s CMD ["python", "./src/healthcheck.py"]

# add production env
ENV FLASK_ENV production
ENV FLASK_APP src/main.py

CMD ["python", "-m", "flask", "run" , "--host=0.0.0.0", "--port=5000"]
