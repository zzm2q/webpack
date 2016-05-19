var fs = require('fs');
var path = require('path');

module.exports = function() {
    var files = fs.readdirSync(__dirname + '/../');
    return files.filter(function(file)  {
        return path.extname(file) === '.html';
    }).map(function(file) {
        return path.basename(file, '.html');
    });
};
