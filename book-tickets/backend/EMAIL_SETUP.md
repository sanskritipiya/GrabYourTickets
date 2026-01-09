# Email Setup for Booking Confirmations

## Setup Instructions

1. **Install nodemailer** (already added to package.json):
   ```bash
   npm install
   ```

2. **Configure Gmail for App Passwords**:
   - Go to your Google Account settings
   - Enable 2-Step Verification
   - Go to App Passwords
   - Generate a new app password for "Mail"

3. **Add to .env file** (in the `backend` folder):
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password-here
   ```
   
   **Important Notes:**
   - Use `EMAIL_PASS` (not `EMAIL_PASSWORD`)
   - Use the **App Password** you generated (16 characters, remove spaces if any)
   - Do NOT use your regular Gmail password
   - Make sure 2-Step Verification is enabled first

4. **For other email providers**, update the transporter in `controllers/bookingController.js`:
   ```javascript
   // For Outlook/Hotmail
   const transporter = nodemailer.createTransport({
     service: "hotmail",
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASSWORD,
     },
   });

   // For custom SMTP
   const transporter = nodemailer.createTransport({
     host: "smtp.yourdomain.com",
     port: 587,
     secure: false,
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASSWORD,
     },
   });
   ```

## Testing

The email will be sent automatically when a booking is created. Check the console for email sending status.

