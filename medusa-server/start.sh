#!/bin/sh
set -e

echo "==================================="
echo "Pimp your Home - Medusa Server"
echo "==================================="

echo "Running database migrations..."
npx medusa db:migrate

echo "Seeding database with sample data..."
npm run seed || echo "Seeding skipped or already completed"

echo "Starting Medusa server..."
npm run start
