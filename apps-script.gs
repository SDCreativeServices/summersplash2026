/**
 * CARNIVAL GAMES — SUBMISSION LOGGER
 * ------------------------------------------------
 * SETUP:
 * 1. Go to https://sheets.google.com and create a new blank Sheet.
 *    Name it whatever you like, e.g. "Carnival Games Entries".
 * 2. In the Sheet, go to Extensions > Apps Script.
 * 3. Delete anything in the editor and paste in this entire file.
 * 4. Click Deploy > New deployment.
 *    - Type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 5. Click Deploy, authorize it (you'll see a Google warning screen —
 *    this is normal for personal scripts, click Advanced > Go to project).
 * 6. Copy the "Web app URL" it gives you — that's your SCRIPT_URL.
 *    Paste that URL into the CONFIG section at the top of both
 *    duck-pond.html and balloon-pop.html.
 *
 * This script will auto-create two tabs the first time each game is
 * played: "DuckPond" and "BalloonPop".
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = data.game === 'balloon-pop' ? 'BalloonPop' : 'DuckPond';
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (sheetName === 'DuckPond') {
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Duck Picked']);
      } else {
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Score']);
      }
    }

    var row = sheetName === 'DuckPond'
      ? [new Date(), data.name || '', data.email || '', data.pick || '']
      : [new Date(), data.name || '', data.email || '', data.score || 0];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    'Carnival Games logging endpoint is live. POST only.'
  );
}
