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
 * 6. Copy the "Web app URL" it gives you — that's your SCRIPT_URL,
 *    already wired into all of the game HTML files.
 *
 * This script auto-creates one tab per game the first time it's played.
 * To add a new game later, just add an entry to GAMES below and use
 * that same key as the "game" value in the game's fetch() call.
 */

var GAMES = {
  'duck-pond': {
    tab: 'DuckPond',
    headers: ['Timestamp', 'Name', 'Email', 'Duck Picked'],
    row: function(d) { return [new Date(), d.name || '', d.email || '', d.pick || '']; }
  },
  'balloon-pop': {
    tab: 'BalloonPop',
    headers: ['Timestamp', 'Name', 'Email', 'Score'],
    row: function(d) { return [new Date(), d.name || '', d.email || '', d.score || 0]; }
  },
  'whack-a-dash': {
    tab: 'WhackADash',
    headers: ['Timestamp', 'Name', 'Email', 'Score'],
    row: function(d) { return [new Date(), d.name || '', d.email || '', d.score || 0]; }
  },
  'shell-game': {
    tab: 'ShellGame',
    headers: ['Timestamp', 'Name', 'Email', 'Result'],
    row: function(d) { return [new Date(), d.name || '', d.email || '', d.result || '']; }
  },
  'high-striker': {
    tab: 'HighStriker',
    headers: ['Timestamp', 'Name', 'Email', 'Score'],
    row: function(d) { return [new Date(), d.name || '', d.email || '', d.score || 0]; }
  }
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var data = JSON.parse(e.postData.contents);
    var config = GAMES[data.game];

    if (!config) {
      return jsonOut({ status: 'error', message: 'Unknown game: ' + data.game });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(config.tab);

    if (!sheet) {
      sheet = ss.insertSheet(config.tab);
      sheet.appendRow(config.headers);
    }

    sheet.appendRow(config.row(data));

    return jsonOut({ status: 'ok' });

  } catch (err) {
    return jsonOut({ status: 'error', message: err.message });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var action = e.parameter.action;
  var game = e.parameter.game;

  if (action === 'count' && GAMES[game]) {
    return jsonOut({ count: getEntryCount_(GAMES[game].tab) });
  }

  return ContentService.createTextOutput(
    'Carnival Games logging endpoint is live. POST only.'
  );
}

function getEntryCount_(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return 0;
  return Math.max(0, sheet.getLastRow() - 1);
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
