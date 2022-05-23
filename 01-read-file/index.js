const fs = require('fs');
const path = require('path');

class ReadNotes {
  constructor() {
    this.fileName = path.join(__dirname, 'text.txt');
  }
  view() {
    fs.createReadStream(this.fileName, {encoding: 'utf8'})
      .on('data', (data) => {
        console.log(data);
      });
  }
}


const readNotes = new ReadNotes();
readNotes.view();