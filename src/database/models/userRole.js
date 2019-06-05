const config = require('../config/config');
var bookshelf = require('bookshelf')(config);
bookshelf.plugin('registry');

const userRole = bookshelf.Model.extend({
    tableName: 'userRole',
    //constructor
    constructor: function(){
        bookshelf.Model.apply(this,arguments);
    }
});

module.exports = bookshelf.model('userRole',userRole);