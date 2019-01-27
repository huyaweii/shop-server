var log4js = require('log4js')
var path = require('path')
var fs = require('fs')
var basePath = path.resolve(__dirname,'../logs')

var errorPath = basePath+'/errors/'
var resPath = basePath+'/responses/'

var errorFilename = errorPath+'/error'
var resFilename = resPath+'/response'

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
var confirmPath = function(pathStr) {
    if(!fs.existsSync(pathStr)){
        fs.mkdirSync(pathStr);
        console.log('createPath: ' + pathStr);
    }
}

log4js.configure({
    appenders: {
        "errorFile": {
            category:'errorLog',           //logger名称
            type:'dateFile',               //日志类型
            filename:errorFilename,        //日志输出位置
            alwaysIncludePattern:true,    //是否总是有后缀名
            pattern:'-yyyy-MM-dd.log'   //后缀，每小时创建一个新的日志文件
        }
    },
    categories: {
        default: { appenders: [ 'errorFile'], level: 'error' }
    },
    replaceConsole:true              //是否替换console.log
})

//创建log的根目录'logs'
if(basePath){
    confirmPath(basePath)
    //根据不同的logType创建不同的文件目录
    confirmPath(errorPath)
    confirmPath(resPath)
}

module.exports = log4js