FROM node:20-alpine AS builder

ARG MODE

RUN echo "build mode - $MODE"

RUN npm install -g pnpm

WORKDIR /app

COPY package.json /app
COPY pnpm-lock.yaml /app/

RUN pnpm install

COPY . .

RUN if [ "$MODE" = "migration" ]; then \
      echo "migration mode" &&\
      pnpm migrate &&\
      pnpm seed; \
    else \
      echo "start mode" &&\
      EXPOSE 3001 &&\
      pnpm build &&\
      CMD ["pnpm", "start"]; \
    fi
