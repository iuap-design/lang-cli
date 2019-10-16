'use strict';
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const lineReader = require('readline'); 
const ora = require('ora');
const fy = require('./fanyi');
// const {getRcFile,getRc,HOST_REGISTRY,getPckParams,replaceErrMsg} = require('./utils');
const help = require('./help');


var walk = async function  (dir,done) {
    let results = [];
    var oldJson = JSON.parse(fs.readFileSync(dir));
    // fs.writeFileSync("/Users/jony/workspaces/yonyou/lang/new-resource/fyAll.json",oldJson);
    var _fy = "";var i = 0;
    console.log("----123--fy--",await fy("你好"));
    // console.log("------fy--",await fy("确定"));
    
    // for (var key in oldJson) {
    //   // console.log(i+" -******************-- ",String(oldJson[key]));
    //   let aa = await fy(oldJson[key]);
    //   // _fy += key+":" + await fy(oldJson[key]);
    //   i++;
    //   // console.log("***end****",aa);
    // }
};

module.exports = () => {
    let indir = '/Users/jony/workspaces/yonyou/lang/new-resource/all-qu.json'
    walk(indir, (err, results) => {
      if (err) throw err;
      console.log(chalk.green(`√ Finish, lang is success !`));
      // stop(spinner);
    });
    
}
 

function stop(spinner){
  if(!spinner)return;
  spinner.stop();
  process.exit(0);
}
