@echo off
echo Starting Data Privacy App development environment...

:: Check if virtual environment exists, if not create it
if not exist venv (
  echo Creating virtual environment...
  python -m venv venv
  echo Installing backend dependencies...
  call venv\Scripts\activate.bat
  cd backend
  pip install -r requirements.txt
  cd ..
) else (
  echo Virtual environment already exists.
)

:: Activate virtual environment
call venv\Scripts\activate.bat

:: Check for backend dependencies updates
echo Checking for backend dependency updates...
cd backend
pip install -r requirements.txt
cd ..

:: Install frontend dependencies if needed
if not exist node_modules (
  echo Installing frontend dependencies...
  npm install
) else (
  echo Frontend dependencies already installed.
)

:: Start both servers
echo Starting development servers...
start cmd /k "call venv\Scripts\activate.bat && cd backend && flask run"
echo Starting frontend server...
cd frontend && npm run dev 