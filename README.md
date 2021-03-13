# Cron-To-Human
A Node.js Library that Convert Cron-Tab Instruction/Expression Format (* * * * * *) to human readable text
 
#### Compatibility
Node >= 0.8

Typescript <= 4.2

## #Install

``` js
    npm install 
```

## #Usage
Simple Intruction

``` js
    
    const toHuman = require('cron-to-human');

    const { error, results } = toHuman.convertInstruction(" * 30 6 * * * ");

    if(error) console.log(error)
    else{
        console.log("Run Job:", results) // Run Job:  06:30 am 
    }
      
```
with days of the week

``` js
    const toHuman = require('cron-to-human');

    const { error, results } = toHuman.convertInstruction(" * 30 6,8 * * 1,7 ");

    if(error) console.log(error)
    else{
        console.log("Run Job:", results) // Run Job:  06:30 am and 08:00 am   sun and mon
    }

```
with days of the week and months
``` js
    const toHuman = require('cron-to-human');

    const { error, results } = toHuman.convertInstruction(" * * 15 * 1,3,7 7 ");

    if(error) console.log(error)
    else{
        console.log("Run Job:", results) // Run Job:  03:00 pm sun  Feb, Apr and Aug
    }

```

### Cron Tab Format - Interval 

 ![Tab Format](https://github.com/vwedesam/images/blob/main/cron-to-human/Screenshot%202021-03-13%20224849.png)

>  __A field may contain an asterisk (*), which always stands for "first-last"__. 
 
>  __Ranges of numbers are allowed. Ranges are two numbers separated with a hyphen. The specified range is inclusive. For example, 8-11 for an 'hours' entry specifies execution at hours 8, 9, 10, and 11.__

>  __Lists are allowed. A list is a set of numbers (or ranges) separated by commas. Examples: "1,2,5,9", "0-4,8-12".__
>  

## Options/Config

>   this package uses __[Cron-parser](https://www.npmjs.com/package/cron-parser)__ internally for parsing and manipulating cron-tab instructions. __It includes support for timezones and DST transitions.__ 
 
 * abr
 * cron-parser Options

 ### #abbr
 
  * type: Boolean
  * description: use abbreciation for Months and days of the week
  * default: true
      
 ### #cron-parser Options
   * for this option check out [cron-parser](https://www.npmjs.com/package/cron-parser) for more options
      
### example with Config options

``` js
    const toHuman = require("cron-to-human")

    const config = {
        abbr: false,
        parser: {
            currentDate: '2016-03-27 00:00:01',
            tz: 'Europe/Athens'
        }
    }

    const { error, results } = toHuman.convertInstruction(" * * 15 * 1,3,7 7 ", config);

    if(error) console.log(error)
    else{
        console.log("Run Job:", results) // Run Job:  03:00 pm sunday  February, April and August
    }

```

## License
### MIT
