const config = require('../config/config');
var bookshelf = require('bookshelf')(config);
bookshelf.plugin('registry');

var validator = require('validator');


const person = bookshelf.Model.extend({
    tableName: 'person',
    //constructor
    constructor: function(){
        bookshelf.Model.apply(this,arguments);

        //methods
        this.isValid = () =>{
            var error = false;
            if(!validator.isAlpha(this.get('name')) || this.get('name')==null)error=true;
            if(!validator.isNumeric(""+this.get('age')) && this.get('age')!=null)error=true;
            if(!validator.isBoolean(""+this.get('active')) || this.get('active')==null)error=true;
            return error;
        }
    },

    //relationship
    order: function(){
        return this.hasMany(require('./order'),'idPerson');
    }
});

module.exports = bookshelf.model('person',person);