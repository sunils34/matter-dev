#!/usr/bin/env node
var program = require('commander');
var exec = require('sync-exec');
var COMMAND_NAME='matter-dev';
var command;

function execute(command){
  output = exec(command);
  if (output.stdout) console.log(output.stdout);
  if (output.stderr) console.log(output.stderr);
};

function addservice(command) {
  if (!program.all) {
    command += ' ' + (program.service || 'matter-db-sql');
  }
  return command;
}

program
  .arguments('<cmd>')
  .version('0.0.1')
  .option('-a, --all', 'Apply command to all services')
  .option('-s, --service <service>', 'Apply command to specific service')
  .action(function(cmd) {
    command = cmd;
  })
  .parse(process.argv);

let execCommand = null;
switch (command) {
  case 'up':
    execCommand = 'docker-compose up -d';
    execute(addservice(execCommand));
    execute('docker-compose ps');
    break;
  case 'stop':
    execCommand = 'docker-compose stop';
    execute(addservice(execCommand));
    execute('docker-compose ps');
    break;
  default:
    console.log(`Error: unknown command "${command}" for "${COMMAND_NAME}"`);
    console.log(`Run \'${COMMAND_NAME} --help\' for usage.`);
}
