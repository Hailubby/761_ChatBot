const fs = require('fs');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const spagSheet = '1sapWQp1Xom9xFt0G2cWUGumh3pUsXHDMtWQf0_7HPFg';
const config = require('../config.json');
const SCOPE = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = './sheets_auth.json';

// function logMessage(userID, msg){
//   if (!fs.exists('../log/log.txt')){
//     fs.writeFile('../log/log.txt', 'hey');
//   }
// }


// function logMessage(userID, msg) {
//   let request = {
//     spreadsheetId: spreadsheetId,
//     range: 'sheetID' + '!A1:A2',
//     valueInputOption: 'RAW',
//     insertDataOption: 'INSERT_ROWS',
//     resource: {},
//     auth
//   };

//   let folder = '../log';
//   let file = `../log/${userID}.txt`;
//   let message = new Date(Date.now()).toString() + ': ' + msg.text;
//   if (!fs.exists(folder)) {
//     fs.mkdir(folder);
//   }
//   if (!fs.exists(file)) {
//     fs.writeFile(file, message);
//   } else {
//     fs.write(file, message);
//   }
// }

class Log {
  constructor() {
    this.sheets = google.sheets('v4');
  }

  append(userId, message) {
    this.clientSecret = config.CLIENT_SECRET.installed.client_secret;
    this.clientId = config.CLIENT_SECRET.installed.client_id;
    this.redirectUrl = config.CLIENT_SECRET.installed.redirect_uris[0];
    this.googleAuth = new googleAuth();
    this.auth = new this.googleAuth.OAuth2(this.clientId, this.clientSecret, this.redirectUrl);
    this.auth.credentials = config.SHEET_AUTH;
    console.log(this.auth);
    let req = {
      auth: this.auth,
      spreadsheetId: spagSheet,
      range: userId + '!A1:A2',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS'
    };

    this.sheets.spreadsheets.values.append(req, (err, response) => {
      if (err) {
        // need to be able make the sheet if the error message says that
        // sheet does not exist.
        console.error(err);
        return;
      }
      // TODO: Change code below to process the `response` object:
      console.log(JSON.stringify(response, null, 2));
    });
  }
}
module.exports = Log;
