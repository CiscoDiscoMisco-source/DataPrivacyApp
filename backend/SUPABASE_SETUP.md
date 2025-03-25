# Supabase Database Setup Guide

This guide helps you set up your application to work with Supabase as your PostgreSQL database provider for deployment on Vercel.

## Prerequisites

1. [Supabase](https://supabase.com/) account
2. Access to your project's Supabase dashboard
3. [Vercel](https://vercel.com/) account for hosting

## Steps to Configure Supabase Database

### 1. Create a Supabase Project

1. Log in to your Supabase account at [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Enter a name for your project
4. Set a secure database password (save this for later)
5. Choose your region
6. Click "Create New Project"

### 2. Get Connection Information

1. In your Supabase project dashboard, go to "Settings" > "Database"
2. Under "Connection Info", find your connection string details:
   - Host: `db.[YOUR-PROJECT-REF].supabase.co`
   - Database Name: `postgres`
   - Port: `5432`
   - User: `postgres`
   - Password: (the password you set when creating the project)

### 3. Configure Environment Variables

1. Copy the `.env.supabase.example` file to `.env`:
   ```
   cp .env.supabase.example .env
   ```

2. Edit the `.env` file with your actual Supabase credentials:
   ```
   POSTGRES_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   SUPABASE_KEY=[YOUR-ANON-KEY]
   SUPABASE_JWT_SECRET=[YOUR-JWT-SECRET]
   ```

   You can find these values in your Supabase dashboard:
   - Project URL and anon key: Go to "Settings" > "API"
   - JWT Secret: Go to "Settings" > "API" > "JWT Settings"

### 4. Test Your Connection

Run the provided script to check your connection:

```
python scripts/check_supabase_connection.py
```

If successful, you should see a confirmation message.

### 5. Run Database Migrations

Initialize and run migrations to set up your database schema:

```
flask db init     # Only if you haven't initialized migrations yet
flask db migrate -m "Initial migration"
flask db upgrade
```

## Using Supabase in Horizontally Scaling Environments

If you're deploying to:
- Serverless functions (like Vercel Functions)
- Edge functions
- Horizontally auto-scaling deployments

Use Supabase's connection pooler in transaction mode:

1. In your Supabase dashboard, go to "Settings" > "Database" 
2. Under "Connection Pooling", find the transaction mode connection string
3. Update your `.env` file to use this connection string instead:
   ```
   POSTGRES_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF]-pooler.supabase.co:6543/postgres
   ```

This setup will automatically use `NullPool` for proper connection handling in Vercel's serverless environment.

## Setting Up Environment Variables in Vercel

1. In your Vercel dashboard, navigate to your project
2. Go to "Settings" > "Environment Variables"
3. Add all the necessary environment variables from your `.env` file
4. Make sure to set `NODE_ENV=production` and `FLASK_ENV=production`

## Troubleshooting

- **Connection Errors**: Ensure your IP is allowed in Supabase. Go to "Settings" > "Database" > "Network Restrictions"
- **Too Many Connections**: Monitor your connection usage in Supabase dashboard metrics
- **SSL Issues**: Make sure your connection string includes `?sslmode=require` if needed 