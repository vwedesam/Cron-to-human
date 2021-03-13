'use-strict'

const parser =  require("cron-parser");
const Utils = require("./utils");

function toHuman() {} 

// @params
//      @instruction: cron-instruction
//      @config: Cron-parser configuration
// @return:
//      @Object:
//          @fields:
//              second: [], minute: [], hour: [], month: [], dayOfMonth: [], dayOfWeek:[];
//          error
toHuman._init = function(instruction, config = {}) {
    
    try {
        const interval = parser.parseExpression(instruction, config);
        const fields = JSON.parse(JSON.stringify(interval.fields));

        return { fields, error: null };

    } catch (error) {
        return { fields: null, error: error.toString() }
    }
}

// @params
//      @data: Array
//      @resolveFunction: int ---> utils.js
// @return:
//      String- seperated by comma(,), and 
toHuman.convert = function(data, resolveFunction){
    return data.map(day=> resolveFunction(day)).join(", ").replace(/,\s([^,]+)$/, " and $1 ");
}

// toHuman.convert------
// @params
//      @fields: Object of Array
// @return:
//      convertation
toHuman.convertTime = function(fields){

    const maxUnitLength = Utils.validateAndGetMaxLength([fields.second, fields.minute, fields.hour]);

    const sec = Utils.resolveSecond(fields.second, maxUnitLength);
    const min = Utils.resolveMinute(fields.minute, maxUnitLength);
    const hour = Utils.resolveHour(fields.hour, maxUnitLength);
    // empty Array of any Length is not Iteratable
    const newArr = Utils.resolveNewArray(Array(0), maxUnitLength);
    
    return newArr.map((e, i)=>{ 
        return Utils.resolveAndconvertTime(hour[i], min[i], sec[i]); 
    }).join(", ").replace(/,\s([^,]+)$/, " and $1 ");

}

// @params
//      @fields: Object of Array
// @return:
//      convertation
toHuman.convertDayOfMonth = function(fields){
    return Utils.validateFieldLength(fields.dayOfMonth, 'dayOfMonth', (err, data) => {
        return err ? ""  :  toHuman.convert(data, Utils.resolveDayOfMonth);
    });
}

toHuman.convertMonthOfYear = function(fields){
     return Utils.validateFieldLength(fields.month, 'monthOfYear', (err, data) => {
        return err ? ""  : toHuman.convert(data, Utils.resolveMonthOfYear);
     })
}

toHuman.convertDayOfWeek = function(fields){
    return Utils.validateFieldLength(fields.dayOfWeek, 'dayOfWeek', (err, data) => {
        return err ? ""  : toHuman.convert(data, Utils.resolveDayOfWeek);
     })
}

// @params
//      @cronInstruction: valid cron instruction format
//      @config
//          @abbr: set display option - true or False
//          @parser: cron-parser Configuration
// @return
//      valid Human convertation/equivalent of  Cron Instruction

toHuman.convertInstruction = function(cronInstruction, config = { abbr: true, parser: {} }){

    const { fields, error } = toHuman._init(cronInstruction, config.parser);
    if(typeof config.abbr != "boolean") return `invalid 'abbr' value, Boolean expected`;
    Utils.abbr = config.abbr; // set display options
    if(error) return { error, results: null };

    const results = ` ${toHuman.convertTime(fields)} ${toHuman.convertDayOfWeek(fields)} ${toHuman.convertDayOfMonth(fields)} ${toHuman.convertMonthOfYear(fields)} `;
    
    return { error: null, results: results };

}

module.exports = toHuman;
