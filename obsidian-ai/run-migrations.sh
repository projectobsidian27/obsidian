#!/bin/bash

# Obsidian Database Migration Script
# Run this to set up your PostgreSQL database on Render

echo "🗄️  Obsidian Database Migration"
echo "================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo ""
  echo "Please set it first:"
  echo "  export DATABASE_URL='your-render-postgres-url'"
  echo ""
  echo "You can find this in your Render dashboard under your PostgreSQL database's 'Connect' tab"
  exit 1
fi

echo "📡 Connecting to database..."
echo ""

# Run the migration
psql "$DATABASE_URL" -f apps/web/migrations/000_initial_setup.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration completed successfully!"
  echo ""
  echo "Verifying tables..."
  psql "$DATABASE_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
else
  echo ""
  echo "❌ Migration failed. Please check the error messages above."
  exit 1
fi
