const config = require('../config/config');
var bookshelf = require('bookshelf')(config);
bookshelf.plugin('registry');

const role = bookshelf.Model.extend({
    tableName: 'role',
    //constructor
    constructor: function(){
        bookshelf.Model.apply(this,arguments);


    },

    //realationship
    user : function() {
        return this.belongsToMany(require('./user'), 'userRole',"idRole","idUser");
    }
});

module.exports = bookshelf.model('role',role);