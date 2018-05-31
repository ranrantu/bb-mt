const spawn = require('cross-spawn');
const commandExists = require('command-exists').sync;
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const readFile = require('fs-readfile-promise');
const fullname = require('fullname');
const simpleGit = require('simple-git')();

const TEMPLATES_PATH = path.resolve(__dirname, '../templates/');
const DESTINATION_PATH = process.cwd();

const USER = 'unknown';

class Generator {
  constructor() {
  }

  async initialize() {
    await fullname().then(name => {
      this.fullname = name;
    });
    this.initialComponentVue = await readFile(TEMPLATES_PATH + '/components/initial.vue', 'utf-8');
    this.initialComponentLess = await readFile(TEMPLATES_PATH + '/components/initial.less');
    this.initialModuleVue = await readFile(TEMPLATES_PATH + '/modules/initial.vue');
    this.initialModuleLess = await readFile(TEMPLATES_PATH + '/modules/initial.less');
  }

  generate() {
    this._generateGit();
  }

  async addModule(name) {
    const dir = DESTINATION_PATH + '/src/module/' + name + '/';
    const existDir = await fs.existsSync(dir);
    if (!existDir) {
      await fse.mkdirsSync(dir);
    }
    await fse.outputFile(dir + name + '.less', this.initialModuleLess);
    await fse.outputFile(dir + name + '.vue', this.initialModuleVue);
    await fse.outputFile(dir + name + '.js', this.initialModuleVue);
    await fse.outputFile(dir + 'index.js', this.initialModuleVue);
  }

  async addComponent(name) {
    const {username, email} = await new Promise(resolve => {
      simpleGit.raw(['config', '--list'], (err, result) => {
        let gitConfig = {};
        result.split('\n').forEach(item => {
          const freg = item.split('=');
          gitConfig[freg[0]] = freg[1];
        });
        return resolve({
          username: gitConfig['user.name'],
          email: gitConfig['user.email']
        });
      });
    });
    const date = new Date();
    const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    let info = {
      componentName: name,
      username,
      email,
      datetime: dateString
    };
    const vueData = this.initialComponentVue.replace(/\{[^\}]+\}/g, function (keyword) {
      return info[keyword.slice(1, -1)];
    });

    const dir = DESTINATION_PATH + '/src/components/' + name + '/';
    const existDir = await fs.existsSync(dir);
    if (!existDir) {
      await fse.mkdirsSync(dir);
    }
    await fse.outputFile(dir + name + '.less', this.initialComponentLess);
    await fse.outputFile(dir + name + '.vue', vueData);
    console.log('Success! a component named '+name+' created!');
  }

  templatePath(filename) {
    return TEMPLATES_PATH + filename;
  }

  destinationPath(filename) {
    return DESTINATION_PATH + filename;
  }

  copy(from, to, callback) {
    fs.copy(from, to).then(() => console.log('success!'))
      .catch(err => console.error(err));
  }

  _generateGit() {
    this.copy(
      this.templatePath('/.gitignore'),
      this.destinationPath('/.gitignore')
    );
  }

  _generatePackageJSON() {
    this.copy(
      this.templatePath('pacakge.json'),
      this.destinationPath('pacakage.json')
    )
  }

  _generateEditorConfig() {
    this.copy(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig')
    )
  }

  install() {
    const hasYarn = commandExists('yarn');
    if (hasYarn) {
      spawn('yarn', 'install');
    } else {
      spawn('npm', 'install');
    }
  }
}

module.exports = new Generator();
