const fs = require('fs');
const path = require('path');

class PageBuild {
  constructor() {
    this.target = path.join(__dirname, '/project-dist');
  }

  async execute() {
    await this.makeDir(this.target).then(() => {
      const assets = path.join(this.target, '/assets');
      this.makeDir(assets).then(() => {
        const fonts = path.join(assets, '/fonts');
        this.makeDir(fonts).then(() => {
          this.copyDir(path.join(__dirname, '/assets/fonts'), fonts);
        });
        const img = path.join(assets, '/img');
        this.makeDir(img).then(() => {
          this.copyDir(path.join(__dirname, '/assets/img'), img);
        });
        const svg = path.join(assets, '/svg');
        this.makeDir(svg).then(() => {
          this.copyDir(path.join(__dirname, '/assets/svg'), svg);
        });
      });
    }).then(() => {
      this.createHtmlTemplate();
    }).then(() => {
      this.createCssBundle();
    });
  }

  async makeDir(dir) {
    try {
      await fs.promises.rm(dir, {recursive: true}, () => {
        console.log(`Directory ${dir} deleted.\n`);
      });
    } catch (error) {
      console.log(`No such directory ${dir}.\n`);
    }
    try {
      await fs.promises.mkdir(dir, {recursive: true}, () => {
        console.log(`Directory ${dir} created.\n`);
      });
    } catch (error) {
      console.log(`Unable to create directory ${dir}.\n`);
    }
  }

  async copyDir(source, target) {
    const files = await fs.promises.readdir(source, {withFileTypes: true});
    files.forEach(file => {
      if (file.isFile()) {
        this.copyFile(source, target, file.name);
      }
    });
  }

  async copyFile(source, target, file) {
    try {
      await fs.promises.copyFile(path.join(source, `/${file}`), path.join(target, `/${file}`));
      console.log('Copy', source + file, '=>', target + file);
    } catch (error) {
      console.log(error);
    }
  }

  async readFile(file) {
    const stream = fs.ReadStream(file);
    const chunks = [];
    for await (const item of stream) {
      chunks.push(item);
    }
    return chunks.toString().trim();
  }

  async createHtmlTemplate() {
    let template = await this.readFile(path.join(__dirname, 'template.html'));
    const componentsPath = path.join(__dirname, '/components');
    const files = await fs.promises.readdir(componentsPath, {withFileTypes: true});
    for (let file of files) {
      console.log(file.name);
      if (file.isFile() && path.extname(file.name) === '.html') {
        const content = await this.readFile(path.join(componentsPath, `/${file.name}`));
        const fileName = path.basename(file.name, path.extname(file.name));
        template = template.replace(`{{${fileName}}}`, `${content}`);
      }
    }
    await fs.promises.writeFile(path.join(this.target, '/index.html'), `${template}`, {flag: 'w'}, error => {
      if (error) throw error;
    });
  }

  async createCssBundle() {
    const stylesPath = path.join(__dirname, '/styles');
    const files = await fs.promises.readdir(stylesPath, {withFileTypes: true});
    for (let file of files) {
      console.log(file.name);
      if (file.isFile() && path.extname(file.name) === '.css') {
        const css = await this.readFile(path.join(stylesPath, `/${file.name}`));
        fs.promises.appendFile(path.join(this.target, '/style.css'), css, {flag: 'a'}, error => {
          if (error) throw error;
        });
      }
    }
  }
}

const pageBuild = new PageBuild();
pageBuild.execute();