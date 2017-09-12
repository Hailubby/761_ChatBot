class Command {
  /**
   * Command objects encapsulate a conversation between the bot and a single user.
   *
   * The respond object "function" is responsible for handling multiple responses for the same key.
   *
   * @param {string} key
   * @param {function} respond
   * @param {Command[]} followup
   */
  constructor(key, respond = session => {}, followup = []){
    // name of key
    this.key = new RegExp(key, 'i');
    // Response this convo gives
    this.respond = respond;
    // follow up convos
    this.followup = followup;
  }
}

module.exports = Command;
