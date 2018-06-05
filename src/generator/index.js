const spawn = require('cross-spawn');
const commandExists = require('command-exists').sync;
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const readFile = require('fs-readfile-promise');
const fullname = require('fullname');
const simpleGit = require('simple-git')();
const shell = require('shelljs');
const inquirer = require('inquirer');
const cliSpinners = require('cli-spinners');

const TEMPLATES_PATH = path.resolve(__dirname, '../templates/');
const DESTINATION_PATH = process.cwd();

class Generator {

  async initialize() {
    await fullname().then(name => {
      this.fullname = name;
    });

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

    this.username = username;
    this.email = email;
  }

  async addModule(name) {
    const info = {
      componentName: name,
      username: this.username,
      email: this.email,
      datetime: this.getNow()
    };
    const dir = DESTINATION_PATH + '/src/modules/' + name + '/';
    const existDir = await fs.existsSync(dir);
    if (!existDir) {
      await fse.mkdirsSync(dir);
    }
    await this.copyFile(
      TEMPLATES_PATH + '/modules/initial.less',
      dir + name + '.less'
    );
    await this.copyFile(
      TEMPLATES_PATH + '/modules/initial.vue',
      dir + name + '.vue'
    );
    const indexFileDir = DESTINATION_PATH + '/src/modules/index.js';
    const existIndexFile = await fs.existsSync(indexFileDir);
    if (!existIndexFile) {
      await this.copyFile(
        TEMPLATES_PATH + '/modules/commonIndex.js',
        indexFileDir,
        {
          match: /defaultModule/g,
          callback: name
        }
      );
    } else {
      await this.echo2File(
        "export { default as " + name + " } from './" + name + "';",
        indexFileDir,
        "./" + name
      );
    }

    await this.copyFile(
      TEMPLATES_PATH + '/modules/index.js',
      dir + 'index.js',
      [{
        match: /\~[^\~]+\~/g,
        callback: function (keyword) {
          return info[keyword.slice(1, -1)];
        }
      }, {
        match: /moduleName/g,
        callback: name
      }]
    );

    await this.copyFile(
      TEMPLATES_PATH + '/modules/constants.js',
      dir + name + 'Constants.js'
    );

    console.log('Success! a module named ' + name + ' created!');
  }

  async addComponent(name) {
    const info = {
      componentName: name,
      username: this.username,
      email: this.email,
      datetime: this.getNow()
    };
    // 向components文件夹拷贝组件模板
    const dir = DESTINATION_PATH + '/src/components/' + name + '/';
    const existDir = await fs.existsSync(dir);
    if (!existDir) {
      await fse.mkdirsSync(dir);
    }
    await this.copyFile(
      TEMPLATES_PATH + '/components/initial.less',
      dir + name + '.less'
    );
    await this.copyFile(
      TEMPLATES_PATH + '/components/initial.vue',
      dir + name + '.vue',
      {
        match: /\{[^\}]+\}/g,
        callback: function (keyword) {
          return info[keyword.slice(1, -1)];
        }
      }
    );
    const indexFileDir = DESTINATION_PATH + '/src/components/index.js';
    const existIndexFile = await fs.existsSync(indexFileDir);
    if (!existIndexFile) {
      await this.copyFile(
        TEMPLATES_PATH + '/components/commonIndex.js',
        indexFileDir,
        [{
          match: /\~[^\~]+\~/g,
          callback: function (keyword) {
            return info[keyword.slice(1, -1)];
          }
        },{
          match: /componentName/g,
          callback: name
        }]
      );
      // shell.exec('echo "export { default as ' + name + ' } from \'./' + name + '/' + name + '\';" >> ' + indexFileDir);
    } else {
      await this.echo2File(
        "export { default as " + name + " } from './" + name + "/" + name + "';",
        indexFileDir,
        "./" + name + "/" + name
      );
    }


    console.log('Success! a component named ' + name + ' created!');
  }

  async echo2File(string, dir, check) {
    try {
      const data = await readFile(dir, 'utf-8');
      let array = data.split('\n');
      let flag = 0;
      let exist = false;
      array.forEach((item, index) => {
        const match = /from/g.test(item);
        exist = new RegExp(check, 'g').test(item) || exist;
        if (match) {
          flag = index;
        }
      });
      !exist && array.splice(flag + 1, 0, string);

      await fse.outputFile(dir, array.join('\n'));

    } catch (e) {
      console.log(e)
    }
  }

  async copyFile(from, to, filter = null) {
    try {
      let data = await readFile(from, 'utf-8');
      if (filter) {
        if (Array.isArray(filter)) {
          filter.forEach(item => {
            data = data.replace(item.match, item.callback);
          })
        } else {
          data = data.replace(filter.match, filter.callback);
        }
      }
      await fse.outputFile(to, data);
    } catch (e) {
      console.log(e)
    }
  }

  getNow() {
    const date = new Date();
    const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return dateString;
  }
}

module.exports = new Generator();
