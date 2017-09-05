const fs = require('fs');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const spagSheet = '1sapWQp1Xom9xFt0G2cWUGumh3pUsXHDMtWQf0_7HPFg';

const SCOPE = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = '././sheets_auth.json';
// function logMessage(userID, msg){
//   if (!fs.exists('../log/log.txt')){
//     fs.writeFile('../log/log.txt', 'hey');
//   }
// }


function logMessage(userID, msg) {
  let request = {
    spreadsheetId: spreadsheetId,
    range: 'sheetID' + '!A1:A2',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {},
    auth
  };

  let folder = '../log';
  let file = `../log/${userID}.txt`;
  let message = new Date(Date.now()).toString() + ': ' + msg.text;
  if (!fs.exists(folder)) {
    fs.mkdir(folder);
  }
  if (!fs.exists(file)) {
    fs.writeFile(file, message);
  } else {
    fs.write(file, message);
  }
}

class Log {
  constructor() {
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', (err, content) => {
      console.log(TOKEN_PATH);
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the
      // Google Sheets API.
      this.sheets = google.sheets('v4');
      authorize(JSON.parse(content), listMajors);
    });
  }

  authorize(credentials, callback) {
    this.clientSecret = credentials.installed.client_secret;
    this.clientId = credentials.installed.client_id;
    this.redirectUrl = credentials.installed.redirect_uris[0];
    this.auth = new googleAuth();
    this.oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
      if (err) {
        getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
      }
    });
  }

  append(userId, message){
    let req = {
      auth: this.auth,
      spreadsheetId: spagSheet,
      range: userId + '!A1:A2',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
    };

    sheets.spreadsheets.values.append(req, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
      // TODO: Change code below to process the `response` object:
      console.log(JSON.stringify(response, null, 2));
    });
  }

}
module.exports = Log;
