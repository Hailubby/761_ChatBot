/**
 * Conversatons are storage modules that keep track of a users history of
 * conversation with the bot.
 */
class Conversation {
  constructor(){
    this.userID = "";
    this.lastmessages = ["what do"];
    this.history = [];
  }

  getMostRecent(){

  }

  /**
   *
   * @param {string} msg
   */
  checkSaid(msg){

  }
}

module.exports = Conversation;
