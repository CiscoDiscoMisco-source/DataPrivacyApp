# Amplify Backend Configuration

This directory contains the AWS Amplify backend configuration for the Data Privacy Management App.

## Data Models

The following data models have been defined in `amplify/data/resource.ts`:

### User

Represents an application user with authentication capabilities.

- `email`: String (required) - User's email address
- `firstName`: String (required) - User's first name
- `lastName`: String (required) - User's last name
- `passwordHash`: String (required) - Hashed password
- `isActive`: Boolean - User account status
- `isAdmin`: Boolean - Administrator status
- `createdAt`: DateTime - Account creation timestamp
- `updatedAt`: DateTime - Last update timestamp

### Company

Represents a company that collects and manages user data.

- `name`: String (required) - Company name
- `description`: String - Company description
- `website`: String - Company website
- `industry`: String - Industry category
- `sizeRange`: String - Company size range
- `country`: String - Country
- `state`: String - State/province
- `city`: String - City
- `address`: String - Street address
- `postalCode`: String - Postal code
- `phone`: String - Contact phone number
- `isActive`: Boolean - Company status
- `ownerId`: String (required) - Reference to the owner user
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp

### DataType

Represents different types of data that companies collect.

- `name`: String (required) - Name of the data type
- `description`: String - Detailed description
- `category`: Enum (required) - Category of data
- `isSensitive`: Boolean - Whether the data is sensitive
- `retentionPeriod`: Integer - Retention period in days
- `isRequired`: Boolean - Whether the data is required
- `validationRules`: JSON - Validation rules
- `isActive`: Boolean - Status of the data type
- `companyId`: String (required) - Reference to the company
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp

### DataSharingTerm

Represents data sharing agreements between companies.

- `purpose`: String (required) - Purpose of data sharing
- `duration`: Integer - Duration in days
- `conditions`: JSON - Sharing conditions
- `status`: Enum - Status of the agreement
- `startDate`: DateTime - Start date of sharing
- `endDate`: DateTime - End date of sharing
- `terminationReason`: String - Reason for termination
- `isActive`: Boolean - Status of the agreement
- `companyId`: String (required) - Reference to the company
- `dataTypeId`: String (required) - Reference to the data type
- `sharedById`: String (required) - Reference to the user sharing data
- `sharedWithId`: String (required) - Reference to the user receiving data
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp

### UserPreferences

Represents user preferences and settings.

- `userId`: String (required) - Reference to the user
- `emailNotifications`: Boolean - Whether to send email notifications
- `notificationFrequency`: Enum - Frequency of notifications
- `notificationTypes`: JSON - Types of notifications to receive
- `dataSharingPreferences`: JSON - Data sharing preferences
- `privacyLevel`: String - Privacy level setting
- `theme`: String - UI theme preference
- `language`: String - Language preference
- `timezone`: String - Timezone preference
- `dataRetentionPeriod`: Integer - Data retention period in days
- `autoDeleteData`: Boolean - Whether to auto-delete data
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp

## Authorization

- User data: Accessible by owner with authenticated read access
- Company data: Accessible by owner with public read access
- DataType: Accessible by owner with public read access
- DataSharingTerm: Accessible by owner with authenticated read access
- UserPreferences: Accessible by owner with authenticated read access

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