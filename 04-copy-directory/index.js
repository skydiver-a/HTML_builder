const fs = require('fs');
const path = require('path');
const {stdout} = process;

class CopyDirectory {
  constructor() {
    this.source = path.join(__dirname, '/files');
    this.target = path.join(__dirname, '/files-copy');
  }

  copyDir() {
    fs.readdir(this.source, {withFileTypes: true}, (error, files) => {
      if (error) throw error;
      files.forEach(file => {
        if (file.isFile()) {
          this.copyFile(file);
        }
      });
    });
  }

  copyFile(file) {
    const sourceFile = path.join(this.source, `/${file.name}`);
    const targetFile = path.join(this.target, `/${file.name}`);
    fs.copyFile(sourceFile, targetFile, error => {
      if (error) throw error;
      stdout.write(`File ${file.name} copied.\n`);
    });
  }

  makeDir() {
    fs.mkdir(this.target, {recursive: true}, (error) => {
      if (error) throw error;
      stdout.write(`Folder ${this.target} created.\n`);
      this.copyDir();
    });
  }

  removeDir() {
    fs.rm(this.target, {recursive: true}, (error) => {
      if (error) throw error;
      stdout.write(`Folder ${this.target} deleted.\n`);
      this.makeDir();
    });
  }
}

const copyDirectory = new CopyDirectory();
copyDirectory.removeDir();