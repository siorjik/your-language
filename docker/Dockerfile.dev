FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json /app
COPY pnpm-lock.yaml /app/

COPY . .

RUN pnpm install

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3001

# RUN pnpm build

# CMD [ "pnpm", "start" ]
# CMD [ "pnpm", "dev" ]
ENTRYPOINT ["/entrypoint.sh"]
