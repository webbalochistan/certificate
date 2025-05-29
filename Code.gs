const SHEET_ID = "1VzM0XOXrM3SWea2cKfDwN1zctVrxz2SoWwloD00raDQ";  // Your Spreadsheet ID

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Entry point of the web app (HTTP GET)
function doGet(e) {
  const sheet = e.parameter.sheet;  // Sheet name passed in the URL
  const cnic = e.parameter.cnic;    // CNIC passed in the URL
  
  Logger.log("sheet: " + sheet + ", cnic: " + cnic);  // Log to check the parameters

  // Check if 'sheet' or 'cnic' parameters are missing
  if (!sheet || !cnic) {
    return ContentService.createTextOutput("Missing parameters")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  // Proceed with searching the CNIC in the specified sheet
  const result = searchCNIC(sheet, cnic);
  
  // Return the result as a plain text response
  return ContentService.createTextOutput(result || "")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Function to search the CNIC in the specified sheet
function searchCNIC(sheetName, cnic) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);  // Dynamically get the sheet by name

  // If the sheet is not found, return a message
  if (!sheet) return "Sheet not found";

  // Get all the data from the sheet
  const data = sheet.getDataRange().getValues();

  // Iterate through the rows in the sheet to find the CNIC
  for (let i = 1; i < data.length; i++) {
    const cnicValue = data[i][4];  // Column E (CNIC No) is at index 4 (zero-based)
    const fileId = data[i][12];    // Column K (File ID) is at index 12 (zero-based)

    // If CNIC matches
    if (cnicValue === cnic) {
      if (fileId) {
        // Return the file preview link if the File ID exists
        return `https://drive.google.com/file/d/${fileId}/preview`;
      } else {
        return "File ID missing";
      }
    }
  }

  // Return "CNIC not found" if no match is found
  return "CNIC not found";
}
