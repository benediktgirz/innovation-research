# Database Setup Guide

This guide covers setting up Vercel KV database storage for the innovation research platform.

## Overview

The research platform now includes database storage for:
- Participant responses to the Key Research Question
- Contact information and metadata
- Analytics and reporting capabilities
- CSV/JSON data export functionality

## Required Environment Variables

### 1. Vercel KV Database
```bash
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

### 2. Data Access (Optional but Recommended)
```bash
DATA_ACCESS_TOKEN=your_secure_token_for_data_retrieval
```

### 3. Email Configuration (Already configured)
```bash
RESEND_API_KEY=your_resend_api_key
NOTIFICATION_EMAIL=research@benedikt-girz.com
FROM_EMAIL=research@benedikt-girz.com
```

## Setup Instructions

### Step 1: Create Vercel KV Database

1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to "Storage" tab
4. Click "Create Database"
5. Select "KV" (Redis-compatible)
6. Choose a name like "research-data"
7. Select your preferred region

### Step 2: Get Environment Variables

1. After creating the KV database, go to the "Settings" tab
2. Copy the REST API URL and Token
3. In your Vercel project settings, add these environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### Step 3: Configure Data Access Token

1. Generate a secure token for data retrieval access
2. Add `DATA_ACCESS_TOKEN` environment variable
3. This protects the `/api/data` endpoint

### Step 4: Deploy

1. Push your code changes to trigger deployment
2. Verify environment variables are set in Vercel dashboard
3. Test the integration

## API Endpoints

### Data Collection: `/api/participate`
- Accepts form submissions
- Stores data in Vercel KV
- Sends email notifications
- Returns success/error status

### Data Retrieval: `/api/data`
- Requires Bearer token authentication
- Supports JSON and CSV export
- Includes analytics and reporting
- Query parameters:
  - `format=csv` for CSV export
  - `export_type=analytics` for analytics data

## Data Structure

Each participation record includes:
```typescript
{
  id: string;              // UUID
  club_name: string;       // Club/organization name
  role: string;            // Participant role
  email: string;           // Contact email
  innovation: string;      // Key Research Question response
  language: string;        // Form language (en, de, fr, es, it)
  submitted_at: string;    // ISO timestamp
  ip_address: string;      // Client IP address
}
```

## Testing

1. Submit a test form to verify data storage
2. Access `/api/data?format=json` to retrieve data
3. Test CSV export with `/api/data?format=csv`
4. Check analytics with `/api/data?export_type=analytics`

## Security Features

- Bearer token authentication for data access
- CORS headers configured
- Email privacy protection in logs
- Error handling without data exposure
- Optional database fallback logging

## Analytics Capabilities

The system tracks:
- Total responses
- Language distribution
- Role distribution
- Top participating clubs
- Response timeline
- Latest submissions preview

## Backup and Export

- CSV export includes all participant data
- JSON export maintains data structure
- Analytics provide insights and trends
- Data can be migrated to external systems if needed