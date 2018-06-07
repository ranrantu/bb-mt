'use strict';
const gen = require('./generator');
const inquirer = require('./inquirer');

(async () => {
  await gen.initialize();
  await require('yargs')
    .usage('Usage: hello [options]')
    .example('bb add module hi', 'add a module named "hi"')
    // .help('h')
    // .alias('h', 'help')
    .epilog('copyright 2015')
    .command('add', 'add', yargs => {
      yargs.command('module', 'add module', async yargs => {
        if (yargs.argv._[2]) {
          await gen.addModule(yargs.argv._[2]);
        } else {
          console.log('you should assign a specific module name');
        }
      });
      yargs.command('component', 'add component', async yargs => {
        if (yargs.argv._[2]) {
          await gen.addComponent(yargs.argv._[2]);
        } else {
          console.log('you should assign a specific component name');
        }
      });
      yargs.command('*', '', (yargs) => {
        inquirer();
      });
    })
    .command('remove', 'remove', yargs => {
      yargs.command('module', 'remove module', async yargs => {
        if (yargs.argv._[2]) {
          await gen.removeModule(yargs.argv._[2]);
        } else {
          console.log('you should assign a specific module name');
        }
      });
      yargs.command('component', 'remove component', async yargs => {
        if (yargs.argv._[2]) {
          await gen.removeComponent(yargs.argv._[2]);
        } else {
          console.log('you should assign a specific component name');
        }
      })
    })
    .command('*', '', (yargs) => {
      inquirer();
    })
    .argv;
})();


