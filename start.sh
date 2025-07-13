#!/bin/bash

# Stock 101 Telegram MiniApp Startup Script

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found!"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed!"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed!"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create log directory
mkdir -p logs

# Start the application
echo "Starting Stock 101 Telegram MiniApp..."
echo "Server will be available at: https://stock101.stekir.com"
echo "Telegram bot: @$(node -e "console.log(require('dotenv').config().parsed.BOT_TOKEN.split(':')[0])" 2>/dev/null || echo 'unknown')"

# Run the server
NODE_ENV=production node server.js 2>&1 | tee logs/app.log 