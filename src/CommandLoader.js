const Command = require('./command');
const config = require('../config.json');

/**
 * Loads sets of commands
 */
class CommandLoader {
  constructor() {}

  shouldLoad(module) {
    return config.LOAD_MODULES.includes(module);
  }

  /**
   * Loads a set of commands (see Command.js) based on ../config.json LOAD_MODULES.
   *
   * WARN: Spreadsheet based commands should conform to template.
   */
  load() {
    let commands = [];
    if (this.shouldLoad('CONVERSATION')) {
      this.conversationJSON = require('../resources/conversation.json');
      this.followUpJSON = require('../resources/followup.json');

      for (let i = 0; i < this.conversationJSON.length; i++) {
        commands.push(this.getCommand(i, this.conversationJSON));
      }
    }

    return commands;
  }

  /**
   * Loads a command
   * @param {int} id
   * @param {object} json
   */
  getCommand(id, json) {
    const obj = json[id];
    const key = obj['Key'];
    const respond = this.makeResponse(obj);

    let followUpsIDArr = obj['Follow Ups'];

    if (followUpsIDArr) {
      followUpsIDArr = followUpsIDArr.split(';').map(function(item) {
        return item.trim();
      });
    }

    let followUpsArr = [];

    if (followUpsIDArr) {
      followUpsIDArr.forEach(followUpID => {
        followUpsArr.push(this.getCommand(followUpID, this.followUpJSON));
      });
    }

    return new Command(key, respond, followUpsArr);
  }

  /**
   * Makes a response function based on the command object.
   *
   * @param {*} obj - An excel row object
   */
  makeResponse(obj) {
      if (obj['Response Type'] === 'String') {
          return this.makeStringFunction(obj['Bot Response']);
      }
  }

  /**
   * Makes a Command.respond function sending a string as a message.
   * @param {string} responseMsg
   */
  makeStringFunction(responseMsg) {
    const instructions = `msg.sendMessage("${responseMsg}");`;
    const func = new Function('msg', instructions);

    return (func);
  }
}

module.exports = CommandLoader;
