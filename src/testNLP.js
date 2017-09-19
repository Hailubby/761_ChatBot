const natural = require('natural');
const NLP = require('./nlp.js');
const Command = require('./command.js');

let http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

let nlp = new NLP();

let commands = [new Command(new RegExp('my goals', 'i'), msg => {
  console.log('Picked A');
}),
new Command(/Yes/i, msg => {
  console.log('Picked B');
})];

let followup = [new Command(new RegExp('key', 'i'), msg => {
  console.log('ya');
})];


testMessage('What are my goals, I have a lot of goals, do you want to hear about my goals');
testMessage('What goals do I have');
testMessage('My goals');
testMessage('Goal me up');
testMessage('What are my triggers');
testMessage('What strategies are there');
testMessage('Places near me');
testMessage('Hi there Bot');


function testMessage(text) {
  let message = {};
  message.text = text;
  message.senderID = 0;
  nlp.processMessage(commands, followup, message);
}


// console.log(natural.LevenshteinDistance('goals', 'What are my goals', { search:true }));
