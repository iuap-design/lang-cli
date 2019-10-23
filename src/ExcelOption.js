'use strict';
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
// const lineReader = require('readline'); 
const ora = require('ora');
// const {getRcFile,getRc,HOST_REGISTRY,getPckParams,replaceErrMsg} = require('./utils');
const help = require('./help');
const jexcel = require('xls-write');
const xlsx2json = require('xlsx-json-js');
const parseXlsx = require('excel'); 
const xlsx = require('node-xlsx');
  // console.log(JSON.parse({a:'cc'}))
  // let _header = [{ resourceId: '词条' }];
  // for (let key in langDate) {
  //     console.log(key);
  //     let value = key.replace(key.slice(2),"-"+key.slice(2).toUpperCase());
  //     _header.push({[key]:value})
  //     sheets(key,langDate[key]);
  // }

var excelToJson = function (dir,filename,don) {
  if(!dir)return;
  let excelUrl = dir; 
  const xlsxPath = path.join(dir);
  var newData = {};
  try {
    const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(dir));
    let data = workSheetsFromBuffer[0].data;
    let _data = [...data[0]];
    let itemObj = {},idIndex = 0;
    for (let index = 0; index < data.length; index++) {
      if(index === 0)continue;
      const da = data[index];
      for (let i = 0; i < _data.length; i++) {
        if(i === 0)continue;
        let keyCase = _data[i].toLowerCase().replace('-','')
        if(!itemObj[keyCase]){
          itemObj[keyCase] = {}
        }
        itemObj[keyCase][da[0]] = da[i];
      }
    }
    writeJson(itemObj,don);
  } catch (error) {
    // console(" error ");
  }
};


var writeJson = function (data,don) {
  let filepath = path.join(process.cwd(), "_newPack.json");
  fs.writeFileSync(filepath,JSON.stringify(data,null,4));
  don(filepath);
}

var jsonToExcel = function (dir,filename,don) {
  if(!dir)return;
  let excelUrl = dir; 
  var langDate = JSON.parse(fs.readFileSync(dir));
  if(!langDate){
    console(" read file error !");
    return;
  }
  
  let _items = [];
  for (let key in langDate) { 
    _items.push({'resourceId':key,'zhcn':langDate[key]});
  }
  var data = {
    sheets: [
      {
        header: [{ resourceId: '资源id' }, { zhcn: 'zh-CN' }], 
        items:_items,
        sheetName: '翻译文档',
      },
    ],
    filepath: path.join(process.cwd(), filename),
  }; 
  jexcel.writeXlsx(data);
  don();
};


// let indir = '/Users/jony/workspaces/yonyou/lang/lang-cli/pack.xlsx';
// const filename = 'pack.json';
// excelToJson(indir,filename, () => {
//   console.log(chalk.green(`√ Finish, json to excel success ,file name ${filename} !`));
// });

// console.log("5555");
// let indir = '/Users/jony/workspaces/yonyou/project/imp-dfm-eqp-fe/ucf-common/src/components/lang/pack.json';
// const filename = 'pack.xlsx';
// jsonToExcel(indir,filename, () => {
//   console.log(chalk.green(`√ Finish, Conversion success ,file is ${filename} !`));
// });


module.exports = (common,indir) => {
    console.error(chalk.green('Start converting lang files ... '));
    if(common.indexOf("excel") != -1){ //--excel
      // let indir = 'pack.xlsx';
      excelToJson(indir,'', (file) => {
        console.log("");
        console.log(chalk.green(`√ Finish, Conversion success ,file is ${file} !`));
      });
    }else{// --json 
      // let indir = 'pack.json';
      const filename = Date.now() + '.xlsx';//'pack.xlsx';
      jsonToExcel(indir,filename, () => {
        console.log(chalk.green(`√ Finish, Conversion success ,file is ${filename} !`));
      });
    }
}