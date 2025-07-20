# Setup Guide for CheckDisOut

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Firebase project (Firestore, Auth)
- Cloudinary account

## 1. Clone the Repository
```bash
git clone https://github.com/your-org/checkdisout.git
cd checkdisout
```

## 2. Install Dependencies
```bash
npm install
```

## 3. Configure Environment Variables
- Copy `.env.example` to `.env.local`:
  ```bash
  cp .env.example .env.local
  ```
- Fill in your Firebase, Cloudinary, and app config values.

## 4. Firebase Setup
- Create a Firebase project at https://console.firebase.google.com/
- Enable Firestore and Authentication (Email/Password, Google, etc.)
- Get your Firebase config and add to `.env.local`
- Set up Firestore security rules (see `firestore.rules`)

## 5. Cloudinary Setup
- Create a Cloudinary account at https://cloudinary.com/
- Create an upload preset and get your cloud name, API key, and secret
- Add these to `.env.local`

## 6. Run the App Locally
```bash
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000)

## 7. Run Tests
```bash
npm test
```

## 8. Deployment
- Deploy to Vercel for best results
- Set environment variables in Vercel dashboard
- See `vercel.json` for config

---
For more, see [USER_GUIDE.md](./USER_GUIDE.md) and [TROUBLESHOOTING.md](./TROUBLESHOOTING.md). 