#!/bin/bash

# This script runs both the React frontend and Flask backend in development mode
# Requires concurrently: npm install -g concurrently

# Ensure virtual environment is activated
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate || source venv/Scripts/activate

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Run both servers
echo "Starting development servers..."
concurrently "npm start" "cd backend && flask run" 