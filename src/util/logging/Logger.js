const GLogger = require('./GoogleSheetsLogger');

/**
 * General purpose logger.
 */
class Logger {
  constructor() {
    this.logger = new GLogger();
  }

  /**
   * Writes a log.
   *
   * @param {string} senderId The id of the message sender
   * @param {string} text The text sent
   * @param {string} label Label of the log (eg. send, receive)
   */
  log(senderId, text, sendRec) {
    return this.logger.log(senderId, text, sendRec);
  }

  /**
   * Make the log for a user.
   *
   * @param {string} senderId
   * @param {string} senderName
   */
  init(senderId, senderName) {
    return this.logger.makeSheet(senderId, senderName)
      .then(sheetId => {
        this.logger.addToToc(senderId, senderName, sheetId);
      });
  }
}

module.exports = Logger;
