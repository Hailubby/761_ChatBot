const google = require('googleapis');
const GoogleAuth = require('google-auth-library');
let StoreKeys = require('./StoreKeys');
const config = require('../../../config.json');

/**
 * A store that stores data in a google sheet workbook.
 *
 * Workbook belongs to spgettibot google account.
 */
class GoogleSheetsStore {
  constructor() {
    this.sheets = google.sheets('v4');
    this.clientSecret = config.GOOGLE_CLIENT_SECRET.installed.client_secret;
    this.clientId = config.GOOGLE_CLIENT_SECRET.installed.client_id;
    this.redirectUrl = config.GOOGLE_CLIENT_SECRET.installed.redirect_uris[0];
    this.googleAuth = new GoogleAuth();
    this.auth = new this.googleAuth.OAuth2(this.clientId, this.clientSecret, this.redirectUrl);
    this.auth.credentials = config.GOOGLE_SHEET_AUTH;
  }

  /**
   * Writes data *value* belonging to provided *id* and *key* to GoogleSheets.
   * NOTE: Sheet access specified in config.json
   *
   * @param {string} id
   * @param {string} key
   * @param {string} value
   */
  write(id, key, value) {
    StoreKeys = require('./StoreKeys');
    const req = {
      auth: this.auth,
      spreadsheetId: config.GOOGLE_LOGGING_BOOK,
      range: `${id}!E${key}:F${key}`,
      valueInputOption: 'RAW',
      resource: {
        range: `${id}!E${key}:F${key}`,
        majorDimension: 'ROWS',
        values: [[StoreKeys.Keys[key], value]]
      }
    };
    this.sheets.spreadsheets.values.update(req, (err, res) => {
      if (err) {
        console.error(err);
      }
    });
  }

  /**
   * Reads data belonging to provided *key* and *value* from GoogleSheets.
   * NOTE: Sheet access specified in config.json
   *
   * @param {string} id
   * @param {string} key
   */
  read(id, key) {
    StoreKeys = require('./StoreKeys');
    return new Promise( (resolve, reject) => {
        const req = {
          auth: this.auth,
          spreadsheetId: config.GOOGLE_LOGGING_BOOK,
          range: `${id}!E${key}:F${key}`
        };

        this.sheets.spreadsheets.values.get(req, (err, res) => {
            if (err){
                reject(err);
            }
            resolve(res.values[0][1]);
        });
    });
  }
}

module.exports = GoogleSheetsStore;
