const inquirer = require('inquirer');
const fullname = require('fullname');
const gen = require('./generator');
const shell = require('shelljs');

module.exports = async function inquire() {
  const username = await
    fullname();

  const enterChoice = [
    {
      cli: 'add component',
      callback: async function () {
        await inquirer
          .prompt([{
            type: 'input',
            name: 'componentName',
            message: 'input a component name'
          }]).then(answers => {
            shell.exec('bb add component ' + answers.componentName);
          })
      }
    },
    {
      cli: 'add module',
      callback: async function () {
        await inquirer
          .prompt([{
            type: 'input',
            name: 'moduleName',
            message: 'input a component name'
          }]).then(answers => {
            shell.exec('bb add module ' + answers.moduleName);
          })
      }
    },
    - 1,
    {
      cli:'init project'
    },
    {
      cli:'build project'
    },
    {
      cli:'run devServer'
    }
  ];
  const globalQuestions = [{
    type: 'list',
    name: 'choice',
    message: 'Hello ' + username + '! What do you want to do?',
    choices: enterChoice.map(item => {
      if(item === -1){
        return new inquirer.Separator();
      }else{
        return item.cli;
      }
    })
  }];
  inquirer
    .prompt(globalQuestions).then(answers => {
      enterChoice.some(item => {
        if (item !== -1 && answers.choice === item.cli) {
          item.callback && item.callback(item.cli,)
        }
      });
    })
}

