FROM node:20-alpine AS builder

ARG MODE

RUN echo "build mode - $MODE"

RUN npm install -g pnpm

WORKDIR /app

COPY package.json /app
COPY pnpm-lock.yaml /app

RUN pnpm install

COPY . .

EXPOSE 3001

RUN if [ "$MODE" = "migration" ]; then \
      echo "migration mode"; \
    else \
      echo "start mode"; \
    fi
