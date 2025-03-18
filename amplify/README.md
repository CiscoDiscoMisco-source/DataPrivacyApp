# Amplify Backend Configuration

This directory contains the AWS Amplify backend configuration for the Data Privacy Management App.

## Data Models

The following data models have been defined in `amplify/data/resource.ts`:

### User

Represents an application user with tokens for making preference changes.

- `email`: String (required) - User's email address
- `name`: String (required) - User's name
- `tokens`: Integer (required) - User's token balance

### TokenPackage

Represents token packages that can be purchased.

- `name`: String (required) - Package name
- `amount`: Integer (required) - Number of tokens
- `price`: Float (required) - Price of the package
- `description`: String - Description of the package

### Company

Represents a company that collects user data.

- `name`: String (required) - Company name
- `logo`: String - URL to company logo
- `industry`: String (required) - Industry category
- `description`: String - Company description

### DataSharingPolicy

Represents a data sharing policy for a company.

- `dataType`: String (required) - Type of data being shared
- `purpose`: String (required) - Purpose of data collection
- `thirdParties`: String[] - List of third parties data is shared with
- `description`: String - Detailed description of the policy
- `companyId`: String (required) - Reference to the company

### Preference

Represents a user's preference for data sharing.

- `dataType`: String (required) - Type of data
- `allowed`: Boolean (required) - Whether sharing is allowed
- `isGlobal`: Boolean (required) - Whether this is a global preference
- `companyId`: String - Reference to the company (null for global preferences)
- `userId`: String (required) - Reference to the user

## Authorization

- Public data access: Companies and data sharing policies are readable by everyone
- Private user data: Preferences are owner-controlled with authenticated read access
- Token packages: Can be read by authenticated users, managed by owners

## Connecting to the API

To generate a client for using the Amplify API in your frontend code:

```javascript
// In your frontend code
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

// Example: list all companies
const { data: companies } = await client.models.Company.list();
``` 