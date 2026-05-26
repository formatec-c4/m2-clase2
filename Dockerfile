FROM python:3.12-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends default-mysql-client python3-flask python3-pymysql \
    && rm -rf /var/lib/apt/lists/*

COPY app ./app

EXPOSE 8000

CMD ["/usr/bin/python3", "app/app.py"]
