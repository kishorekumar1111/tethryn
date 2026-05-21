# Supabase Storage Setup Guide

To make file uploads work in your application using Supabase, you must perform these steps in the Supabase Dashboard.

## 1. Create a Storage Bucket
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Click on **Storage** in the left sidebar.
4. Click **New Bucket**.
5. Name it `uploads`.
6. Set it to **Public** (so you can get public URLs for your media).
7. Click **Save**.

## 2. Set up Storage Policies (RLS)
By default, buckets are protected. You need to allow uploads.
1. In the Storage section, go to **Policies**.
2. Find the `uploads` bucket.
3. Click **New Policy**.
4. Choose **Allow upload access for authenticated users** (or for everyone if you want purely public access).
5. For a simple demo/public setup, you can use:
   - **Policy Name**: `Public Upload`
   - **Allowed operations**: `INSERT`, `SELECT`
   - **Target roles**: `authenticated` (recommended) or `anon` (less secure)
   - **CHECK expression**: `true` (or restrict by folder/user if needed)

## 3. Configure Environment Variables
Add your Supabase credentials to the AI Studio Secrets or `.env` file:
- `VITE_SUPABASE_URL`: Found in Project Settings -> API
- `VITE_SUPABASE_ANON_KEY`: Found in Project Settings -> API

---
### Why choose Supabase Storage?
Supabase Storage is a great alternative to Firebase Storage, offering a simple S3-compatible API and easy integration with Postgres tables if you decide to keep track of your files there later.
