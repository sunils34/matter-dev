/* eslint-env node */
const {execSync} = require('child_process');
const logger = require('winston');
logger.level = 'debug';

function execute(command){
  logger.debug(`exec ${command}`);
  // Redirect child stdio to parent's stdio
  execSync(command, {'stdio': [0,1,2]});
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
    logger.info('Waiting 10 seconds before starting app');
    execute('sleep 1');
    execute('cd ./matter-app && npm run dev');
  },
  'stop'(service) {
    const execCommand = 'docker-compose stop';
    execute(addservice(execCommand, service));
    execute('docker-compose ps');
  }
};

module.exports = MatterCli;
