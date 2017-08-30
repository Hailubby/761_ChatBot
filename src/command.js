class Command {
  /**
   * Command objects encapsulate a conversation between the bot and a single user.
   *
   * @param {RegExp} key
   * @param {function} respond
   * @param {Command[]} followup
   */
  constructor(key="", respond=(msg) => {}, followup = []){
    // name of key
    this.key = key;
    // Response this convo gives
    this.respond = respond;
    // follow up convos
    this.followup = followup;
  }
}

module.exports = Command;
