# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your e-commerce application.

## 1. Google Cloud Console Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "Salvatt E-commerce")
4. Click "Create"

### Step 2: Enable Google+ API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" 
3. Click on it and press "Enable"

### Step 3: Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: Salvatt Lingerie
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email addresses for testing)
6. Save and continue

### Step 4: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Configure:
   - **Name**: Salvatt E-commerce Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:4200` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/google/callback` (development)
     - `https://yourapi.com/api/auth/google/callback` (production)
5. Click "Create"
6. **IMPORTANT**: Copy the Client ID and Client Secret

## 2. Backend Configuration

### Step 1: Update Environment Variables
1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update your `.env` file with the Google OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret-here"
   BASE_URL="http://localhost:3000"
   FRONTEND_URL="http://localhost:4200"
   ```

### Step 2: Run Database Migration
The Google OAuth functionality requires a database schema update:
```bash
cd backend
npx prisma migrate dev
```

### Step 3: Start the Backend Server
```bash
cd backend
npm run dev
```

## 3. Frontend Configuration

The frontend is already configured to work with Google OAuth. No additional setup needed.

## 4. Testing the OAuth Flow

### Step 1: Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd salvatt
npm start
```

### Step 2: Test the Login Flow
1. Go to `http://localhost:4200/login`
2. Click "Continuar com Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to your app with a token
5. The app should automatically log you in

## 5. Troubleshooting

### Common Issues:

**Error: "Google OAuth is not configured"**
- Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in your `.env` file
- Restart the backend server after updating environment variables

**Error: "redirect_uri_mismatch"**
- Check that your redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/api/auth/google/callback`
- Make sure there are no trailing slashes or extra characters

**Error: "access_denied"**
- Make sure your email is added as a test user in the OAuth consent screen
- Check that the required scopes (`email`, `profile`) are configured

**Error: "invalid_client"**
- Double-check your Client ID and Client Secret
- Make sure you're using the correct credentials for the right environment

### Debug Mode:
To see detailed OAuth logs, check your backend console when testing the login flow.

## 6. Production Deployment

When deploying to production:

1. **Update Google Cloud Console**:
   - Add your production domain to "Authorized JavaScript origins"
   - Add your production API callback URL to "Authorized redirect URIs"

2. **Update Environment Variables**:
   ```env
   BASE_URL="https://your-api-domain.com"
   FRONTEND_URL="https://your-frontend-domain.com"
   ```

3. **Publish OAuth Consent Screen**:
   - In Google Cloud Console, go to "OAuth consent screen"
   - Click "Publish App" to make it available to all users

## 7. Security Notes

- Never commit your `.env` file to version control
- Use different OAuth credentials for development and production
- Regularly rotate your Client Secret
- Monitor OAuth usage in Google Cloud Console
- Consider implementing rate limiting for OAuth endpoints

## 8. User Experience

After successful OAuth setup:
- Users can sign in with their Google account
- New users are automatically created in your database
- Existing users with matching emails are linked to their Google account
- Users get a seamless login experience without passwords

The OAuth flow creates users with:
- Email from Google account
- Name from Google profile
- Default role: CUSTOMER
- Google ID for future logins
