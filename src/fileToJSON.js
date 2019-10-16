'use strict';
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const lineReader = require('readline'); 
const ora = require('ora');
// const {getRcFile,getRc,HOST_REGISTRY,getPckParams,replaceErrMsg} = require('./utils');
const help = require('./help');
var allJson = null;

var walk = function (dir,done) {
    let results = [];
    const root = dir;
    // const root_i18n = dir_i18n;
    let root_i18n = '/Users/jony/workspaces/yonyou/lang/new/yonyou-mdf-framework/packages/mdf-lang/new-resource';

    fs.readdir(dir, (err, list) => {
      if (err) return done(err);
      let pending = list.length;
      if (!pending) return done(null, results);
      list.forEach((file) => {
        file = path.resolve(dir, file);
        fs.stat(file, (err, stat) => { // 来验证是否有这个文件
          if (stat && stat.isDirectory()) { // 文件的嵌套
            var half = file.substring(root.length, file.length);
            if (!fs.existsSync(root_i18n + half)) {
              fs.mkdirSync(root_i18n + half);
            }
            walk(file, root_i18n + half , (err, res) => {
                          results = results.concat(res);
                          if (!--pending) done(null, results);
                      });
          } else { //这是单个文件
            results.push(file);
            var half = file.substring(root.length, file.length);
            if(half.split(".")[1] === "json"){
              console.log(" ==2222== ");
              var oldJson = JSON.parse(fs.readFileSync("/Users/jony/workspaces/yonyou/lang/new/yonyou-mdf-framework/packages/mdf-lang/new-resource/all.js"));
              console.log(" ==== ");
              var _fileJson = JSON.parse(fs.readFileSync(file));
              var newJson = JSON.stringify(Object.assign(_fileJson,oldJson), null, 4);
              fs.writeFileSync("/Users/jony/workspaces/yonyou/lang/new/yonyou-mdf-framework/packages/mdf-lang/new-resource/all.js",newJson);
              console.log("  ---_fileJson- ",newJson);
            }
            // console.log("  ---file- ",file);
            // fs.writeFile(process.cwd()+"/world.json");

            // JSON.stringify(myData, null, 4)

              // let readLine = lineReader.createInterface({
              //   input: fs.createReadStream(file),
              // });// 先创建一个实例
              // let count = 0;
              // readLine.on('line', (line) => {
                 
              //     let lins = line.split("=");
              //     var replaced = '';
              //     replaced = "'"+lins[0]+"':'"+lins[1]+"',"  
              //     console.log(" ==readLine== ",replaced);
              //     fs.appendFileSync(root_i18n+half, replaced+'\n');
              // });
          }
          if (!--pending) done(null, results);
        });
      });
    });
};

module.exports = () => {
    // const spinner = ora().start();
    // spinner.color = 'green';
    console.error(chalk.green('lang string ... '));
    // const rootpaths = indir.split(/\/|\\/);
    // const root_i18n = `${indir.substring(0, indir.length - rootpaths[rootpaths.length - 1].length)}lang_src`; // /Users/yaoxin/Downloads/workspace/cloud-os_manager_fe/i18n
    // if (!fs.existsSync(root_i18n)) { 
    //   fs.mkdirSync(root_i18n);
    // }
    let indir = '/Users/jony/workspaces/yonyou/lang/new/yonyou-mdf-framework/packages/mdf-lang/resource'
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
