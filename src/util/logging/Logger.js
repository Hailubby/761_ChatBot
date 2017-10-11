const GLogger = require('./GoogleSheetsLogger');

/**
 * General purpose logger.
 *
 * Uses the singleton design pattern so when imported do not instansiate just use immediately.
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
   * Make the log for a user if the user does not already exist.
   *
   * @param {string} senderId
   * @param {string} senderName
   */
  init(senderId, senderName) {
    return this.logger.makeSheet(senderId, senderName)
      .then(sheetId => {
        // Add a new row to the table of contents representing this user
        this.logger.addToToc(senderId, senderName, sheetId);
        // Increment the count of the total number of users.
        this.logger.overviewAddUser();
      });
  }

  /**
   * Update the global goal count, has logic to check that the user has not
   * already set a goal.
   *
   * @param {string} userID
   */
  overviewAddGoal(userID) {
    return new Promise((resolve, reject) => {
      this.logger.overviewAddGoal(userID);
      resolve();
    });
  }

}
let single = new Logger();
module.exports = single;
