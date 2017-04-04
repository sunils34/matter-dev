/* eslint-env node */
const {execSync} = require('child_process');
const logger = require('winston');
const path = require('path');
const dir = path.resolve(__dirname + '/..');
logger.level = 'debug';

logger.info('working dir', dir);

function execute(command) {
  logger.debug(`exec ${command}`);
  // Redirect child stdio to parent's stdio
  execSync(`cd ${dir} && ${command}`, {'stdio': [0,1,2]});
}

function addservice(command, service) {
  command += ' ' + (service || 'matter-db-sql');
  return command;
}

var MatterCli = {
  'build'(service) {
    execute(addservice('docker-compose build --no-cache', service));
    execute('cd ./matter-app && npm install');
  },
  'clean'(service) {
    execute('rm -rf ./data');
    execute(addservice('docker-compose stop', service));
    execute(addservice('docker-compose rm -f', service));
  },
  'ps'() {
    execute('docker-compose ps');
  },
  'start'(service) {
    logger.info('Starting dev environment');
    const execCommand = 'docker-compose up -d';
    execute(addservice(execCommand, service));
    execute('docker-compose ps');
    logger.info('Waiting 10 seconds for the database to start');
    execute('sleep 10');
    execute('cd ./matter-app && npm run dev');
  },
  'stop'(service) {
    const execCommand = 'docker-compose stop';
    execute(addservice(execCommand, service));
    execute('docker-compose ps');
  }
};

module.exports = MatterCli;
