const google = require('googleapis');
const GoogleAuth = require('google-auth-library');
const StoreKeys = require('./StoreKeys');
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
   *
   * @param {*} id
   * @param {*} key
   * @param {*} value
   */
  write(id, key, value) {
    const req = {
      auth: this.auth,
      spreadsheetId: config.GOOGLE_LOGGING_BOOK,
      range: `${id}!E${key}:F${key}`,
      valueInputOption: 'RAW',
      resource: {
        range: `${id}!E${key}:F${key}`,
        majorDimension: 'ROWS',
        values: [[StoreKeys[key], value]]
      }
    };
    console.log(req);
    this.sheets.spreadsheets.values.update(req, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
  }

  /**
   *
   * @param {*} id
   * @param {*} key
   */
  read(id, key) {
    return 'hello';
  }
}

module.exports = GoogleSheetsStore;
