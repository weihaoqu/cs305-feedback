// =============================================================
// Google Apps Script — paste this into your Google Sheet
//
// Setup:
// 1. Create a new Google Sheet
// 2. Create two tabs: "Consent" and "Feedback"
// 3. In "Consent" tab, add header in A1: Timestamp
// 4. In "Feedback" tab, add headers in row 1:
//    Timestamp | Group | Pre Rating | Post Rating | Learning | Accuracy | Usability | Comments
// 5. Go to Extensions > Apps Script
// 6. Paste this entire file
// 7. Click Deploy > New deployment
// 8. Type: Web app
// 9. Execute as: Me
// 10. Who has access: Anyone
// 11. Click Deploy, copy the URL
// 12. Paste the URL into index.html and feedback.html
//     (replace YOUR_APPS_SCRIPT_URL_HERE)
// =============================================================

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
