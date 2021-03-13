'use-strict'
const Num = require("./valid-field-num");

function Utils() { }

Utils.dayOfweek = ["sunday", "monday", "tuesday", "wednessday", "thursday", "friday", "saturday", "sunday"];
Utils._dayOfweek = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat", "sun"];

Utils.monthOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Utils._monthOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// 
Utils.abbr = 'true';

// @params
//      @fields: Array
//      @name: @Num[name] -  valid field Number
//      @callback: @return
// @return: 
//      @object: error, field
Utils.validateFieldLength = function (field, name, callback) {
    // console.log("field", field.length)
    if (field.length == Num[name]) return callback('error', []);
    else return callback(null, field);
}

// @params
//      @Array ......
//          array of length of all Time Unit  
// @return: int
//      max number 
Utils.validateAndGetMaxLength = function (unitLength) {
    const unitMap = ['second', 'minute', 'hour'];
    const validUnit = unitLength.map((unit, i) => {
        return Utils.validateFieldLength(unit, unitMap[i], (err, data) => {
            if (err) return 1;
            else return data.length;
        })
    })
    return Math.max(...validUnit);
}

// @params
//      @unit
//      @Max length of all Units
// @return:
//      @Array of standard length
Utils.makeUnitsStandard = function (unit, maxOfAllUnits) {
    const newUnit = unit;
    for (let i = unit.length; i < maxOfAllUnits; i++) {
        newUnit.push('00');
    }
    return newUnit;
}


// Utils.resolve_______
// @params 
//      @num of cron Instruction
// @return: 
//      Human equivalent

Utils.resolveSecond = function (sec, max) {
    return Utils.validateFieldLength(sec, 'second', (err, data) => {
        return Utils.makeUnitsStandard(data, max);
    })
}

Utils.resolveMinute = function (min, max) {
    return Utils.validateFieldLength(min, 'minute', (err, data) => {
        return Utils.makeUnitsStandard(data, max);
    })
}

Utils.resolveHour = function (hour, max) {
    return Utils.validateFieldLength(hour, 'hour', (err, data) => {
        return Utils.makeUnitsStandard(data, max);
    })
}

Utils.resolveNewArray = function (newArray, max) {
    return Utils.makeUnitsStandard(newArray, max);
}

Utils.resolveAndconvertTime = function (hour, min, sec) {
    
    const time = {}
    let a = "am";
    if(hour != '00') {
        time.hour = hour
        if(hour > 12) {
            a = "pm"
            time.hour = (hour - 12)
        }
    };
    time.min = min;
    if(sec != '00') time.sec = sec;

    let values = Object.values(time).map((unit)=>{
        if(unit <= 10) return unit.toString().padStart(2, 0);
        return unit.toString()
    }); // format unit

    if( values.length == 3) return `${ values.join(":")} ${a}`

    if( values.length == 2 ){
        if( min == '00' ) delete time.min
        if( Object.keys(time).includes("hour") )  return `${ values.join(":")} ${a}`
        return `${values.join(":")} sec`
    }

    const key = Object.keys(time);
    return `${time[key]} ${ key == 'hour' ? a : key }`;
}

Utils.resolveDayOfWeek = function (num) {
    return Utils.abbr ? Utils._dayOfweek[num] : Utils.dayOfweek[num];
}

Utils.resolveMonthOfYear = function (num) {
    return Utils.abbr ? Utils._monthOfYear[num] : Utils.monthOfYear[num];
}

Utils.resolveDayOfMonth = function (num) {

    const last_num = num.toString().slice(-1);
    if (num.toString().length >= 1 && last_num == "0") {
        return `${num} th`;
    }
    else if (last_num == "2") {
        return `${num} nd`;
    }
    else if (last_num == "3") {
        return `${num} rd`;
    }
    else {
        return `${num} th`;
    }
}



module.exports = Utils;