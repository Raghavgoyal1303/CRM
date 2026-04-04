# Staging Deployment Guide (Phase 2)

This guide outlines how to set up your staging environment on **Railway.app**, which is the recommended platform for your production transition.

## Prerequisites

1.  **Railway Account**: Sign up at [Railway.app](https://railway.app/).
2.  **GitHub Repository**: Push your current codebase to a private GitHub repository.

---

## Step 1: Initialize Railway Project

1.  Click **"New Project"** → **"Deploy from GitHub repo"**.
2.  Select your `LeadFlow-CRM` repository.
3.  Railway will automatically detect the `backend` and `frontend` folders (if nested, you may need to add them as separate services).

## Step 2: Set Up Database (MySQL)

1.  On your Railway dashboard, click **"New"** → **"Database"** → **"Add MySQL"**.
2.  Once created, click the MySQL service, go to **"Connect"**, and copy the connection variables.

## Step 3: Configure Backend Variables

In the Backend service settings on Railway, add these **Variables**:

| Variable | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` (Railway internal link) |
| `DB_USER` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `DB_NAME` | `${{MySQL.MYSQLDATABASE}}` |
| `JWT_SECRET` | (Your secure 64-char secret) |
| `SENTRY_DSN` | (Paste your Sentry Node.js DSN here) |
| `CORS_ORIGIN` | `https://your-frontend-url.up.railway.app` |

## Step 4: Configure Frontend Variables

In the Frontend service settings:

| Variable | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-backend-url.up.railway.app` |
| `VITE_SENTRY_DSN` | (Paste your Sentry React DSN here) |

## Step 5: Automated Migrations

Railway will automatically run `npm run migrate` if you add it to your start command, or you can run it manually via the Railway CLI or dashboard terminal:
```bash
npx knex migrate:latest
```

## Step 6: Verify Deployment

1.  Visit your backend URL `/health` (e.g., `https://api.railway.app/health`).
2.  It should return `{"status": "OK", "database": "Connected", ...}`.
3.  Login to your frontend and verify that leads and call history are loading correctly.

> [!TIP]
> **Uptime Monitoring**: Once your staging backend is live, go to [UptimeRobot.com](https://uptimerobot.com/) and create a "HTTP(s) Monitor" pointing to your `/health` endpoint.
