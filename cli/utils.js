/* eslint-env node */
const {execSync} = require('child_process');
const logger = require('winston');
logger.level = 'debug';
const path = require('path');
const dir = path.resolve(path.join(__dirname, '/..'));
logger.info('working dir', dir);

module.exports = {
  'execute'(command) {
    logger.debug(`exec ${command}`);
    // Redirect child stdio to parent's stdio
    execSync(`cd ${dir} && ${command}`, {'stdio': [0,1,2]});
  }
};
