# CheckDisOut - Achievement Aggregator

## Overview
CheckDisOut is a web app to track and showcase your achievements, participations, and projects. Built with Next.js, Firebase, and Cloudinary.

## Features
- User authentication (Firebase)
- Add, edit, and delete achievements, participations, and projects
- Portfolio PDF export
- Responsive, accessible UI
- Image uploads (Cloudinary)
- SEO, accessibility, and performance optimizations

## Setup Instructions
1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-org/checkdisout.git
   cd checkdisout
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Firebase, Cloudinary, and app config.
4. **Run the app locally:**
   ```bash
   npm run dev
   ```
5. **Run tests:**
   ```bash
   npm test
   ```

## Environment Variables
See `.env.example` for all required variables.

## Deployment
- Deploy to Vercel for best results.
- Ensure all environment variables are set in the Vercel dashboard.
- See `vercel.json` for configuration.

## Documentation
- [SETUP.md](./SETUP.md): Step-by-step setup
- [USER_GUIDE.md](./USER_GUIDE.md): User guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md): Troubleshooting

## License
MIT
