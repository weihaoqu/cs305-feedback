// =============================================================
// Google Apps Script — paste this into your Google Sheet
//
// Setup:
// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Paste this entire file
// 4. Run setupSheets() once (click the play button or Run > setupSheets)
// 5. Click Deploy > New deployment
// 6. Type: Web app
// 7. Execute as: Me
// 8. Who has access: Anyone
// 9. Click Deploy, copy the URL
// 10. Paste the URL into index.html and feedback.html
//     (replace YOUR_APPS_SCRIPT_URL_HERE)
// =============================================================

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create or get Consent tab
  var consent = ss.getSheetByName('Consent');
  if (!consent) {
    consent = ss.insertSheet('Consent');
  }
  consent.getRange('A1').setValue('Timestamp');
  consent.getRange('A1').setFontWeight('bold');

  // Create or get Feedback tab
  var feedback = ss.getSheetByName('Feedback');
  if (!feedback) {
    feedback = ss.insertSheet('Feedback');
  }
  var headers = ['Timestamp', 'Group', 'Pre Rating', 'Post Rating', 'Learning', 'Accuracy', 'Usability', 'Comments'];
  feedback.getRange(1, 1, 1, headers.length).setValues([headers]);
  feedback.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  // Delete default "Sheet1" if it exists and is empty
  var sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && sheet1.getLastRow() === 0) {
    ss.deleteSheet(sheet1);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return corsResponse({ status: 'error', message: 'Server busy' });
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    if (data.type === 'consent') {
      var consentSheet = sheet.getSheetByName('Consent');
      consentSheet.appendRow([data.timestamp]);
    } else if (data.type === 'feedback') {
      var group = parseInt(data.group, 10);
      if (isNaN(group) || group < 1 || group > 15) {
        return corsResponse({ status: 'error', message: 'Invalid group' });
      }
      var comments = String(data.comments || '').substring(0, 2000);

      var feedbackSheet = sheet.getSheetByName('Feedback');
      feedbackSheet.appendRow([
        data.timestamp,
        group,
        data.pre_rating,
        data.post_rating,
        data.learning,
        data.accuracy,
        data.usability,
        comments
      ]);
    } else {
      return corsResponse({ status: 'error', message: 'Unknown type' });
    }

    return corsResponse({ status: 'ok' });
  } catch (err) {
    return corsResponse({ status: 'error', message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return corsResponse({ status: 'ok', message: 'CS305 Feedback API is running.' });
}

function corsResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
