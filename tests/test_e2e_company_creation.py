import os
import pytest
import uuid
import time
import requests
from supabase import create_client
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Supabase client fixture
@pytest.fixture
def supabase_client():
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")  # Using service role key for tests
    
    if not supabase_url or not supabase_key:
        pytest.skip("Supabase credentials not found in environment variables")
    
    return create_client(supabase_url, supabase_key)

@pytest.fixture(scope="session", autouse=True)
def verify_supabase_connection():
    """Verify that the Supabase database is accessible before running any tests"""
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not supabase_key:
        pytest.skip("Supabase credentials not found in environment variables")
    
    logger.info("Verifying network connection to Supabase...")
    
    # First check if the URL is reachable
    try:
        response = requests.head(supabase_url, timeout=5)
        logger.info(f"Supabase URL status: {response.status_code}")
    except requests.RequestException as e:
        logger.error(f"Could not reach Supabase URL: {e}")
        pytest.fail(f"Network connection to Supabase failed: {e}")
    
    # Try to create a client and execute a simple query
    max_retries = 3
    retry_delay = 2  # seconds
    
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Connecting to Supabase (Attempt {attempt}/{max_retries})...")
            client = create_client(supabase_url, supabase_key)
            
            # Execute a simple query to check if the connection works
            response = client.table("companies").select("count").limit(1).execute()
            logger.info(f"Connection to Supabase successful, received data: {response}")
            return  # Connection successful
        except Exception as e:
            logger.error(f"Error connecting to Supabase (Attempt {attempt}/{max_retries}): {e}")
            if attempt < max_retries:
                time.sleep(retry_delay)
            else:
                logger.error("Maximum connection attempts reached")
                pytest.fail(f"Failed to connect to Supabase after {max_retries} attempts: {e}")

@pytest.fixture
def dummy_company_data():
    """Create unique dummy company data for testing"""
    unique_id = str(uuid.uuid4())[:8]
    return {
        "name": f"Test Company {unique_id}",
        "industry": "Technology",
        "website": f"https://test-company-{unique_id}.com",
        "description": "A test company created for E2E testing",
        "size_range": "1-10",
        "city": "Test City",
        "country": "Test Country"
    }

def test_create_company_e2e(supabase_client, dummy_company_data):
    """End-to-end test for creating a company in Supabase"""
    # STEP 1: Create the company
    logger.info(f"Creating test company: {dummy_company_data['name']}")
    response = supabase_client.table("companies").insert(dummy_company_data).execute()
    
    assert response.data, "No data returned from company creation"
    assert len(response.data) == 1, "Expected exactly one company to be created"
    
    created_company = response.data[0]
    company_id = created_company["id"]
    
    assert company_id, "Company ID should be present"
    assert created_company["name"] == dummy_company_data["name"], "Company name doesn't match"
    
    logger.info(f"Successfully created company with ID: {company_id}")
    
    # STEP 2: Verify the company exists in the database
    verify_response = supabase_client.table("companies").select("*").eq("id", company_id).execute()
    
    assert verify_response.data, "No data returned when verifying company"
    assert len(verify_response.data) == 1, "Expected exactly one company in verification"
    assert verify_response.data[0]["id"] == company_id, "Company ID doesn't match in verification"
    
    logger.info(f"Successfully verified company exists in database")
    
    # STEP 3: Clean up - Delete the test company
    try:
        delete_response = supabase_client.table("companies").delete().eq("id", company_id).execute()
        assert delete_response.data, "No data returned when deleting company"
        logger.info(f"Successfully deleted test company")
    except Exception as e:
        logger.error(f"Error cleaning up test company: {e}")
        pytest.fail(f"Failed to clean up test company: {e}")

def test_create_and_query_company_e2e(supabase_client, dummy_company_data):
    """End-to-end test for creating a company and then querying it by different fields"""
    # STEP 1: Create the company
    response = supabase_client.table("companies").insert(dummy_company_data).execute()
    assert response.data, "No data returned from company creation"
    created_company = response.data[0]
    company_id = created_company["id"]
    
    try:
        # STEP 2: Query by name
        name_query = supabase_client.table("companies").select("*").eq("name", dummy_company_data["name"]).execute()
        assert name_query.data, "Could not query company by name"
        assert name_query.data[0]["id"] == company_id, "Company ID doesn't match in name query"
        
        # STEP 3: Query by website
        website_query = supabase_client.table("companies").select("*").eq("website", dummy_company_data["website"]).execute()
        assert website_query.data, "Could not query company by website"
        assert website_query.data[0]["id"] == company_id, "Company ID doesn't match in website query"
        
        logger.info(f"All queries for company {company_id} successful")
    finally:
        # Clean up - Delete the test company
        supabase_client.table("companies").delete().eq("id", company_id).execute()
        logger.info(f"Test cleanup: Deleted company {company_id}") 