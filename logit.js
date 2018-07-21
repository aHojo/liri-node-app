let fs = require('fs');

let Log = function () {
    let divider = "\n------------------------------------------\n";

    this.logData = function (data) {
        fs.appendFile('logdata.txt', data + divider, function (err) {
            if(err) {
                console.log('Data ' + data);
            }
        });
    };
};

module.exports = Log;