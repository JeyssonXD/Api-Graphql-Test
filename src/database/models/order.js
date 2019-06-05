const config = require('../config/config');
var bookshelf = require('bookshelf')(config);
bookshelf.plugin('registry');


const order = bookshelf.Model.extend({
    tableName: 'order',
    //constructor
    constructor: function(){
        bookshelf.Model.apply(this,arguments);

        //methods
        this.typeIsValid = () =>{
            /* valid attribute type match with enum defined schema*/
            if(String(this.get('type'))=='CANCELLED' || String(this.get('type'))=="APPROVED"){
                return true;
            }
            return false;
        }
    },

    //relationship
    person: function(){
        return this.belongsTo(require('./person'),"idPerson");
    }
});

module.exports = bookshelf.model('order',order);