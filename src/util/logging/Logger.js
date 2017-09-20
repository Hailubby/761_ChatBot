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
        this.logger.log(senderId, text, sendRec);
    }
    
    logUserData(senderId, userDataType, value){
        this.logger.logUserData(senderId, userDataType, value);
    }
}

module.exports = Logger;
