const fs = require('fs');
const path = require('path');
const {stdout} = process;

class MergeStyles {
  constructor() {
    this.source = path.join(__dirname, '/styles');
    this.target = path.join(__dirname, '/project-dist/bundle.css');
  }

  execute() {
    fs.writeFile(this.target, '', error => {
      if (error) throw error;
    });
    fs.readdir(this.source, {withFileTypes: true}, (error, files) => {
      if (error) throw error;
      files.forEach(file => {
        if (file.isFile() && path.extname(file.name) === '.css') {
          this.read(file.name).then(el => {
            fs.appendFile(this.target, el, error => {
              if (error) throw error;
            });
          });
        }
      });
    });
  }

  async read(file) {
    const arr = [];
    const stream = fs.createReadStream(path.join(this.source, `/${file}`), 'utf8');
    for await (let item of stream) {
      arr.push(item);
    }
    return arr.toString();
  }
}

const mergeStyles = new MergeStyles();
mergeStyles.execute();