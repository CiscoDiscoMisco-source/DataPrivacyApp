import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/

// Define enums outside of the schema
const DataCategory = {
  PERSONAL: 'PERSONAL',
  CONTACT: 'CONTACT',
  FINANCIAL: 'FINANCIAL',
  HEALTH: 'HEALTH',
  LOCATION: 'LOCATION',
  BEHAVIORAL: 'BEHAVIORAL',
  TECHNICAL: 'TECHNICAL',
  OTHER: 'OTHER'
};

const SharingStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED'
};

const NotificationFrequency = {
  IMMEDIATE: 'IMMEDIATE',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  NEVER: 'NEVER'
};

const schema = a.schema({
  // User model
  User: a
    .model({
      email: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      passwordHash: a.string().required(),
      isActive: a.boolean().default(true),
      isAdmin: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // Token package model
  TokenPackage: a
    .model({
      name: a.string().required(),
      amount: a.integer().required(),
      price: a.float().required(),
      description: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'update', 'delete']),
    ]),

  // Company model
  Company: a
    .model({
      name: a.string().required(),
      description: a.string(),
      website: a.string(),
      industry: a.string(),
      sizeRange: a.string(),
      country: a.string(),
      state: a.string(),
      city: a.string(),
      address: a.string(),
      postalCode: a.string(),
      phone: a.string(),
      isActive: a.boolean().default(true),
      ownerId: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  // DataType model
  DataType: a
    .model({
      name: a.string().required(),
      description: a.string(),
      category: a.string().required(),  // We'll validate against DataCategory values
      isSensitive: a.boolean().default(false),
      retentionPeriod: a.integer(),
      isRequired: a.boolean().default(false),
      validationRules: a.json(),
      isActive: a.boolean().default(true),
      companyId: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  // DataSharingTerm model
  DataSharingTerm: a
    .model({
      purpose: a.string().required(),
      duration: a.integer(),
      conditions: a.json(),
      status: a.string().default('PENDING'),  // We'll validate against SharingStatus values
      startDate: a.datetime(),
      endDate: a.datetime(),
      terminationReason: a.string(),
      isActive: a.boolean().default(true),
      companyId: a.string().required(),
      dataTypeId: a.string().required(),
      sharedById: a.string().required(),
      sharedWithId: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // UserPreferences model
  UserPreferences: a
    .model({
      userId: a.string().required(),
      emailNotifications: a.boolean().default(true),
      notificationFrequency: a.string().default('IMMEDIATE'),  // We'll validate against NotificationFrequency values
      notificationTypes: a.json(),
      dataSharingPreferences: a.json(),
      privacyLevel: a.string().default('balanced'),
      theme: a.string().default('light'),
      language: a.string().default('en'),
      timezone: a.string(),
      dataRetentionPeriod: a.integer(),
      autoDeleteData: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

// Export the enum constants for client-side validation
export { DataCategory, SharingStatus, NotificationFrequency };

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
