# Script to clean up the frontend structure
# This script helps consolidate the frontend codebase and remove duplications

Write-Host "Starting frontend cleanup process..." -ForegroundColor Green

# Define all necessary frontend directories
$directories = @(
    "frontend/pages",
    "frontend/public",
    "frontend/src/components/layout",
    "frontend/src/components/auth",
    "frontend/src/components/company",
    "frontend/src/components/common",
    "frontend/src/components/preference",
    "frontend/src/components/settings",
    "frontend/src/contexts",
    "frontend/src/hooks",
    "frontend/src/services",
    "frontend/src/utils",
    "frontend/src/styles"
)

# Create directories if they don't exist
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created $dir directory" -ForegroundColor Yellow
    } else {
        Write-Host "$dir directory already exists" -ForegroundColor Cyan
    }
}

# Check for duplicate files between src and frontend/src
if (Test-Path src) {
    Write-Host "Checking for files in src directory..." -ForegroundColor Cyan
    
    $sourceFiles = Get-ChildItem -Path "src" -Recurse -File | Where-Object { $_.Extension -match "\.(js|jsx|ts|tsx|css)$" }
    
    Write-Host "Found $($sourceFiles.Count) files in src directory" -ForegroundColor Yellow
    
    Write-Host "Review these files and consider manually moving unique code to the frontend directory" -ForegroundColor Yellow
}

Write-Host "Frontend cleanup process completed." -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review component organization in frontend/src/components" -ForegroundColor Cyan
Write-Host "2. Ensure all imports are updated to reflect the new structure" -ForegroundColor Cyan
Write-Host "3. Update API service endpoints to match backend routes" -ForegroundColor Cyan 