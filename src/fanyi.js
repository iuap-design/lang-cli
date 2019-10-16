#! /usr/bin/env node

const qs = require('querystring');
const crypto = require('crypto');
const axios = require('axios');
const chalk = require('chalk');
var cuid = require('cuid');
const translate = require('google-translate-cn-api');
const sha256 = crypto.createHash('sha256');
const log = console.log;

function truncate(q) {
  var len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}


async function fy(str) {
  // console.log("******* ---res--- ",str);
  const cnText = '你好世界';
  translate(cnText, { to: 'en' }).then(console.log);
  translate(cnText, { to: 'zh-cn', domain: 'com' }).then(console.log);
  // let res = await translate(str, { to: 'zh-cn' });//.then(console.log);
  // console.log(" ---res--- ",res);
}

async function fy_back(str) {
  const salt = Date.now();//+cuid();
  const curtime = Math.round(salt / 1000);
  const argsStr = str;//argv.join(' ');
  const APP_KEY = '6352bac0dedbf9e7';
  const SEC_KEY = '2bHmZHOz68od40aqJCD8KmjvEA1ovAkg';
  const params = {
    q: argsStr,
    appKey: APP_KEY,
    salt: salt,
    from: 'auto',
    to: 'auto',
    signType: "v3",
    sign: sha256.update(`${APP_KEY}${truncate(argsStr)}${salt}${curtime}${SEC_KEY}`).digest('hex'),
    curtime,
  }
  console.log("--params--",params);
  var res = await axios.post(`https://openapi.youdao.com/api`, qs.stringify(params));
  const data = res.data;
  // log(" ===",data);
  // if (data.errorCode === '0') {
  //   const { web, basic, translation = [], l } = data;
  //   if (basic && basic.explains) {
  //     log(" ===",basic.explains);
  //     return basic.explains[0];
  //   }
  //   return str; 
  // }
  let resStr = "";
  if (data.errorCode === '0') {
    const { web, basic, translation = [], l } = data;
    log(chalk.yellow(`"${argsStr}" 的翻译结果：`))
    log('----------------000-----------------')
    if (l === 'en2zh-CHS') {
      log('----------------ppppp-----------------')
      if (basic) {
        log(chalk.cyan('音标：'), `英[${basic['uk-phonetic'] || '无'}]  美[${basic['us-phonetic'] || '无'}]`);
        log('---------------------------------')
        log(chalk.cyan('基本解释：'))
        basic.explains.forEach(item => { log(item) })
        log('---------------------------------')
        if (basic.wfs) {
          let wf = '';
          basic.wfs.forEach(item => {
            wf += item.wf.name + '：' + item.wf.value + '；';
          })
          log(wf);
          log('--------------111-------------------')
        }
      } else {
        log(translation.join());
      }
      if (web) {
        log(chalk.cyan('相关翻译：'));
        web.forEach(item => {
          log(`${item.key}: ${item.value.join('，')}`);
        })
      }
    } else {
      log('-------------sdfsd----------------')
      if (basic && basic.explains) {
        log(chalk.cyan('基本翻译：'));
        log(basic.explains.join('，'));
        log('--------------333-------------------')
        resStr = basic.explains[0];
      } else {
        log('-------------cccc------------------',translation)
        log(translation.join());
        resStr = translation[0];
      }
      if (web) {
        log(chalk.cyan('相关翻译：'));
        web.forEach(item => {
          log(`${item.key}: ${item.value.join('，')}`);
        })
      }
    }
  }


  return resStr;
}
module.exports = async (str) => {
  console.log("str====",str);
  return await fy(str);
}