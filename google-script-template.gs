// Google Apps Script for AEX Ticket Form
// Deploy this as a web app to receive form submissions

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Extract the email and other data
    const email = data.email;
    const timestamp = data.timestamp;
    const source = data.source;
    
    // Log the submission (optional)
    console.log('New ticket request:', { email, timestamp, source });
    
    // You can add your own logic here, such as:
    // - Sending confirmation emails
    // - Adding to a Google Sheet
    // - Sending notifications
    // - etc.
    
    // Example: Add to a Google Sheet
    // addToSheet(email, timestamp, source);
    
    // Example: Send confirmation email
    // sendConfirmationEmail(email);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Ticket request received successfully' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the error
    console.error('Error processing ticket request:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: 'Failed to process ticket request' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Function to add data to a Google Sheet
function addToSheet(email, timestamp, source) {
  try {
    // Replace 'YOUR_SHEET_ID' with your actual Google Sheet ID
    const sheetId = 'YOUR_SHEET_ID';
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    
    // Add a new row with the ticket request data
    sheet.appendRow([timestamp, email, source, 'Pending']);
    
    console.log('Data added to sheet successfully');
  } catch (error) {
    console.error('Error adding data to sheet:', error);
  }
}

// Optional: Function to send confirmation email
function sendConfirmationEmail(email) {
  try {
    const subject = 'Ticket Request Received - AEX';
    const body = `
      Thank you for your ticket request!
      
      We have received your request for the Alexander Evans Experience show.
      Our team will review your request and get back to you soon.
      
      Best regards,
      The AEX Team
    `;
    
    MailApp.sendEmail(email, subject, body);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

// Test function to verify the script is working
function doGet() {
  try {
    // Return dynamic data that can be used throughout the website
    const data = {
      shows: [
        {
          id: 1,
          name: "Fall/Winter 2026",
          date: "09.12.2025",
          time: "TBD",
          location: "New York, NY",
          ticketsAvailable: true,
          description: "The latest collection showcasing innovative design and craftsmanship"
        },
        {
          id: 2,
          name: "Spring/Summer 2026",
          date: "03.15.2026",
          time: "TBD",
          location: "Los Angeles, CA",
          ticketsAvailable: false,
          description: "Upcoming collection - stay tuned for more details"
        }
      ],
      announcements: [
        "Welcome to Alexander Evans Experience",
        "New collection launching soon",
        "Limited edition pieces available",
        "Follow us on social media for updates"
      ],
      contact: {
        email: "hello@aex.com",
        phone: "+1 (347) 807-4826",
        location: "New York, NY"
      },
      social: {
        instagram: "@alexanderevansexperience",
        twitter: "@aex_official",
        facebook: "Alexander Evans Experience"
      },
      lastUpdated: new Date().toISOString(),
      version: "1.0.0"
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: 'Failed to fetch data',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
