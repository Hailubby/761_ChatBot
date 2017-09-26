const google = require('googleapis');
const GoogleAuth = require('google-auth-library');
const config = require('../../../config.json');

/**
 * A logger that logs to a google sheet workbook.
 *
 * Workbook belongs to spgettibot goolge account.
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
        this.sheets.spreadsheets.values.append(req, (err, response) => {
            if (err) {
                // need to be able make the sheet if the error message says that
                // sheet does not exist.
                // eslint-disable-next-line eqeqeq
                if (err.code == 400) {
                    this.makeSheet(senderId);
                    this.log(senderId, text, label);
                }
            }
        });
    }

    /**
     * Generic append method.
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
        this.sheets.spreadsheets.values.append(req, (err, response) => {
            if (err) {
                // need to be able make the sheet if the error message says that
                // sheet does not exist.
                // eslint-disable-next-line eqeqeq
                if (err.code == 400) {
                    console.log(err);
                    // this.makeSheet(sheetId);
                    // this.append(sheetId, values);
                }
            }
        });
    }


    /**
     * Make an individual sheet in the workbook for a new user log.
     *
     * @param {string} senderId The id of the message sender
     */
    makeSheet(senderId) {
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

        this.sheets.spreadsheets.batchUpdate(req, (err, response) => {
            if (err) {
                console.error('If this error says:',
                    '"Invalid requests[0].addSheet: Sheet already exists. Please enter another name."',
                    ' then ignore it\n',
                    err);
                return;
            } else {
                this.addToToc(senderId, response.replies[0].addSheet.properties.sheetId);
            }
            console.log(response);
        });
    }
    /**
    * Add a link to the other sheets in the workbook to the ToC.
    *
    * @param {string} senderId
    * @param {string} sheetGid
    */
    addToToc(senderId, sheetGid) {
        console.log('SENDERID:', senderId);
        let sheetUrl = config.GOOGLE_TOC_BASE_URL + sheetGid;
        this.append(config.GOGGLE_TOC_SHEETNAME, [senderId, sheetUrl]);
    }
}

module.exports = GoogleSheetsLogger;
