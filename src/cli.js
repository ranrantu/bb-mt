'use strict';
const meow = require('meow');
const pkg = require('../package');
const spawn = require('cross-spawn');
const reducer = require('./env/env');
const generator = require('./generator');
const shell = require('shelljs');

reducer.subscribe('--help, -h', function () {
  meow(`
        Usage
          $ bb [args] [options]
    
        Options
          --help, -h  # Display usage guide
          --version   # Print version
    `, {
    flags: {
      rainbow: {
        type: 'boolean',
        alias: 'r'
      }
    },
    argv:'--help',
    description: false
  });
  spawn('bb-init-plugin')
});

reducer.subscribe('-a', function () {
  shell.exec('npm -v');
  console.log('aaa')
})

reducer.subscribe('--init', function () {
  const g = new generator();
  g.generate();
  // g.install();
})

// const child = spawn('node', ['-v'], { stdio: 'inherit' });

reducer.filter();


