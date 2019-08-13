//bookshelf js
const config = require('../config/config');
var bookshelf = require('bookshelf')(config);
var cascadeDelete = require('bookshelf-cascade-delete');
bookshelf.plugin('registry');
bookshelf.plugin(cascadeDelete);
bookshelf.plugin('pagination')
//other package npm
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
    },
    notificationPerson: function(){
        return this.hasMany(require('./notificationPerson','idPerson'));
    }
},

{
    dependents:['order']
});

module.exports = bookshelf.model('person',person);