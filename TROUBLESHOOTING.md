# Troubleshooting Guide for CheckDisOut

## Login Issues
- **Cannot log in:**
  - Check your email and password
  - Try Google login if available
  - Ensure Firebase Auth is enabled in the console

## Image Upload Problems
- **Upload fails:**
  - Check your Cloudinary credentials in `.env.local`
  - Ensure the image is under 5MB and in a supported format (jpg, png, webp, gif)

## PDF Export Issues
- **PDF does not download:**
  - Make sure pop-ups are allowed in your browser
  - Check for errors in the browser console
  - Ensure all required sections have data

## Deployment Issues
- **App fails to deploy:**
  - Check that all environment variables are set in Vercel
  - Ensure `next.config.ts` and `vercel.json` are correct
  - Review Vercel build logs for errors

## General
- **App is slow:**
  - Check your internet connection
  - Try clearing browser cache
- **Other errors:**
  - Check the browser console for error messages
  - Review the README and SETUP guides

For further help, open an issue on the project repository. 