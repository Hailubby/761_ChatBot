const google = require('googleapis');
const GoogleAuth = require('google-auth-library');
const config = require('../../../config.json');
const async = require('async');

/**
 * A logger that logs to a google sheet workbook.
 *
 * Workbook belongs to _spgettibot_ Google account.
 */
class GoogleSheetsLogger {
  constructor() {
    this.sheets = google.sheets('v4');
    this.clientSecret = config.GOOGLE_CLIENT_SECRET.installed.client_secret;
    this.clientId = config.GOOGLE_CLIENT_SECRET.installed.client_id;
    this.redirectUrl = config.GOOGLE_CLIENT_SECRET.installed.redirect_uris[0];
    this.googleAuth = new GoogleAuth();
    this.auth = new this.googleAuth.OAuth2(this.clientId, this.clientSecret, this.redirectUrl);
    this.auth.credentials = config.GOOGLE_SHEET_AUTH;

    // Asynchronous queue used here because all cells are tallies and we don't want race conditions
    // when modifying a cell.
    this.overviewQ = async.queue((task, callback) => {
      // get google sheet request then read current value
      let sheetCall = new Promise((resolve, reject) => {
        this.sheets.spreadsheets.values.get(task, (err, res) => {
          if (err) {
            reject(err);
          }
          if (res.values) {
            resolve(res.values[0][0]);
          } else {
            resolve();
          }
        });
      });
      // Write to the sheet
      sheetCall.then(val => {
        // Perform specific logic dictated by this callback.
        callback.call(this, val);
      });
      // We don't even want more than 1 think executing at a time.
    }, 1);
  }

  /**
   * Writes a log to the Google Sheet log workbook.
   *
   * @param {string} senderId The id of the message sender
   * @param {string} text The text sent
   * @param {string} label Label of the log (eg. send, receive)
   */
  log(senderId, text, label) {
    const req = {
      auth: this.auth,
      spreadsheetId: config.GOOGLE_LOGGING_BOOK,
      range: `${senderId}!A1:A3`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        range: `${senderId}!A1:A3`,
        majorDimension: 'ROWS',
        values: [[label, text, new Date(Date.now()).toString()]]
      }
    };
    return new Promise((resolve, reject) => {
      this.sheets.spreadsheets.values.append(req, (err, response) => {
        if (err) {
          // need to be able make the sheet if the error message says that
          // sheet does not exist.
          // eslint-disable-next-line eqeqeq
          if (err.code == 400) {
            reject(err);
          }
          resolve();
        }
      });
    });
  }

  /**
   * Generic append method.
   *
   * Appends to the end of an existing sheet.
   *
   * @param {string} sheetId
   * @param {string[]} values
   */
  append(sheetId, values = []) {
    const req = {
      auth: this.auth,
      spreadsheetId: config.GOOGLE_LOGGING_BOOK,
      range: `${sheetId}!A1:A${values.length}`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        range: `${sheetId}!A1:A${values.length}`,
        majorDimension: 'ROWS',
        values: [values]
      }
    };
    this.sheets.spreadsheets.values.append(req);
  }


  /**
   * Make an individual sheet in the workbook for a new user log.
   *
   * @param {string} senderId The id of the message sender
   * @param {string} senderName Facebook username
   */
  makeSheet(senderId, senderName) {
    let req = {
      spreadsheetId: config.GOOGLE_LOGGING_BOOK,
      auth: this.auth,
      resource: {
        requests: [{
          addSheet: {
            properties: {
              title: senderId
            }
          }
        }]
      }
    };

    return new Promise((resolve, reject) => {
      this.sheets.spreadsheets.batchUpdate(req, (err, response) => {
        if (err) {
          reject(err);
          // This happens, doesn't crash dough.
        } else {
          resolve(response.replies[0].addSheet.properties.sheetId);
        }
      });
    });
  }

  /**
  * Add a link to the other sheets in the workbook to the Table of contents.
  *
  * @param {string} senderId
  * @param {string} sheetGid
  */
  addToToc(senderId, senderName, sheetGid) {
    let sheetUrl = config.GOOGLE_TOC_BASE_URL + sheetGid;
    this.append(config.GOGGLE_TOC_SHEETNAME,
      [senderId, senderName, sheetUrl, new Date(Date.now()).toString()]);
  }

  /**
   * Update user value in Overview sheet.
   */
  overviewAddUser() {
    //read value
    let range = 'Overview!A2:A2',
      readReq = {
        auth: this.auth,
        spreadsheetId: config.GOOGLE_LOGGING_BOOK,
        range: range
      },
      writeReq = {
        auth: this.auth,
        spreadsheetId: config.GOOGLE_LOGGING_BOOK,
        range: range,
        valueInputOption: 'RAW',
        resource: {
          range: range,
          majorDimension: 'ROWS'
        }
      };

    //update no. of users
    this.overviewQ.push(readReq, val => {
      // Check if the value is actually assigned if it's not then it becomes one
      // else increment the value.
      if (val) {
        val++;
      } else {
        val = 1;
      }

      writeReq.resource.values = [[val]];
      this.sheets.spreadsheets.values.update(writeReq,
        err => {
          if (err) {
            throw err;
          }
        });
    });
  }

  /**
   * Update the total summation of all the goals of all the users.
   *
   * Takes in the users ID to check if they have a goal set.
   * @param {string} id
   */
  overviewAddGoal(id) {
    let range = 'Overview!B2:B2';
    let userReadRequest = {
      auth: this.auth,
      spreadsheetId: config.GOOGLE_LOGGING_BOOK,
      // Using the Enum made in StoreKey we only grab the value of Goals.
      range: `${id}!F1:F1`
    },
      overviewReadRequest = {
        auth: this.auth,
        spreadsheetId: config.GOOGLE_LOGGING_BOOK,
        range: range
      },
      writeReq = {
        auth: this.auth,
        spreadsheetId: config.GOOGLE_LOGGING_BOOK,
        range: range,
        valueInputOption: 'RAW',
        resource: {
          range: range,
          majorDimension: 'ROWS'
        }
      };
    // Read a users goal and cheque if a user has a goal set.
    this.overviewQ.push(userReadRequest,
      val => {
        // If the user has no goal before hand that means we need to
        // increment the number of goals.
        if (!val) {
          this.sheets.spreadsheets.values.get(overviewReadRequest, (err, res) => {
            if (err) {
              throw err;
            }
            let goalNo;
            if (res.values) {
              goalNo = res.values[0][0];
              goalNo++;
            } else {
              goalNo = 1;
            }
            //update values on overview page
            writeReq.resource.values = [[goalNo]];
            this.sheets.spreadsheets.values.update(writeReq,
              err => {
                if (err) {
                  throw err;
                }
              });
          });
        }
      });

  }
}

module.exports = GoogleSheetsLogger;
