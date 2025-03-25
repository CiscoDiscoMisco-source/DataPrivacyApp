@echo off
echo Starting Data Privacy App development environment...

:: Check if virtual environment exists, if not create it
if not exist venv (
  echo Creating virtual environment...
  python -m venv venv
)

:: Activate virtual environment
call venv\Scripts\activate.bat

:: Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

:: Install frontend dependencies
if not exist node_modules (
  echo Installing frontend dependencies...
  npm install
)

:: Start backend server in a new window
start cmd /k "call venv\Scripts\activate.bat && cd backend && flask run"

:: Start frontend server
echo Starting frontend server...
npm start 