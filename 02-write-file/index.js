
const fs = require('fs');
const path = require('path');

const readline = require('readline');
const readLines = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class WriteNotes {
  constructor(readLines) {
    process.on('exit', () => this.messageGoodBye());
    this.readLines = readLines.on('line', (line) => this.set(line));
  }
  set(line) {
    if (line === 'exit') {
      this.readLines.close();
      process.exit();
    }
    fs.createWriteStream(path.join(__dirname, 'text.txt'), {encoding: 'utf8'}).write(`${line}\n`);
  }
  messageHello() {
    console.log('Hello, input something:');
  }
  messageGoodBye() {
    console.log('Goodbye.');
    this.readLines.close();
    process.exit();
  }
}

const writeNotes = new WriteNotes(readLines);
writeNotes.messageHello();
writeNotes.set('');