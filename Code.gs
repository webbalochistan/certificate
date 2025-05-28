const SHEET_ID = "1I3-AGmlwco8zFVa0dl40k2SYzBSQa1BVCnZgg7rLXHU";

// Serve HTML interface if no query params are present
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

// Handle API request for CNIC search
function handleAPISearch(e) {
  const sheetName = e.parameter.sheet || "";
  const cnic = e.parameter.cnic || "";
  const result = searchCNIC(sheetName, cnic);
  return ContentService.createTextOutput(result)
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({ "Access-Control-Allow-Origin": "*" });
}

function getSheetData(sheetName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const records = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    records.push(row);
  }

  return records;
}



function searchCNIC(sheetName, cnic) {
  const ss = SpreadsheetApp.openById("1I3-AGmlwco8zFVa0dl40k2SYzBSQa1BVCnZgg7rLXHU");
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const cnicIndex = headers.indexOf("CNIC No");
  const fileIdIndex = headers.indexOf("PDF ID");

  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === cnic) {  // Column E is index 4
      const fileId = data[i][10];  // Column K is index 10
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`; // preview link
      }
    }
  }

  return null;
}
