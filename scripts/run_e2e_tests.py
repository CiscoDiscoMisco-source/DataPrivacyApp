#!/usr/bin/env python
import os
import sys
import subprocess
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_env_from_file(env_file):
    """Load environment variables from a .env file"""
    if not os.path.exists(env_file):
        logger.error(f"Environment file not found: {env_file}")
        return False
    
    logger.info(f"Loading environment variables from {env_file}")
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            key, value = line.split('=', 1)
            # Remove quotes if present
            value = value.strip().strip('"\'')
            os.environ[key] = value
    
    return True

def run_e2e_tests():
    """Run the end-to-end tests"""
    # Get the root directory of the project
    root_dir = Path(__file__).parent.parent.absolute()
    
    # Set up environment from .env file
    env_file = os.path.join(root_dir, '.env')
    if not load_env_from_file(env_file):
        logger.error("Failed to load environment variables")
        return False
    
    # Check if Supabase credentials are available
    if not os.environ.get('SUPABASE_URL') or not os.environ.get('SUPABASE_SERVICE_ROLE_KEY'):
        logger.error("Supabase credentials not found in environment variables")
        return False
    
    # Run the tests
    test_file = os.path.join(root_dir, 'tests', 'test_e2e_company_creation.py')
    logger.info(f"Running end-to-end tests from {test_file}")
    
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pytest", test_file, "-v"],
            cwd=root_dir,
            check=True
        )
        logger.info("End-to-end tests completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"End-to-end tests failed with exit code {e.returncode}")
        return False

if __name__ == "__main__":
    success = run_e2e_tests()
    sys.exit(0 if success else 1) 