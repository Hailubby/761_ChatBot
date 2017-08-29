class Command {
  /**
   * Command objects encapsulate a conversation between the bot and a single user.
   *
   * @param {string} key
   * @param {function} respond
   * @param {Command[]} followup
   */
  constructor(key="", respond=(msg) => {}, followup = []){
    // name of key
    this.key;
    // Response this convo gives
    this.respond;
    // follow up convos
    this.followup;
  }
}

module.exports = Command;
