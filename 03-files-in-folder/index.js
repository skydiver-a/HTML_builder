const fs = require('fs');
const path = require('path');
const {stdout} = process;

class FilesInFolder {
  constructor() {
    this.path = path.join(__dirname, '/secret-folder');
  }

  get() {
    fs.readdir(this.path, {withFileTypes: true}, (error, files) => {
      if (error) return stdout.write(error);
      files.forEach(file => {
        if (file.isFile()) {
          const extension = path.extname(file.name);
          const fileName = path.basename(file.name, extension);
          fs.stat(path.join(this.path, file.name), (error, stat) => {
            stdout.write(`${fileName} - ${extension.slice(1)} - ${stat.size}b\n`);
          });
        }
      });
    });
  }
}

const files = new FilesInFolder();
files.get();