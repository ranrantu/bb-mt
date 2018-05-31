'use strict';
const command = process.argv.slice(2);
const cliArray = [];
const argv = require('yargs').argv;

const mainArgv = argv._;
console.log(mainArgv);

const reducer = module.exports;

reducer.subscribe = function (cli, callback) {
  cliArray.push(function (){
    const cliMap = cli.split(',').map(item => item.trim());
    const intersection = cliMap.filter(v => command.includes(v));
    if (intersection.length > 0) {
      callback && callback();
      return true;
    }
  })
}

reducer.filter = function (){
  cliArray.some(fn=>!!fn());
}
