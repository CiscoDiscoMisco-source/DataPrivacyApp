# Backend Management Script for Data Privacy App
# This script helps with backend maintenance tasks

param (
    [Parameter()]
    [switch]$TestConnections,
    
    [Parameter()]
    [switch]$CleanCache,
    
    [Parameter()]
    [switch]$CreateMigration,
    
    [Parameter()]
    [string]$MigrationMessage,
    
    [Parameter()]
    [switch]$Help
)

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent $scriptPath

# Helper function to activate the virtual environment
function Activate-Venv {
    $venvPath = Join-Path $rootPath "venv"
    $activateScript = Join-Path $venvPath "Scripts" "Activate.ps1"
    
    if (-not (Test-Path $activateScript)) {
        Write-Host "Virtual environment not found. Creating one..." -ForegroundColor Yellow
        $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
        if (-not $pythonCmd) {
            Write-Host "Python not found. Please install Python first." -ForegroundColor Red
            exit 1
        }
        
        Set-Location $rootPath
        python -m venv venv
        if (-not $?) {
            Write-Host "Failed to create virtual environment." -ForegroundColor Red
            exit 1
        }
    }
    
    # Activate the virtual environment
    & $activateScript
}

# Print usage information
function Show-Help {
    Write-Host "Data Privacy App Backend Management Script" -ForegroundColor Cyan
    Write-Host "Usage: .\scripts\manage-backend.ps1 [options]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -TestConnections       Test database and service connections" -ForegroundColor White
    Write-Host "  -CleanCache            Clean up cache files and temporary data" -ForegroundColor White
    Write-Host "  -CreateMigration       Create a new database migration" -ForegroundColor White
    Write-Host "  -MigrationMessage      Message for the migration (used with -CreateMigration)" -ForegroundColor White
    Write-Host "  -Help                  Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\scripts\manage-backend.ps1 -TestConnections" -ForegroundColor White
    Write-Host "  .\scripts\manage-backend.ps1 -CreateMigration -MigrationMessage 'Add user preferences table'" -ForegroundColor White
}

# Test database and service connections
function Test-Connections {
    Write-Host "Testing backend connections..." -ForegroundColor Cyan
    
    # Activate virtual environment and run the connection test
    Activate-Venv
    
    Set-Location (Join-Path $rootPath "backend")
    
    Write-Host "Testing Supabase connection..." -ForegroundColor Yellow
    python -c "from app.utils.supabase_client import test_connection; print(test_connection())"
    
    Write-Host "Testing database connection..." -ForegroundColor Yellow
    python -c "from app import create_app, db; app = create_app(); app.app_context().push(); print(f'Database connected: {db.engine.connect() is not None}')"
    
    Write-Host "Connection tests completed." -ForegroundColor Green
}

# Clean up cache and temporary files
function Clean-Cache {
    Write-Host "Cleaning backend cache..." -ForegroundColor Cyan
    
    # Remove pycache directories
    $pycacheDirectories = Get-ChildItem -Path (Join-Path $rootPath "backend") -Recurse -Filter "__pycache__" -Directory
    foreach ($dir in $pycacheDirectories) {
        Write-Host "Removing $($dir.FullName)" -ForegroundColor Yellow
        Remove-Item -Path $dir.FullName -Recurse -Force
    }
    
    # Remove other temp files
    $tempFiles = Get-ChildItem -Path (Join-Path $rootPath "backend") -Recurse -Include "*.pyc", "*.pyo", ".coverage", ".pytest_cache" -File
    foreach ($file in $tempFiles) {
        Write-Host "Removing $($file.FullName)" -ForegroundColor Yellow
        Remove-Item -Path $file.FullName -Force
    }
    
    Write-Host "Cache cleaning completed." -ForegroundColor Green
}

# Create a new database migration
function Create-Migration {
    param(
        [string]$Message
    )
    
    if (-not $Message) {
        Write-Host "Error: Migration message is required." -ForegroundColor Red
        Write-Host "Example: -CreateMigration -MigrationMessage 'Add user table'" -ForegroundColor Yellow
        return
    }
    
    Write-Host "Creating database migration: $Message" -ForegroundColor Cyan
    
    # Activate virtual environment
    Activate-Venv
    
    # Create migration
    Set-Location (Join-Path $rootPath "backend")
    flask db migrate -m "$Message"
    
    Write-Host "Migration created. Remember to review and apply it with 'flask db upgrade'." -ForegroundColor Green
}

# Main script logic
if ($Help) {
    Show-Help
    exit 0
}

if ($TestConnections) {
    Test-Connections
}

if ($CleanCache) {
    Clean-Cache
}

if ($CreateMigration) {
    Create-Migration -Message $MigrationMessage
}

# If no options specified, show help
if (-not ($TestConnections -or $CleanCache -or $CreateMigration -or $Help)) {
    Show-Help
} 