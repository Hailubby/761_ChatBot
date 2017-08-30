const fs = require('fs');
const google = require('googleapis');
const spreadsheetId = '1O9wezFhbFq6rrzcmH8Uu_ngoiApjYXYX0-5nptkakE8';
// function logMessage(userID, msg){
//   if (!fs.exists('../log/log.txt')){
//     fs.writeFile('../log/log.txt', 'hey');
//   }
// }


function logMessage(userID, msg){
  let request = {
    spreadsheetId : spreadsheetId,
    range : 'sheetID' + '!A1:A2',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource : {},
    auth
  };

  let folder= '../log';
  let file = `../log/${userID}.txt`;
  let message = new Date(Date.now()).toString() + ': ' + msg.text;
  if (!fs.exists(folder)){
    fs.mkdir(folder);
  }
  if (!fs.exists(file)){
    fs.writeFile(file, message);
  } else {
    fs.write(file, message);
  }
}

class Log {
  constructor(){

  }
}
module.exports = logMessage;
