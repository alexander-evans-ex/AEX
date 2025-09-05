/**
 * CONFIG
 */
const SHEET_ID = '174rUENhBQ6SZ89yPZWTaP4wISWU0GXbxDJLOPR00DsU';
const ALLOWED_TABS = ['AEXMain', 'AEXData', 'AEXShows', 'AEXProjects', 'AEXProducts'];

/**
 * Schemas for typed parsing (header names MUST match sheet headers)
 */
const SCHEMAS = {
  AEXData: [
    { key: 'mainSection', type: 'string' },
    { key: 'mainSectionImages', type: 'array' }, // comma- or newline-separated
    { key: 'vid1', type: 'string' },
    { key: 'vid2', type: 'string' },
    { key: 'vid3', type: 'string' },
    { key: 'aboutInfo', type: 'string' }
  ],
  AEXShows: [
    { key: 'showId', type: 'string' },
    { key: 'showActive', type: 'boolean' },      // TRUE/Yes/1 => true
    { key: 'showImage', type: 'string' },
    { key: 'showName', type: 'string' },
    { key: 'showDesc', type: 'string' },
    { key: 'showDate', type: 'string' },         // keep as string to match UI
    { key: 'showTime', type: 'string' },
    { key: 'showLocation', type: 'string' }
  ],
  AEXProjects: [
    { key: 'projectId', type: 'string' },
    { key: 'projectImage', type: 'string' },
    { key: 'projectName', type: 'string' },
    { key: 'projectText', type: 'string' },
    { key: 'projectVideo', type: 'string' },
    { key: 'projectImages', type: 'array' }      // comma- or newline-separated
  ],
  AEXProducts: [
    { key: 'productId', type: 'string' },
    { key: 'productActive', type: 'boolean' },   // TRUE/Yes/1 => true
    { key: 'imageUrl', type: 'string' },
    { key: 'productName', type: 'string' },
    { key: 'productDesc', type: 'string' },
    { key: 'productPrice', type: 'number' },
    { key: 'productSizes', type: 'array' },      // e.g., S,M,L or S\nM\nL
    { key: 'productQty', type: 'number' },
    { key: 'stripeProductId', type: 'string' }
  ]
};

/**
 * POST: expects JSON body like:
 * {
 *   "email": "user@example.com",
 *   "timestamp": "2025-09-02T20:00:00.000Z" // optional; server will set if missing
 *   "source": "AEX",
 *   "tab": "AEXMain" // optional; defaults to AEXMain
 * }
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respondJSON(400, { status: 'error', message: 'Missing JSON body.' });
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return respondJSON(400, { status: 'error', message: 'Invalid JSON body.' });
    }

    const email = String(data.email || '').trim();
    const timestamp = data.timestamp ? String(data.timestamp) : new Date().toISOString();
    const source = String(data.source || '').trim();
    const tab = (data.tab && ALLOWED_TABS.includes(data.tab)) ? data.tab : 'AEXMain';

    if (!email) {
      return respondJSON(400, { status: 'error', message: 'Field "email" is required.' });
    }

    addToSheet(email, timestamp, source, tab);
    sendConfirmationEmail(email);

    return respondJSON(200, {
      status: 'success',
      message: 'Ticket request received successfully',
      tabUsed: tab
    });
  } catch (error) {
    console.error('Error processing ticket request:', error);
    return respondJSON(500, { status: 'error', message: 'Failed to process ticket request' });
  }
}

/**
 * Append a row to a specific tab.
 */
function addToSheet(email, timestamp, source, tabName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(tabName);
  if (!sheet) throw new Error(`Tab "${tabName}" not found in the spreadsheet.`);
  sheet.appendRow([timestamp, email, source || 'N/A', 'Pending']);
}

/**
 * Send a simple confirmation email.
 */
function sendConfirmationEmail(email) {
  const subject = 'Ticket Request Received - AEX';
  const body = [
    'Thank you for your ticket request!',
    '',
    'We have received your request for the Alexander Evans Experience show.',
    'Our team will review your request and get back to you soon.',
    '',
    'Best regards,',
    'The AEX Team'
  ].join('\n');

  MailApp.sendEmail(email, subject, body);
}

