/**
 * Google Apps Script untuk menerima data dari contact form portfolio
 * dan menyimpannya ke Google Spreadsheet
 * 
 * Deploy sebagai Web App dengan permission:
 * - Execute as: Me
 * - Who has access: Anyone
 */

// ID Spreadsheet dari URL yang Anda berikan
const SPREADSHEET_ID = '1qnCxZYX-pePyrIuXYXLj3AwKL6vYchUENZ6jT5qbwX8';
const SHEET_NAME = 'Form Responses'; // Nama sheet, sesuaikan jika perlu

/**
 * Fungsi untuk menangani HTTP POST request dari contact form
 */
function doPost(e) {
  try {
    let data;
    
    // Handle different content types
    if (e.postData) {
      const contentType = e.postData.type;
      
      if (contentType === 'application/json') {
        // JSON data
        data = JSON.parse(e.postData.contents);
      } else if (contentType === 'application/x-www-form-urlencoded') {
        // Form URL encoded data
        data = {};
        const params = e.postData.contents.split('&');
        params.forEach(param => {
          const [key, value] = param.split('=');
          data[decodeURIComponent(key)] = decodeURIComponent(value);
        });
      } else {
        // Try to parse as form data from parameters
        data = {
          name: e.parameter.name,
          email: e.parameter.email,
          projectType: e.parameter.projectType,
          description: e.parameter.description,
          timestamp: e.parameter.timestamp || new Date().toISOString()
        };
      }
    } else {
      // Fallback to parameters
      data = {
        name: e.parameter.name,
        email: e.parameter.email,
        projectType: e.parameter.projectType,
        description: e.parameter.description,
        timestamp: e.parameter.timestamp || new Date().toISOString()
      };
    }
    
    // Log received data for debugging
    console.log('Received data:', data);
    
    // Validasi data
    if (!data.name || !data.email || !data.projectType || !data.description) {
      console.log('Missing fields:', {
        name: !!data.name,
        email: !!data.email,
        projectType: !!data.projectType,
        description: !!data.description
      });
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
    // Simpan data ke spreadsheet
    const result = saveToSpreadsheet(data);
    
    if (result.success) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: 'Data saved successfully'
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: result.error
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Internal server error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

/**
 * Fungsi untuk menangani HTTP OPTIONS request (CORS preflight)
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    });
}

/**
 * Fungsi untuk menangani HTTP GET request (untuk testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Portfolio Contact Form API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fungsi untuk menyimpan data ke spreadsheet
 */
function saveToSpreadsheet(data) {
  try {
    // Buka spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Cari atau buat sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Tambahkan header jika sheet baru
      const headers = ['Timestamp', 'Name', 'Email', 'Project Type', 'Description'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
    }
    
    // Siapkan data untuk disimpan
    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const rowData = [
      timestamp,
      data.name,
      data.email,
      data.projectType,
      data.description
    ];
    
    // Tambahkan data ke baris baru
    sheet.appendRow(rowData);
    
    // Auto-resize kolom untuk readability
    sheet.autoResizeColumns(1, 5);
    
    // Log untuk debugging
    console.log('Data saved successfully:', {
      name: data.name,
      email: data.email,
      timestamp: timestamp
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('Error saving to spreadsheet:', error);
    return { 
      success: false, 
      error: error.toString() 
    };
  }
}

/**
 * Fungsi untuk testing - dapat dipanggil manual untuk test
 */
function testSaveData() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    projectType: 'web-app',
    description: 'This is a test message',
    timestamp: new Date().toISOString()
  };
  
  const result = saveToSpreadsheet(testData);
  console.log('Test result:', result);
}

/**
 * Fungsi untuk setup awal spreadsheet
 */
function setupSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // Clear existing content
    sheet.clear();
    
    // Add headers
    const headers = ['Timestamp', 'Name', 'Email', 'Project Type', 'Description'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setHorizontalAlignment('center');
    
    // Set column widths
    sheet.setColumnWidth(1, 150); // Timestamp
    sheet.setColumnWidth(2, 150); // Name
    sheet.setColumnWidth(3, 200); // Email
    sheet.setColumnWidth(4, 180); // Project Type
    sheet.setColumnWidth(5, 300); // Description
    
    console.log('Spreadsheet setup complete');
    
  } catch (error) {
    console.error('Error setting up spreadsheet:', error);
  }
}
