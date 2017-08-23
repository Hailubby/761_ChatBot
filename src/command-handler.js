// imports
const conversation = require("./conversation.js")
/**
 * Command handler deals with the text thats passed in through facebook and decides
 * which responses need to be made based on the the conversation objects.
 *
 * This is the natural language processing unit.
 */
class CommandHandler {

  constructor(){
    this.conversations = {
      "userid" : new conversation()
    }
    // TODO: Levenshtein distance for words.
    this.affirmative = /yes|y|yse|yep|yea|ye|ype|yae|ey|affirmative/i
    this.negative = /no|n|nope|nah|na|nha|nay|negative|ne/i;
    this.general = RegExp(`${this.variable}`,"i");
  }

  parseMessage(message, args =  {}){
    if(this.affirmative.test(message)){
      console.log("yes")
    }else if(this.negative.test(message)){
      console.log("no");
    }
  }

}
