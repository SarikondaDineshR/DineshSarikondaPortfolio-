# Portfolio Setup Guide

## Quick Start

```bash
npm install
npm run dev
```

## Configuring EmailJS (Contact Form)

1. Create a free account at https://www.emailjs.com
2. Create a new Email Service (Gmail, Outlook, etc.)
3. Create an Email Template with variables:
   - `{{from_name}}` - sender name
   - `{{from_email}}` - sender email
   - `{{subject}}` - subject
   - `{{message}}` - message body
4. Get your credentials from the dashboard
5. Update `src/sections/ContactSection.jsx`:
   ```js
   const EMAILJS_SERVICE_ID = 'service_xxxxxxx'
   const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx'
   const EMAILJS_PUBLIC_KEY = 'xxxxxxxxxxxxxxx'
   ```

## Configuring Google Sheets (Optional)

1. Create a Google Sheet for contact form submissions
2. Go to Extensions → Apps Script
3. Paste this script:
   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.timestamp,
       data.name,
       data.email,
       data.subject,
       data.message
     ]);
     return ContentService.createTextOutput('OK');
   }
   ```
4. Deploy as Web App (Anyone can access)
5. Copy the Web App URL
6. Update `GOOGLE_SHEET_URL` in `ContactSection.jsx`

## Customizing Your Resume Link

In `src/sections/HeroSection.jsx`, find `handleDownloadResume` and update with your actual PDF URL:
```js
window.open('https://your-resume-url.pdf', '_blank')
```

## Updating Social Links

In `src/sections/ContactSection.jsx`, update the `contactLinks` array with your profiles.

## Deploying to GitHub Pages

### Method 1: GitHub Actions (Automatic)
1. Push code to a GitHub repo named `portfolio2`
2. Go to Settings → Pages → Source: GitHub Actions
3. Push to `main` branch → auto-deploys

### Method 2: Manual
```bash
# Update vite.config.js base to match your repo name
# Then:
npm run build
npx gh-pages -d dist
```

## Changing the Repo Name

If your GitHub repo has a different name, update `vite.config.js`:
```js
base: '/your-repo-name/',
```

## Performance Notes

The 3D cloud component automatically disables on low-performance devices.
To force-disable for testing: pass `isLowPerf={true}` to `HeroSection`.
