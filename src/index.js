'use strict';
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const co = require('co'); 
const help = require('./help');
const LangInit = require('./LangInit');
const LangSync = require('./LangSync');
const fileToJSON = require('./fileToJSON');
const fyJsonToJson = require('./fyJsonToJson');
const jsonToExcel = require('./ExcelOption');

module.exports = {
  plugin: function(options) {
    let commands = options.cmd;
    const argvs = process.argv;
    // console.log(" ----- ",commands[0]);
    // console.log(" ---options-- ",options);
    switch (commands[0]) {
        case "h":
            help.help();
            break;
        case "v":
            help.version();
            break;
        case "init":
          if(commands.length != 2){
            help.help();
            return;
          }
          LangInit(commands[1]);
          break;
          case "json":
              fileToJSON();
          break;
          case "excel":
            if(!process.argv[3]){
              help.help();
            }else{
              jsonToExcel(process.argv[3],process.argv[4]);
            }
        break;
          case "fy":
              fyJsonToJson();
          break;
        case "sync":
          LangSync(); 
          break;
        default:
            help.help();
    }
  }
}