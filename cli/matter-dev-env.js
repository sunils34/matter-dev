/* eslint-env node */
const logger = require('winston');
const {execute} = require('./utils');
logger.level = 'debug';

function addservice(command, service) {
  command += ' ' + (service || 'matter-db-sql');
  return command;
}

var MatterCli = {
  'build'(service) {
    if (service === 'marketing-local') {
      execute('cd ./matter-marketing && npm install');
    } else {
      execute(addservice('docker-compose build --no-cache', service));
      execute('cd ./matter-app && npm install');
    }
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
    if (service === 'marketing-local') {
      execute('cd ./matter-marketing && npm run start-dev');
    } else {
      logger.info('Starting dev environment');
      const execCommand = 'docker-compose up -d';
      execute(addservice(execCommand, service));
      execute('docker-compose ps');
      logger.info('Waiting 10 seconds for the database to start');
      execute('sleep 10');
      execute('cd ./matter-app && npm run dev');
    }
  },
  'stop'(service) {
    const execCommand = 'docker-compose stop';
    execute(addservice(execCommand, service));
    execute('docker-compose ps');
  }
};

module.exports = MatterCli;
