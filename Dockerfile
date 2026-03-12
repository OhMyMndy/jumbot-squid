FROM docker.io/oven/bun:1.3.10


RUN mkdir -p /app

WORKDIR /app

COPY package.json /app
COPY bun.lock /app

RUN bun install

COPY . /app

CMD bun run start
