#!/bin/sh

# Wait for Postgres to be ready
echo "⏳ Waiting for Postgres at $DATABASE_URL..."
until nc -z -v -w30 db 5432
do
  echo "Waiting for database connection..."
  sleep 2
done

# Run migrations
echo "🚀 Running migrations..."
pnpm migrate

# Run seeds
echo "🚀 Running seeds..."
pnpm seed

# Build the Next.js app
echo "🚀 Building Next.js app..."
pnpm build

# Start the Next.js app
echo "🚀 Starting Next.js app..."
pnpm start
