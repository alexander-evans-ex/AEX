# Google Apps Script Setup for AEX Ticket Form

This guide will help you set up the Google Apps Script to receive ticket form submissions from your AEX website.

## Step 1: Create a New Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the contents of `google-script-template.gs`
4. Save the project with a name like "AEX Ticket Handler"

## Step 2: Deploy as Web App

1. Click the "Deploy" button (blue rocket icon)
2. Select "New deployment"
3. Choose "Web app" as the type
4. Set the following options:
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone
5. Click "Deploy"
6. Copy the Web App URL that appears

## Step 3: Update Your Website Code

1. Open `src/main.js`
2. Find this line:
   ```javascript
   const googleScriptUrl = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with your actual Web App URL

## Step 4: Test the Integration

1. Open your website
2. Navigate to the shows section
3. Enter an email in the ticket input
4. Click the submit button
5. Check the Google Apps Script logs to see if the submission was received

## Optional Features

### Add to Google Sheet

To automatically add submissions to a Google Sheet:

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL
3. In the Google Script, uncomment the `addToSheet(email, timestamp, source);` line
4. Replace `'YOUR_SHEET_ID'` with your actual Sheet ID
5. The script will add a new row for each submission with columns: Timestamp, Email, Source, Status

### Send Confirmation Emails

To automatically send confirmation emails:

1. In the Google Script, uncomment the `sendConfirmationEmail(email);` line
2. The script will send a confirmation email to each person who submits a ticket request

## Troubleshooting

- **CORS errors**: The script uses `mode: 'no-cors'` to handle this
- **Script not receiving data**: Check that the Web App URL is correct and the script is deployed
- **Permission errors**: Make sure the script is deployed with "Anyone" access

## Security Notes

- The current setup allows anyone to submit to your script
- Consider adding rate limiting or CAPTCHA for production use
- The script logs all submissions for debugging purposes

## Customization

You can modify the Google Script to:
- Add more form fields
- Integrate with other Google services
- Send notifications to Slack/Discord
- Process payments
- Generate unique ticket codes

## Support

If you encounter issues:
1. Check the Google Apps Script logs
2. Verify the Web App URL is correct
3. Test with the `doGet()` function to ensure the script is accessible