/**
 * GET: returns live data from tabs with typed schemas
 */
function doGet() {
  try {
    const payload = {
      main: sheetToObjectsGeneric('AEXMain'),                // generic (no schema provided)
      data: sheetToObjectsWithSchema('AEXData', SCHEMAS.AEXData),
      shows: sheetToObjectsWithSchema('AEXShows', SCHEMAS.AEXShows),
      projects: sheetToObjectsWithSchema('AEXProjects', SCHEMAS.AEXProjects),
      products: sheetToObjectsWithSchema('AEXProducts', SCHEMAS.AEXProducts),
      lastUpdated: new Date().toISOString(),
      version: '1.2.0'
    };

    return respondJSON(200, payload);
  } catch (error) {
    console.error('Error in doGet:', error);
    return respondJSON(500, { error: 'Failed to fetch data', message: String(error) });
  }
}

/* =========================
 * Helpers
 * ========================= */

function respondJSON(statusCode, obj) {
  const out = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  // Apps Script can't set HTTP status on Web Apps; include a field for clients.
  obj.__status = statusCode;
  return out;
}

/**
 * Generic converter for tabs w/o schema (first row as headers).
 */
function sheetToObjectsGeneric(sheetName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Tab "${sheetName}" not found in the spreadsheet.`);

  const values = sheet.getDataRange().getValues();
  if (!values || values.length === 0) return [];
  const headers = values[0].map(h => String(h || '').trim());
  const rows = values.slice(1);

  return rows
    .filter(row => row.some(cell => cell !== '' && cell !== null && cell !== undefined))
    .map(row => {
      const obj = {};
      headers.forEach((key, i) => {
        const safeKey = normalizeKey(key) || `col_${i + 1}`;
        obj[safeKey] = row[i];
      });
      return obj;
    });
}

/**
 * Schema-based converter with typing and list splitting.
 */
function sheetToObjectsWithSchema(sheetName, schema) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Tab "${sheetName}" not found in the spreadsheet.`);

  const values = sheet.getDataRange().getValues();
  if (!values || values.length === 0) return [];

  const headers = values[0].map(h => String(h || '').trim());
  const headerIndex = Object.create(null);
  headers.forEach((h, i) => (headerIndex[h] = i));

  const rows = values.slice(1);
  const output = [];

  rows.forEach(row => {
    // consider a row "empty" if all schema fields are empty
    const hasData = schema.some(f => {
      const idx = headerIndex[f.key];
      if (idx === undefined) return false;
      const val = row[idx];
      return val !== '' && val !== null && val !== undefined;
    });
    if (!hasData) return;

    const obj = {};
    schema.forEach(f => {
      const idx = headerIndex[f.key];
      const raw = idx === undefined ? undefined : row[idx];
      obj[f.key] = coerce(raw, f.type);
    });
    output.push(obj);
  });

  return output;
}

function coerce(value, type) {
  if (value === null || value === undefined) return type === 'array' ? [] : (type === 'number' ? null : '');
  switch (type) {
    case 'string':
      return String(value);
    case 'number': {
      // Handle numeric cells and string numbers
      const n = (typeof value === 'number') ? value : parseFloat(String(value).replace(/[^\d.-]/g, ''));
      return isNaN(n) ? null : n;
    }
    case 'boolean': {
      if (typeof value === 'boolean') return value;
      const s = String(value).trim().toLowerCase();
      return ['true', 'yes', 'y', '1'].includes(s);
    }
    case 'array': {
      if (Array.isArray(value)) return value;
      const s = String(value).trim();
      if (!s) return [];
      // split on commas or newlines, trim, drop empties
      return s.split(/[\n,]+/).map(x => x.trim()).filter(Boolean);
    }
    default:
      return value;
  }
}

function normalizeKey(key) {
  return key
    .replace(/\s+/g, '_')
    .replace(/[^\w]/g, '')
    .replace(/^(\d)/, '_$1');
}
