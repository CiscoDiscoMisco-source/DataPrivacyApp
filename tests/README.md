# End-to-End Tests

This directory contains end-to-end tests for the Data Privacy App. These tests interact with actual services like Supabase to verify the full functionality of the application.

## Test Files

- `test_e2e_company_creation.py`: Tests the end-to-end process of creating and querying a company in Supabase.

## Prerequisites

Before running the end-to-end tests, make sure you have:

1. Python 3.8 or higher installed
2. Environment variables set up with Supabase credentials (see below)
3. Development dependencies installed: `pip install -r backend/requirements-dev.txt`

## Environment Setup

The tests require Supabase credentials to be available in the environment. These can be provided in a `.env` file at the root of the project with the following variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

For security reasons, the service role key should only be used for testing and never in production code.

## Running the Tests

You can run the end-to-end tests using the provided script:

```bash
python scripts/run_e2e_tests.py
```

Or manually using pytest:

```bash
# From the project root
pytest tests/test_e2e_company_creation.py -v
```

## Network Connection Test

All test files include an automatic network connection test that runs before the actual test cases. This ensures that:

1. The Supabase URL is reachable
2. The credentials provided are valid
3. The database connection is working properly

The connection test automatically retries up to 3 times with a 2-second delay between attempts, providing helpful error messages if the connection fails. This early validation prevents test failures due to connectivity issues and helps with troubleshooting.

Example output of a successful connection test:

```
INFO:__main__:Verifying network connection to Supabase...
INFO:__main__:Supabase URL status: 200
INFO:__main__:Connecting to Supabase (Attempt 1/3)...
INFO:__main__:Connection to Supabase successful
```

## Table Structure

The end-to-end tests are designed to work with the current structure of the Supabase database tables. The `companies` table is expected to have the following structure:

```
- id (auto-generated)
- name
- logo
- industry
- website
- description
- size_range
- city
- country
```

If the database schema changes, you may need to update the test fixtures in `test_e2e_company_creation.py` to match the new structure.

## Test Cleanup

The tests are designed to clean up after themselves by deleting any test data created during the test run. If a test fails unexpectedly, you may need to manually delete test companies from the database. 