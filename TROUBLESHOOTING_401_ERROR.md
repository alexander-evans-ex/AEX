# Fixing 401 Unauthorized Error with Google Apps Script

## The Problem
You're getting a `401 (Unauthorized)` error when trying to submit to your Google Script. This means the script isn't properly configured to accept external requests.

## Solution: Fix Google Script Deployment Settings

### Step 1: Access Your Google Script
1. Go to [script.google.com](https://script.google.com)
2. Open your "AEX Ticket Handler" project

### Step 2: Check Current Deployment
1. Click the **"Deploy"** button (blue rocket icon)
2. Look for your existing deployment
3. Note the current settings

### Step 3: Update Deployment Settings
1. **Click the pencil icon** (edit) next to your deployment
2. **Change these settings:**
   - **Execute as**: `Me` (your Google account)
   - **Who has access**: `Anyone` ← **This is crucial!**
3. **Click "Update"**
4. **Copy the new Web App URL**

### Step 4: Alternative - Create New Deployment
If editing doesn't work:

1. **Click "New deployment"**
2. **Choose "Web app"**
3. **Set these options:**
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. **Click "Deploy"**
5. **Copy the new URL**

### Step 5: Test the Script
1. **Copy the new Web App URL**
2. **Paste it in your browser** to test
3. **You should see**: `AEX Ticket Form Handler is working!` or your JSON data

## Common Issues & Solutions

### Issue 1: "Who has access" is set to "Only myself"
**Solution**: Change to "Anyone"

### Issue 2: Script shows "Authorization required"
**Solution**: Make sure "Execute as" is set to "Me"

### Issue 3: Still getting 401 errors
**Solution**: 
1. Wait 5-10 minutes after deployment (Google needs time to propagate)
2. Try creating a completely new deployment
3. Check if your Google account has any restrictions

### Issue 4: Script works in browser but not from website
**Solution**: 
1. Make sure you're using the Web App URL (not the script editor URL)
2. Check that the URL ends with `/exec`
3. Verify the script is deployed as a "Web app"

## Testing Your Fix

### Test 1: Browser Test
1. Open your Web App URL in a browser
2. You should see your data or a success message

### Test 2: Website Test
1. Go to your website
2. Try submitting a ticket request
3. Check the browser console for success messages

### Test 3: Google Script Logs
1. In your Google Script editor
2. Click "Executions" in the left sidebar
3. Look for successful executions

## Final Checklist

- [ ] Script is deployed as "Web app"
- [ ] "Execute as" is set to "Me"
- [ ] "Who has access" is set to "Anyone"
- [ ] You're using the Web App URL (ends with `/exec`)
- [ ] Waited 5-10 minutes after deployment
- [ ] Script works when opened in browser

## If Still Having Issues

1. **Check Google Script logs** for any errors
2. **Try a different browser** to rule out browser issues
3. **Check your Google account** for any restrictions
4. **Consider using a different Google account** for testing

## Contact Support

If none of these solutions work:
1. Check the Google Apps Script documentation
2. Look for any error messages in the Google Script editor
3. Verify your Google account has the necessary permissions
