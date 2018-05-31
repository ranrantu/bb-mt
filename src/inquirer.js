const inquirer = require('inquirer');
const fullname = require('fullname');
const gen = require('./generator');
const shell = require('shelljs');

module.exports =  async function inquire() {
  const username = await fullname();
  console.log(username);

  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Hello ' + username + '! What do you want to do?',
        choices: [
          'add component',
          'add module',
          new inquirer.Separator(),
          'init project',
          'build project',
          'run devServer'
        ]
      },
      {
        type:'input',
        name:'componentName',
        message:'input a component name',
        when:async function (answers){
          return answers.choice
        }
      }
    ]).then(answers=>{
      shell.exec('bb '+answers.choice+' '+answers.componentName);
    })
}

