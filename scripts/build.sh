#!/bin/bash

# Stop on first error
set -e

# Build React frontend
echo "Building React frontend..."
npm run build

# Prepare backend
echo "Setting up Python environment..."
if [ ! -d "venv" ]; then
  python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate || source venv/Scripts/activate

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "Build complete! Run 'flask run' to start the backend server."
echo "The React frontend has been built to the 'build' directory." 