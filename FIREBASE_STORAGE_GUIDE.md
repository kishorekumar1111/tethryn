# Firebase Storage Deployment Guide

To make file uploads work in your Tethryn application, you must perform these manual steps in the Firebase Console.

## 1. Enable Cloud Storage
The build tool sets up Firestore and Auth, but **Cloud Storage** must be enabled manually:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. In the left sidebar, click on **Build** -> **Storage**.
4. Click **Get Started**.
5. Choose **Start in production mode** (or test mode, but production is safer with our project rules).
6. Click **Next** and then **Done** to create the default bucket.

## 2. Apply Storage Rules
The system includes a `storage.rules` file in the root. 
Since the deployment tool currently focuses on Firestore, you should manually copy the contents of `storage.rules` into the **Rules** tab of your Storage section in the Firebase Console.

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow write: if request.auth != null && request.auth.uid == userId;
      allow read: if true;
    }
  }
}
```

## 3. Configure CORS (Crucial for Preview)
To allow uploads from the AI Studio preview environment, you must set the CORS policy on your bucket.
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Search for **Cloud Storage** and find your bucket (usually `your-project-id.appspot.com` or `your-project-id.firebasestorage.app`).
3. Open the **Cloud Shell** (terminal icon in top right).
4. Run the following command to create a CORS configuration file:
   ```bash
   echo '[{"origin": ["*"], "method": ["GET", "PUT", "POST", "DELETE", "HEAD"], "responseHeader": ["Content-Type", "Authorization", "x-goog-resumable"], "maxAgeSeconds": 3600}]' > cors.json
   ```
5. Apply the policy to your bucket:
   ```bash
   gsutil cors set cors.json gs://YOUR_BUCKET_NAME
   ```
   *(Replacing `YOUR_BUCKET_NAME` with your actual storage bucket name found in `firebase-applet-config.json`)*

---
### Why is this necessary?
Firebase Storage is built on Google Cloud Storage. While the SDK handles the upload, browsers block cross-origin requests by default unless specifically allowed by the bucket's CORS policy.
