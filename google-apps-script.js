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
    // Log the entire event object for debugging
    console.log('Received event object:', JSON.stringify(e, null, 2));
    
    let data;
    
    // Check if e exists and has the expected structure
    if (!e) {
      console.error('Event object is null or undefined');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'No event data received'
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
    // Handle different content types
    if (e.postData && e.postData.contents) {
      console.log('Processing postData.contents');
      console.log('Content type:', e.postData.type);
      console.log('Raw contents:', e.postData.contents);
      
      const contentType = e.postData.type || 'application/json';
      
      if (contentType === 'application/json') {
        // JSON data
        console.log('Parsing JSON data');
        try {
          data = JSON.parse(e.postData.contents);
          console.log('Successfully parsed JSON:', data);
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          throw new Error('Invalid JSON format: ' + jsonError.toString());
        }
      } else if (contentType === 'application/x-www-form-urlencoded') {
        // Form URL encoded data
        console.log('Parsing URL encoded data');
        data = {};
        const params = e.postData.contents.split('&');
        params.forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            data[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
        console.log('Parsed URL encoded data:', data);
      } else {
        // Try to parse as form data from parameters
        console.log('Using parameters fallback from postData');
        data = {
          name: e.parameter?.name || '',
          email: e.parameter?.email || '',
          projectType: e.parameter?.projectType || '',
          description: e.parameter?.description || '',
          timestamp: e.parameter?.timestamp || new Date().toISOString()
        };
      }
    } else if (e.parameter) {
      // Fallback to parameters (for FormData submissions)
      console.log('Using parameters object');
      data = {
        name: e.parameter.name || '',
        email: e.parameter.email || '',
        projectType: e.parameter.projectType || '',
        description: e.parameter.description || '',
        timestamp: e.parameter.timestamp || new Date().toISOString()
      };
    } else {
      // No data received
      console.error('No postData or parameter found in event object');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'No form data received'
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
    // Log received data for debugging
    console.log('Received data:', data);
    
    // Validasi data dengan logging detail
    console.log('Validating data fields:');
    console.log('- name:', data.name, '(length:', data.name?.length, ')');
    console.log('- email:', data.email, '(length:', data.email?.length, ')');
    console.log('- projectType:', data.projectType, '(length:', data.projectType?.length, ')');
    console.log('- description:', data.description, '(length:', data.description?.length, ')');
    
    if (!data.name || !data.email || !data.projectType || !data.description) {
      const missingFields = {
        name: !!data.name,
        email: !!data.email,
        projectType: !!data.projectType,
        description: !!data.description
      };
      
      console.log('Missing fields:', missingFields);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields',
          missingFields: missingFields,
          receivedData: data
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
    console.log('All fields validated successfully, saving to spreadsheet...');
    
    // Simpan data ke spreadsheet
    const result = saveToSpreadsheet(data);
    
    console.log('Spreadsheet save result:', result);
    
    if (result.success) {
      const successResponse = {
        success: true,
        message: 'Data saved successfully to spreadsheet',
        savedData: {
          name: data.name,
          email: data.email,
          projectType: data.projectType,
          timestamp: new Date().toISOString()
        }
      };
      
      console.log('Sending success response:', successResponse);
      
      return ContentService
        .createTextOutput(JSON.stringify(successResponse))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    } else {
      const errorResponse = {
        success: false,
        error: 'Failed to save to spreadsheet',
        details: result.error
      };
      
      console.log('Sending error response:', errorResponse);
      
      return ContentService
        .createTextOutput(JSON.stringify(errorResponse))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
  } catch (error) {
    console.error('Error in doPost:', error);
    console.error('Error stack:', error.stack);
    console.error('Event object that caused error:', JSON.stringify(e, null, 2));
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Internal server error: ' + error.toString(),
        details: error.stack
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

/**
 * Fungsi untuk testing doPost dengan berbagai skenario
 */
function testDoPost() {
  console.log('=== TESTING doPost FUNCTION ===');
  
  // Test 1: FormData submission (paling umum dari website)
  console.log('Test 1: FormData submission');
  const formDataEvent = {
    parameter: {
      name: 'Test User FormData',
      email: 'test@formdata.com',
      projectType: 'web-app',
      description: 'Test message from FormData',
      timestamp: new Date().toISOString()
    }
  };
  
  try {
    const result1 = doPost(formDataEvent);
    console.log('Test 1 Result:', result1.getContent());
  } catch (error) {
    console.error('Test 1 Error:', error);
  }
  
  // Test 2: JSON submission
  console.log('Test 2: JSON submission');
  const jsonEvent = {
    postData: {
      type: 'application/json',
      contents: JSON.stringify({
        name: 'Test User JSON',
        email: 'test@json.com',
        projectType: 'laravel-project',
        description: 'Test message from JSON'
      })
    }
  };
  
  try {
    const result2 = doPost(jsonEvent);
    console.log('Test 2 Result:', result2.getContent());
  } catch (error) {
    console.error('Test 2 Error:', error);
  }
  
  // Test 3: URL encoded submission
  console.log('Test 3: URL encoded submission');
  const urlEncodedEvent = {
    postData: {
      type: 'application/x-www-form-urlencoded',
      contents: 'name=Test%20User%20URL&email=test%40url.com&projectType=api-development&description=Test%20message%20from%20URL%20encoded'
    }
  };
  
  try {
    const result3 = doPost(urlEncodedEvent);
    console.log('Test 3 Result:', result3.getContent());
  } catch (error) {
    console.error('Test 3 Error:', error);
  }
  
  // Test 4: Empty/null event (error scenario)
  console.log('Test 4: Null event');
  try {
    const result4 = doPost(null);
    console.log('Test 4 Result:', result4.getContent());
  } catch (error) {
    console.error('Test 4 Error:', error);
  }
  
  // Test 5: Empty event object
  console.log('Test 5: Empty event object');
  try {
    const result5 = doPost({});
    console.log('Test 5 Result:', result5.getContent());
  } catch (error) {
    console.error('Test 5 Error:', error);
  }
  
  console.log('=== TESTING COMPLETE ===');
}

/**
 * Fungsi untuk testing manual yang mudah digunakan
 */
function quickTest() {
  console.log('=== QUICK TEST ===');
  
  const testEvent = {
    parameter: {
      name: 'Quick Test User',
      email: 'quicktest@example.com',
      projectType: 'web-app',
      description: 'This is a quick test message'
    }
  };
  
  try {
    const result = doPost(testEvent);
    console.log('Quick Test Result:', result.getContent());
    
    // Also test the spreadsheet directly
    const saveResult = saveToSpreadsheet({
      name: 'Direct Save Test',
      email: 'direct@test.com',
      projectType: 'test',
      description: 'Direct spreadsheet save test'
    });
    
    console.log('Direct save result:', saveResult);
    
  } catch (error) {
    console.error('Quick Test Error:', error);
  }
}

/**
 * Fungsi untuk testing JSON submission khusus
 */
function testJSONSubmission() {
  console.log('=== TESTING JSON SUBMISSION ===');
  
  // Simulate exact JSON data yang dikirim dari website
  const jsonData = {
    name: 'Test JSON User',
    email: 'json@test.com',
    projectType: 'web-app',
    description: 'Testing JSON submission from portfolio contact form',
    timestamp: new Date().toISOString()
  };
  
  console.log('Testing with JSON data:', jsonData);
  
  // Create event object yang simulate JSON POST request
  const jsonEvent = {
    postData: {
      type: 'application/json',
      contents: JSON.stringify(jsonData)
    }
  };
  
  try {
    console.log('Calling doPost with JSON event...');
    const result = doPost(jsonEvent);
    const responseContent = result.getContent();
    
    console.log('JSON Test Result (raw):', responseContent);
    
    try {
      const parsedResponse = JSON.parse(responseContent);
      console.log('JSON Test Result (parsed):', parsedResponse);
      
      if (parsedResponse.success) {
        console.log('✅ JSON submission test SUCCESSFUL');
        console.log('Data should be saved to spreadsheet');
      } else {
        console.log('❌ JSON submission test FAILED');
        console.log('Error:', parsedResponse.error);
      }
    } catch (parseError) {
      console.error('Could not parse response as JSON:', parseError);
    }
    
  } catch (error) {
    console.error('JSON Test Error:', error);
  }
  
  console.log('=== JSON TESTING COMPLETE ===');
}

/**
 * Fungsi untuk test lengkap: JSON + Spreadsheet save
 */
function fullJSONTest() {
  console.log('=== FULL JSON + SPREADSHEET TEST ===');
  
  // Step 1: Test JSON submission
  console.log('Step 1: Testing JSON submission...');
  testJSONSubmission();
  
  // Step 2: Test direct spreadsheet save
  console.log('Step 2: Testing direct spreadsheet save...');
  const testData = {
    name: 'Direct Save JSON Test',
    email: 'directjson@test.com',
    projectType: 'json-test',
    description: 'Testing direct save to spreadsheet with JSON format data'
  };
  
  const saveResult = saveToSpreadsheet(testData);
  console.log('Direct save result:', saveResult);
  
  if (saveResult.success) {
    console.log('✅ Direct spreadsheet save SUCCESSFUL');
  } else {
    console.log('❌ Direct spreadsheet save FAILED');
    console.log('Error:', saveResult.error);
  }
  
  console.log('=== FULL TEST COMPLETE ===');
}
