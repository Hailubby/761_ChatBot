/**
  * Command objects encapsulate a conversation between the bot and a single user.
  *
  * The respond object "function" is responsible for handling multiple responses for the same key.
 */
class Command {
  /**
   * @param {string} key key to construct matching function
   * @param {function} respond function that accepts a Microsoft *session* obj to respond to the user
   * @param {Command[]} followup a list of commands that continue the conversation thread
   */
  constructor(key, respond = session => {}, followup = []){
    // name of key
    this.key = new RegExp(key, 'i');
    // Response this convo gives
    this.respond = respond;
    // follow up convos
    this.followup = followup;
  }

  /**
   * Checks whether this command matches (ie. should respond to) the message
   *
   * @param {string} message Message to test for match with this command
   */
  match(message) {
    return this.key.test(message);
  }
}

module.exports = Command;
