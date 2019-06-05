//keys
require('dotenv').config();
//other
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const config = require('../config/config');
var bookshelf = require('bookshelf')(config);
bookshelf.plugin('registry');


const user = bookshelf.Model.extend({
    tableName: 'user',
    //constructor
    constructor: function(){
        bookshelf.Model.apply(this,arguments);

        //methods
          this.generateJWT = () =>{
            return jwt.sign(
              {
              email: this.get('email'),
              active: this.get('active')
            },
            process.env.JWT_SECRETKEY
            );
          },
          this.auth=()=>{
            return this.generateJWT();
          },
          this.isValidPassword = function(passwordTest){
            var thisUser=this;
            return bcrypt.compareSync(passwordTest,thisUser.attributes.password);
          }
    },


    //realationship
    role: function() {
        return this.belongsToMany(require('./role'), 'userRole',"idUser","idRole");
    }
});

module.exports = bookshelf.model('user',user);