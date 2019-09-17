'use strict';

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

module.exports = {
    help: () => {
        console.log(chalk.green('Usage :'));
        console.log();
        
        console.log(chalk.green(
          `
          Usage:
          ----------------------------------------------------
          lang-cli --lang
           
       
          Options:
          ----------------------------------------------------
            --lang, ysnc
       
          Others:
          ----------------------------------------------------
            
       
          `
        ));
      console.log();
    },
    version: () => {
        console.log();
        console.log(chalk.green('lang-cli Version : ' + require('../package.json').version));
        console.log();
        process.exit();
    },
    info: (msg) => {
      console.log(chalk.cyan("Info : " + msg)); 
    },
    error: (msg) => {
      console.log(chalk.red("Error : " + msg));
    }
}