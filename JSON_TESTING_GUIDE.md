# 🧪 TESTING JSON SUBMISSION TO SPREADSHEET

## 🚀 **PERUBAHAN YANG DILAKUKAN:**

### 1. **Script.js diupdate untuk JSON submission**
- ✅ Mengirim data dalam format JSON murni
- ✅ Content-Type: application/json
- ✅ Enhanced logging untuk debug
- ✅ Better error handling

### 2. **Google Apps Script diperbaiki**
- ✅ Improved JSON parsing dengan error handling
- ✅ Detailed logging untuk setiap step
- ✅ Enhanced validation dengan field-by-field check
- ✅ Better response format dengan detail info

### 3. **Testing functions ditambahkan**
- ✅ `testJSONSubmission()` - Test JSON format khusus
- ✅ `fullJSONTest()` - Test lengkap JSON + spreadsheet
- ✅ Enhanced debugging logs

## 🔧 **LANGKAH TESTING:**

### **1. Test di Google Apps Script Editor**
```javascript
// Jalankan function ini untuk test JSON submission:
testJSONSubmission()

// Atau jalankan full test (JSON + spreadsheet):
fullJSONTest()

// Cek hasil di "Execution transcript"
```

### **2. Test Manual di Website**
1. Buka portfolio website
2. Isi contact form dengan data test
3. Submit form
4. Cek browser console (F12) untuk logs
5. Cek Google Apps Script logs
6. Cek spreadsheet untuk data baru

### **3. Verify Spreadsheet Structure**
```javascript
// Setup spreadsheet jika belum ada:
setupSpreadsheet()

// Test direct save:
testSaveData()
```

## 📋 **FORMAT DATA JSON YANG DIKIRIM:**

```json
{
  "name": "User Name",
  "email": "user@email.com",
  "projectType": "web-app",
  "description": "Project description text",
  "timestamp": "2025-01-XX..."
}
```

## 📊 **STRUKTUR SPREADSHEET:**

| Timestamp | Name | Email | Project Type | Description |
|-----------|------|-------|--------------|-------------|
| 12/01/2025 14:30:45 | User Name | user@email.com | web-app | Project description |

## 🔍 **DEBUGGING STEPS:**

### **Jika masih belum tersimpan:**

1. **Cek Google Apps Script Logs:**
   - Buka Google Apps Script Editor
   - Klik "Executions" di sidebar
   - Lihat log execution terakhir
   - Cari error messages atau missing steps

2. **Run Test Functions:**
   ```javascript
   // Test JSON parsing:
   testJSONSubmission()
   
   // Test spreadsheet access:
   testSaveData()
   
   // Setup ulang spreadsheet:
   setupSpreadsheet()
   ```

3. **Check Browser Console:**
   - F12 → Console tab
   - Submit form
   - Look for:
     - "Sending JSON data: {object}"
     - "Response status: 200"
     - Any error messages

4. **Verify Spreadsheet Permission:**
   - Pastikan Google Apps Script bisa akses spreadsheet
   - Cek spreadsheet ID benar
   - Pastikan sheet "Form Responses" exists

## 🎯 **EXPECTED LOGS SEQUENCE:**

### **Di Google Apps Script:**
```
1. "Received event object: {..."
2. "Processing postData.contents"
3. "Content type: application/json" 
4. "Parsing JSON data"
5. "Successfully parsed JSON: {..."
6. "Validating data fields:"
7. "All fields validated successfully, saving to spreadsheet..."
8. "Data saved successfully: {..."
9. "Sending success response: {..."
```

### **Di Browser Console:**
```
1. "Sending JSON data: {..."
2. "Response status: 200"
3. "Response received, assuming success"
4. "Thank you [Name]! Your message has been sent successfully..."
```

## 🚨 **TROUBLESHOOTING:**

### **Error: "Invalid JSON format"**
- Check data encoding dari browser
- Verify Content-Type header
- Check special characters dalam message

### **Error: "Missing required fields"**
- Cek field validation di form
- Verify field names match exactly
- Check empty/null values

### **Error: "Failed to save to spreadsheet"**
- Run `setupSpreadsheet()` function
- Check spreadsheet permissions
- Verify SPREADSHEET_ID

### **Data tidak muncul di spreadsheet**
- Check sheet name "Form Responses"
- Verify column headers match
- Check timezone settings (should be WIB)

## ✅ **SUCCESS INDICATORS:**

1. **Browser Console:** No errors, success notification muncul
2. **Google Apps Script Logs:** "Data saved successfully" message
3. **Spreadsheet:** Row baru dengan timestamp WIB dan data lengkap
4. **Test Functions:** All tests return success=true

## 🔄 **NEXT STEPS JIKA SUKSES:**

1. **Re-deploy Web App** setelah update code
2. **Test sekali lagi** dari website
3. **Verify data formatting** di spreadsheet
4. **Setup email notifications** (optional)

Dengan perubahan ini, sistem sekarang menggunakan JSON format murni dan logging yang lebih detail untuk memastikan data tersimpan ke spreadsheet! 🎉
