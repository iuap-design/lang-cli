'use strict';
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const lineReader = require('readline');
const ora = require('ora');
// const {getRcFile,getRc,HOST_REGISTRY,getPckParams,replaceErrMsg} = require('./utils');
const help = require('./help');


var walk = function (dir, dir_i18n, done) {
  let results = [];
  const root = dir;
  const root_i18n = dir_i18n;

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
          walk(file, root_i18n + half, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else { //这是单个文件
          results.push(file);
          var half = file.substring(root.length, file.length);
          // 20180531新增判断如果不是js文件，则不用解析了
          if (file.match(/.jpg|.gif|.png|.bmp|.svg|.css|.woff/i)) {
            //fs.copyFileSync(file,root_i18n+half);
            fs.writeFileSync(root_i18n + half, fs.readFileSync(file));
          } else {
            let readLine = lineReader.createInterface({
              input: fs.createReadStream(file),
            });// 先创建一个实例
            let count = 0;
            readLine.on('line', (line) => {
              var spieces = line;// 拿到所有字符串
              var re = /[\u4E00-\u9FA5]+([\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[0-9]|[\?\,\。\.\、])+/g;
              var regNote = /(^.*\/\/|^\s*\/\*.*\*\/$)/g; // 存在的问题：中文展示后面有注释
              var replaced = ''
              var matchNote = spieces.match(regNote);
              // 添加一个判断 是否是注释
              if (matchNote) {
                replaced = replaced + spieces;
              } else {
                var match = spieces.match(re);//取到中文
                // 20180605 新增判断，如果一行代码多处匹配
                if (match) { // 由此可见值校验前半段
                  if (match.length > 1) {
                    // 一行逐一替换
                    var subMatch;
                    replaced = spieces;
                    match.map((item) => {
                      subMatch = 'language.template("' + item + '")';
                      //   console.log(replaced);
                      console.log("'" + item + "'");
                      console.log(replaced.indexOf('"' + item + '"'));
                      //   replaced = replaced.replace('"'+item+'"', subMatch);
                      //  replaced = replaced.replace(item, subMatch);

                      if (replaced.indexOf("'" + item + "'") > -1) {
                        replaced = replaced.replace('"' + item + '"', subMatch);
                      } else if (replaced.indexOf('"' + item + '"') > -1) {
                        replaced = replaced.replace('"' + item + '"', subMatch);
                      } else if (replaced.indexOf("`" + item + "`") > -1) {
                        replaced = replaced.replace("`" + item + "`", subMatch);
                      } else {
                        replaced = replaced.replace(item, subMatch);
                      }

                      //   replaced = replaced.replace("'"+item+"'", subMatch);
                      //  replaced = replaced.replace('"'+item+'"', subMatch);
                      //  replaced = replaced.replace(item, subMatch);
                      //  replaced = replaced.replace("`"+item+"`", subMatch);

                      // 中文抽取
                      var key = file.substring(dir.length + 1) + (count++);
                      var input = JSON.stringify({ [item]: item });
                      fs.appendFileSync('world.json', input + ',\n');

                    })
                  } else { //只有一处匹配那么全局替换就可以
                    var replacement = 'language.template("' + match[0] + '")';
                    replaced = replaced + spieces.replace(re, replacement);

                    // 中文抽取
                    var key = file.substring(dir.length + 1) + (count++)
                    var input = JSON.stringify({ [match[0]]: match[0] });
                    fs.appendFileSync('world.json', input + ',\n');
                  }
                } else {
                  replaced = replaced + spieces;
                }
              }
              fs.appendFileSync(root_i18n + half, replaced + '\n');
            });
          }

        }
        if (!--pending) done(null, results);
      });
    });
  });
};

module.exports = (indir) => {
  // const spinner = ora().start();
  // spinner.color = 'green';
  console.error(chalk.green('lang string ... '));
  const rootpaths = indir.split(/\/|\\/);
  const root_i18n = `${indir.substring(0, indir.length - rootpaths[rootpaths.length - 1].length)}lang_src`; // /Users/yaoxin/Downloads/workspace/cloud-os_manager_fe/i18n
  console.log(" __dirname---- ",process.cwd());
  fs.writeFile(process.cwd()+"/world.json");
  if (!fs.existsSync(root_i18n)) {
    fs.mkdirSync(root_i18n);
  }
  walk(indir, root_i18n, (err, results) => {
    if (err) throw err;
    console.log(chalk.green(`√ Finish, lang is success !`));
    // stop(spinner);
  });

}


function stop(spinner) {
  if (!spinner) return;
  spinner.stop();
  process.exit(0);
}
